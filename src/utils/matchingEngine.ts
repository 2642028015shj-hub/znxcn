import { 
  CustomerRequirement, 
  InternalProduct, 
  MatchResult, 
  SpecEvaluationItem,
  ChemicalEvaluationItem, 
  MechanicalEvaluationItem,
  RecommendationType
} from '../types';

// 常用钢种别名与等效族系知识图谱
const GRADE_ALIASES: Record<string, string[]> = {
  '42crmo': ['42crmo', '42crmo4', '4140', '4142', '1.7225', 'scm440'],
  '42crmo4': ['42crmo', '42crmo4', '4140', '4142', '1.7225', 'scm440'],
  '4140': ['42crmo', '42crmo4', '4140', '4142', '1.7225', 'scm440'],
  '40cr': ['40cr', '5140', '41cr4', '1.7035', 'scr440'],
  '316l': ['316l', '022cr17ni12mo2', 's31603', '1.4404', 'sus316l'],
  '316': ['316', '316l', '06cr17ni12mo2', 's31600', '1.4401'],
  '304': ['304', '06cr19ni10', 's30408', '1.4301', 'sus304'],
  '2205': ['2205', 's32205', 's31803', '022cr22ni5mo3n', '1.4462'],
  'q355': ['q355', 'q355b', 'q355c', 'q355d', 'q355ne', 's355', 's355nl', 's355j2', 'a572gr50'],
  'q355b': ['q355', 'q355b', 'q355c', 'q355d', 'q355ne', 's355', 's355nl', 's355j2', 'a572gr50'],
  'q355ne': ['q355ne', 's355nl', 'q355d', 'q355e', '1.0546'],
  'q460': ['q460', 'q460d', 'q460e', 's460', 's460ql'],
  'h13': ['h13', '4cr5mosiv1', '1.2344', 'skd61', 't20813'],
  'd2': ['d2', 'cr12mov', '1.2379', 'skd11'],
  'cr12mov': ['d2', 'cr12mov', '1.2379', 'skd11'],
  'c276': ['c276', 'hastelloyc276', 'n10276', '2.4819', 'ns3304'],
  'hastelloyc276': ['c276', 'hastelloyc276', 'n10276', '2.4819', 'ns3304'],
  '6061': ['6061', '6061t6', 'aa6061', 'enaw6061'],
  '20crmnti': ['20crmnti', '20crmntih', '5120', 'smnc420'],
  'gcr15': ['gcr15', '52100', '100cr6', 'suj2', '1.3505']
};

function normalizeGrade(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 评价牌号与标准的相似吻合度 (0 - 100)
 */
function evaluateGradeMatch(reqGrade: string, reqStandard: string, product: InternalProduct): number {
  if (!reqGrade.trim()) return 80;

  const normReq = normalizeGrade(reqGrade);
  const normCode = normalizeGrade(product.code);
  const normName = normalizeGrade(product.name);
  const normGb = normalizeGrade(product.equivalentGrades.gb || '');
  const normAstm = normalizeGrade(product.equivalentGrades.astm || '');
  const normEn = normalizeGrade(product.equivalentGrades.en || '');
  const normJis = normalizeGrade(product.equivalentGrades.jis || '');

  // 1. 完全包含或者相等
  const allEquivs = [normCode, normName, normGb, normAstm, normEn, normJis];
  for (const eq of allEquivs) {
    if (eq === normReq || (eq.length > 2 && normReq.length > 2 && (eq.includes(normReq) || normReq.includes(eq)))) {
      return 100;
    }
  }

  // 2. 查验别名族系
  for (const [key, aliases] of Object.entries(GRADE_ALIASES)) {
    const normKey = normalizeGrade(key);
    const reqInFamily = normReq.includes(normKey) || aliases.some(a => normReq.includes(normalizeGrade(a)));
    if (reqInFamily) {
      const prodInFamily = allEquivs.some(eq => eq.includes(normKey) || aliases.some(a => eq.includes(normalizeGrade(a))));
      if (prodInFamily) {
        return 98;
      }
    }
  }

  // 3. 关联同族跨级相近关系
  if (normReq.includes('40cr') && normCode.includes('42crmo')) return 85;
  if (normReq.includes('42crmo') && normCode.includes('40cr')) return 78;
  if (normReq.includes('316') && normCode.includes('2205')) return 86; // 双相钢升级
  if (normReq.includes('316') && normCode.includes('304')) return 65; // 304低成本降级
  if (normReq.includes('304') && normCode.includes('316')) return 90; // 316性能提升
  if (normReq.includes('q355') && normCode.includes('q460')) return 88; // 高强升级
  if (normReq.includes('q355') && normCode.includes('q355')) return 95;

  // 标准加分
  if (reqStandard && product.standard.toLowerCase().includes(reqStandard.toLowerCase().trim())) {
    return 80;
  }

  return 50;
}

/**
 * 评价化学成分吻合度与生成对比明细
 */
function evaluateChemicalConformity(
  clientChemical: Record<string, { min?: number; max?: number; target?: number }>,
  product: InternalProduct
): { score: number; evaluation: ChemicalEvaluationItem[] } {
  const elements = Object.keys(clientChemical);
  if (elements.length === 0) {
    return { score: 90, evaluation: [] };
  }

  let totalWeight = 0;
  let accumulatedScore = 0;
  const evaluation: ChemicalEvaluationItem[] = [];

  for (const el of elements) {
    const req = clientChemical[el];
    if (req.min === undefined && req.max === undefined && req.target === undefined) {
      continue;
    }

    // 关键元素赋予更高权值 (C, Cr, Ni, Mo, S, P)
    let weight = 1.0;
    if (['C', 'Cr', 'Ni', 'Mo'].includes(el)) weight = 2.0;
    if (['P', 'S'].includes(el)) weight = 1.5;

    totalWeight += weight;

    const prodRange = product.composition[el];
    let clientRangeStr = '';
    if (req.min !== undefined && req.max !== undefined) {
      clientRangeStr = `${req.min} ~ ${req.max}%`;
    } else if (req.min !== undefined) {
      clientRangeStr = `≥ ${req.min}%`;
    } else if (req.max !== undefined) {
      clientRangeStr = `≤ ${req.max}%`;
    } else if (req.target !== undefined) {
      clientRangeStr = `目标 ${req.target}%`;
    }

    if (!prodRange) {
      // 内部产品未列出该元素
      accumulatedScore += weight * 60;
      evaluation.push({
        element: el,
        matchScore: 60,
        status: 'neutral',
        clientRangeStr,
        productRangeStr: '未作专门限定 / 痕量',
        overlapPercent: 50,
        note: '本品成分中未作特别添加，符合常规公差控制。',
      });
      continue;
    }

    const prodRangeStr = `${prodRange.min} ~ ${prodRange.max}% (典型 ${prodRange.typical}%)`;

    // 计算重叠度与合规性
    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let overlapPercent = 100;
    let note = '完全吻合客户公差要求范围';
    let elScore = 100;

    // 针对有害杂质元素 P, S：越低越好
    if (el === 'P' || el === 'S') {
      const clientMax = req.max ?? 0.035;
      if (prodRange.max <= clientMax) {
        status = 'ok';
        overlapPercent = 100;
        elScore = 100;
        note = `优异！内部控制上限(${prodRange.max}%)严于客户要求(≤${clientMax}%)，纯净度更高。`;
      } else {
        const excess = prodRange.max - clientMax;
        if (excess <= 0.005) {
          status = 'warning';
          overlapPercent = 85;
          elScore = 80;
          note = `略微宽放：公司内部控制上限比要求微高 ${excess.toFixed(3)}%。`;
        } else {
          status = 'alert';
          overlapPercent = 60;
          elScore = 50;
          note = `超差预警：公司上限超出客户要求，需确认是否接受或申请特炼。`;
        }
      }
    } else {
      // 主合金元素
      const reqMin = req.min ?? 0;
      const reqMax = req.max ?? 999;

      if (prodRange.min >= reqMin && prodRange.max <= reqMax) {
        // 完全落在客户要求的范围内
        status = 'ok';
        overlapPercent = 100;
        elScore = 100;
        note = '完全落在客户图纸公差带内，无需调整工艺。';
      } else if (prodRange.min < reqMin && prodRange.max > reqMax) {
        status = 'warning';
        overlapPercent = 75;
        elScore = 75;
        note = '内部产品公差带略宽于客户指定窄范围。';
      } else if (prodRange.max < reqMin) {
        status = 'alert';
        overlapPercent = 40;
        elScore = 40;
        note = `含量偏低：产品上限(${prodRange.max}%)低于客户最低要求(${reqMin}%)。`;
      } else if (prodRange.min > reqMax) {
        status = 'warning';
        overlapPercent = 65;
        elScore = 65;
        note = `含量较高：产品下限(${prodRange.min}%)高于要求上限(${reqMax}%)，耐蚀/淬透性更强但成本略高。`;
      } else {
        // 部分重叠
        const overlapMin = Math.max(reqMin, prodRange.min);
        const overlapMax = Math.min(reqMax, prodRange.max);
        const overlapSpan = Math.max(0, overlapMax - overlapMin);
        const prodSpan = Math.max(0.001, prodRange.max - prodRange.min);
        overlapPercent = Math.min(100, Math.round((overlapSpan / prodSpan) * 100));

        if (overlapPercent >= 70) {
          status = 'ok';
          elScore = 90;
          note = `大部分区间重叠(${overlapPercent}%)，中位典型值在控制范围内。`;
        } else {
          status = 'warning';
          elScore = 75;
          note = `部分重叠(${overlapPercent}%)，出厂检验可按内控窄带挑选发货。`;
        }
      }
    }

    accumulatedScore += weight * elScore;
    evaluation.push({
      element: el,
      matchScore: Math.round(elScore),
      status,
      clientRangeStr,
      productRangeStr: prodRangeStr,
      overlapPercent,
      note,
    });
  }

  const finalScore = totalWeight > 0 ? Math.round(accumulatedScore / totalWeight) : 85;
  return { score: finalScore, evaluation };
}

/**
 * 评价力学性能达标度与对比
 */
function evaluateMechanicalCompliance(
  req: CustomerRequirement['mechanical'],
  product: InternalProduct
): { score: number; evaluation: MechanicalEvaluationItem[] } {
  let scoreSum = 0;
  let count = 0;
  const evaluation: MechanicalEvaluationItem[] = [];

  // 1. 屈服强度 Rp0.2 / ReH
  if (req.yieldMin !== undefined && req.yieldMin > 0) {
    count++;
    const clientYield = req.yieldMin;
    const prodYieldMin = product.mechanical.yield.min;
    const prodYieldTyp = product.mechanical.yield.typical;
    const margin = prodYieldTyp - clientYield;
    const marginPct = Math.round((margin / clientYield) * 100);

    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let itemScore = 100;
    let marginStr = '';

    if (prodYieldMin >= clientYield) {
      status = 'ok';
      marginStr = `富余 +${marginPct}% (${margin} MPa)`;
      itemScore = 100;
    } else if (prodYieldTyp >= clientYield) {
      status = 'warning';
      marginStr = `典型值达标，保证下限微差 -${clientYield - prodYieldMin} MPa`;
      itemScore = 80;
    } else {
      status = 'alert';
      marginStr = `不足 -${Math.abs(marginPct)}% (${margin} MPa)`;
      itemScore = Math.max(30, 100 - Math.abs(marginPct) * 3);
    }

    scoreSum += itemScore;
    evaluation.push({
      property: '规定塑性延伸强度 Rp0.2 / ReH',
      matchScore: Math.round(itemScore),
      unit: 'MPa',
      status,
      clientReqStr: `≥ ${clientYield} MPa`,
      productValStr: `≥ ${prodYieldMin} (典型 ${prodYieldTyp})`,
      marginStr,
    });
  }

  // 2. 抗拉强度 Rm
  if (req.tensileMin !== undefined && req.tensileMin > 0) {
    count++;
    const clientRm = req.tensileMin;
    const prodRmMin = product.mechanical.tensile.min;
    const prodRmTyp = product.mechanical.tensile.typical;
    const margin = prodRmTyp - clientRm;
    const marginPct = Math.round((margin / clientRm) * 100);

    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let itemScore = 100;

    if (prodRmMin >= clientRm) {
      status = 'ok';
      itemScore = 100;
    } else if (prodRmTyp >= clientRm) {
      status = 'warning';
      itemScore = 85;
    } else {
      status = 'alert';
      itemScore = Math.max(30, 100 - Math.abs(marginPct) * 3);
    }

    const maxStr = req.tensileMax ? ` ~ ${req.tensileMax}` : '';
    const prodMaxStr = product.mechanical.tensile.max ? ` ~ ${product.mechanical.tensile.max}` : '';

    scoreSum += itemScore;
    evaluation.push({
      property: '抗拉强度 Rm',
      matchScore: Math.round(itemScore),
      unit: 'MPa',
      status,
      clientReqStr: `${clientRm}${maxStr} MPa`,
      productValStr: `${prodRmMin}${prodMaxStr} (典型 ${prodRmTyp})`,
      marginStr: margin >= 0 ? `富余 +${marginPct}%` : `低于要求 ${marginPct}%`,
    });
  }

  // 3. 断后伸长率 A%
  if (req.elongationMin !== undefined && req.elongationMin > 0) {
    count++;
    const clientA = req.elongationMin;
    const prodA = product.mechanical.elongation.min;
    const prodATyp = product.mechanical.elongation.typical;

    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let itemScore = 100;

    if (prodA >= clientA) {
      status = 'ok';
      itemScore = 100;
    } else if (prodATyp >= clientA) {
      status = 'warning';
      itemScore = 85;
    } else {
      status = 'alert';
      itemScore = 60;
    }

    scoreSum += itemScore;
    evaluation.push({
      property: '断后伸长率 A',
      matchScore: Math.round(itemScore),
      unit: '%',
      status,
      clientReqStr: `≥ ${clientA} %`,
      productValStr: `≥ ${prodA}% (典型 ${prodATyp}%)`,
      marginStr: prodATyp >= clientA ? `延展塑性充裕 (+${prodATyp - clientA}%)` : `延性指标略低`,
    });
  }

  // 4. 冲击吸收功 KV2 / AKV
  if (req.impactMin !== undefined && req.impactMin > 0) {
    count++;
    const clientImp = req.impactMin;
    const prodImp = product.mechanical.impact;

    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let itemScore = 100;
    let prodStr = '未作低温冲击规定';
    let marginStr = '';

    if (prodImp) {
      prodStr = `≥ ${prodImp.energy} J (${prodImp.temp})`;
      if (prodImp.energy >= clientImp) {
        status = 'ok';
        itemScore = 100;
        marginStr = `富余 +${prodImp.energy - clientImp} J`;
      } else {
        status = 'warning';
        itemScore = 75;
        marginStr = `微差 -${clientImp - prodImp.energy} J`;
      }
    } else {
      status = 'warning';
      itemScore = 65;
      marginStr = '需协议加试冲击性能';
    }

    scoreSum += itemScore;
    evaluation.push({
      property: `冲击吸收功 (${req.impactTemp || '常温'})`,
      matchScore: Math.round(itemScore),
      unit: 'J',
      status,
      clientReqStr: `≥ ${clientImp} J (${req.impactTemp || '常温'})`,
      productValStr: prodStr,
      marginStr,
    });
  }

  // 5. 硬度
  if (req.hardnessMin !== undefined || req.hardnessMax !== undefined) {
    count++;
    const prodHardness = product.mechanical.hardness;
    const hardScore = 90;
    scoreSum += hardScore;
    evaluation.push({
      property: `交货/使用硬度 (${req.hardnessScale || 'HBW'})`,
      matchScore: hardScore,
      unit: req.hardnessScale || 'HBW',
      status: 'ok',
      clientReqStr: `${req.hardnessMin ?? ''} ~ ${req.hardnessMax ?? ''} ${req.hardnessScale || 'HBW'}`,
      productValStr: prodHardness ? `${prodHardness.value} ${prodHardness.scale}` : '出厂退火/可调质',
      marginStr: '热处理可调控匹配',
    });
  }

  const finalScore = count > 0 ? Math.round(scoreSum / count) : 85;
  return { score: finalScore, evaluation };
}

/**
 * 评价产品规格尺寸吻合度与生成对比明细 (0 - 100)
 */
export function evaluateSpecCompliance(
  reqThicknessMin: number | undefined,
  reqThicknessMax: number | undefined,
  reqWidthMin: number | undefined,
  reqWidthMax: number | undefined,
  product: InternalProduct
): { score: number; evaluation: SpecEvaluationItem[] } {
  const evaluation: SpecEvaluationItem[] = [];
  const prodSpecs = product.specifications || {
    thicknessMin: 10,
    thicknessMax: 200,
    widthMin: 800,
    widthMax: 2500,
    sizeRangeDisplay: '常规工业规格',
  };

  const hasThicknessReq = reqThicknessMin !== undefined || reqThicknessMax !== undefined;
  const hasWidthReq = reqWidthMin !== undefined || reqWidthMax !== undefined;

  // 如果客户未指定规格尺寸限制，判定为全规格兼容，满分 100
  if (!hasThicknessReq && !hasWidthReq) {
    evaluation.push({
      dimension: '厚度/截面规格与宽度',
      matchScore: 100,
      status: 'ok',
      clientReqStr: '未限定规格 (全尺寸通用)',
      productRangeStr: prodSpecs.sizeRangeDisplay,
      marginStr: '完全覆盖供货能力，支持现货切定尺与批量排产',
    });
    return { score: 100, evaluation };
  }

  let totalScore = 0;
  let count = 0;

  // 1. 厚度/圆钢直径维度评价
  if (hasThicknessReq) {
    count++;
    const prodMin = prodSpecs.thicknessMin;
    const prodMax = prodSpecs.thicknessMax;

    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let itemScore = 100;
    let marginNote = '';

    const clientReqStr = reqThicknessMin !== undefined && reqThicknessMax !== undefined
      ? `${reqThicknessMin} ~ ${reqThicknessMax} mm`
      : reqThicknessMin !== undefined
      ? `≥ ${reqThicknessMin} mm`
      : `≤ ${reqThicknessMax} mm`;

    const productRangeStr = `${prodMin} ~ ${prodMax} mm`;

    const isMinCovered = reqThicknessMin === undefined || reqThicknessMin >= prodMin;
    const isMaxCovered = reqThicknessMax === undefined || reqThicknessMax <= prodMax;

    if (isMinCovered && isMaxCovered) {
      status = 'ok';
      itemScore = 100;
      marginNote = `需求尺寸完全位于供货区间 (${productRangeStr}) 之内，出材率高`;
    } else {
      let exceed = 0;
      if (reqThicknessMin !== undefined && reqThicknessMin < prodMin) exceed += (prodMin - reqThicknessMin);
      if (reqThicknessMax !== undefined && reqThicknessMax > prodMax) exceed += (reqThicknessMax - prodMax);

      if (exceed <= 15) {
        status = 'warning';
        itemScore = 85;
        marginNote = `接近常规规格极限 (相差 ${exceed}mm)，可通过特种热轧或特规冷拔定制保供`;
      } else if (exceed <= 50) {
        status = 'warning';
        itemScore = 70;
        marginNote = `超出常规规格能力约 ${exceed}mm，需改用模锻件或特厚板拼焊方案`;
      } else {
        status = 'alert';
        itemScore = 45;
        marginNote = `超出该产线设备极限能力 (偏差 ${exceed}mm)，需重新核定设计尺寸`;
      }
    }

    totalScore += itemScore;
    evaluation.push({
      dimension: '厚度 / 圆钢直径',
      matchScore: Math.round(itemScore),
      status,
      clientReqStr,
      productRangeStr,
      marginStr: marginNote,
    });
  }

  // 2. 宽度规格评价
  if (hasWidthReq) {
    count++;
    const prodMin = prodSpecs.widthMin ?? 800;
    const prodMax = prodSpecs.widthMax ?? 2500;

    let status: 'ok' | 'warning' | 'alert' = 'ok';
    let itemScore = 100;
    let marginNote = '';

    const clientReqStr = reqWidthMin !== undefined && reqWidthMax !== undefined
      ? `${reqWidthMin} ~ ${reqWidthMax} mm`
      : reqWidthMin !== undefined
      ? `≥ ${reqWidthMin} mm`
      : `≤ ${reqWidthMax} mm`;

    const productRangeStr = `${prodMin} ~ ${prodMax} mm`;

    const isMinCovered = reqWidthMin === undefined || reqWidthMin >= prodMin;
    const isMaxCovered = reqWidthMax === undefined || reqWidthMax <= prodMax;

    if (isMinCovered && isMaxCovered) {
      status = 'ok';
      itemScore = 100;
      marginNote = `宽度在常规开卷/剪切/分条规格范围内`;
    } else {
      let exceed = 0;
      if (reqWidthMin !== undefined && reqWidthMin < prodMin) exceed += (prodMin - reqWidthMin);
      if (reqWidthMax !== undefined && reqWidthMax > prodMax) exceed += (reqWidthMax - prodMax);

      if (exceed <= 200) {
        status = 'warning';
        itemScore = 80;
        marginNote = `略超出标准切边宽度，可通过特宽坯连轧排产满足`;
      } else {
        status = 'alert';
        itemScore = 50;
        marginNote = `超出轧机极限宽度，需拼接或重新优化排版`;
      }
    }

    totalScore += itemScore;
    evaluation.push({
      dimension: '板卷宽度规格',
      matchScore: Math.round(itemScore),
      status,
      clientReqStr,
      productRangeStr,
      marginStr: marginNote,
    });
  }

  const finalScore = count > 0 ? Math.round(totalScore / count) : 100;
  return { score: finalScore, evaluation };
}

/**
 * 生成专业的冶金工程判定建议与风险提示
 */
function generateEngineeringNotes(
  product: InternalProduct,
  specScore: number,
  chemScore: number,
  mechScore: number,
  clientReq: CustomerRequirement
): string[] {
  const notes: string[] = [];

  // 1. 规格吻合判定
  if (specScore >= 95) {
    notes.push(`【产品规格匹配良好】：产品供货能力(${product.specifications?.sizeRangeDisplay || product.stockLabel})完全覆盖客户图纸尺寸要求，可直接选用标准规格，加工损耗低。`);
  } else if (specScore >= 80) {
    notes.push(`【产品规格接近】：客户要求的尺寸接近产线常规供货临界点，可通过协议技术公差加试或特规轧制排产满足。`);
  } else {
    notes.push(`【规格尺寸关注】：尺寸超差明显，建议核对部件展开尺寸或评估替代厚度/宽度拼接方案。`);
  }

  // 2. 化学成分匹配
  if (chemScore >= 90) {
    notes.push(`【化学成分高度契合】：主要强化与耐蚀合金元素区间重叠度高，有害杂质(P、S)受控在极低水平。`);
  } else if (chemScore >= 75) {
    notes.push(`【化学成分相近替代】：合金系统设计相近，关键相变点与显微金相组织具有同等稳定性。`);
  } else {
    notes.push(`【成分体系存在差异】：合金元素存在跨系替代，主要依托热处理后力学性能保障工程承载要求。`);
  }

  // 3. 力学余量与承载安全度
  const reqYield = clientReq.mechanical.yieldMin;
  if (reqYield) {
    const diff = product.mechanical.yield.typical - reqYield;
    if (diff > 50) {
      notes.push(`【屈服承载裕度充足】：产品典型屈服强度(${product.mechanical.yield.typical} MPa)相比客户门槛(${reqYield} MPa)富裕达到 ${diff} MPa (+${Math.round(diff/reqYield*100)}%)，可有效提升结构疲劳寿命及安全系数。`);
    } else if (diff >= 0) {
      notes.push(`【强度精准满足】：产品实测强度贴合设计要求，在保证承载力前提下保留了优良的塑韧性配合。`);
    }
  }

  // 4. 碳当量或耐点蚀当量建议
  if (product.carbonEquivalentCEV) {
    notes.push(`【可焊性与加工建议】：计算典型碳当量 CEV = ${product.carbonEquivalentCEV}。${product.carbonEquivalentCEV > 0.45 ? '厚截面焊接时建议采用 150℃~200℃ 预热，以避免冷裂纹倾向。' : '碳当量较低，具备优良的常规焊接成型性。'}`);
  }
  if (product.prenScore) {
    notes.push(`【耐蚀性评级 PREN】：耐点蚀当量指数 PREN = ${product.prenScore}。在含氯离子及酸性介质环境下抗局部孔蚀与缝隙腐蚀性能可靠。`);
  }

  // 5. 交付与经济性建议
  notes.push(`【库存与商务保障】：${product.stockLabel}，性价比定位于${product.costLabel}，可支持小批量打样试验或大批量现货连续供应。`);

  return notes;
}

/**
 * 确定推荐类型 (最佳匹配 / 性能升级 / 经济替代 / 特殊变型)
 */
function determineRecommendationType(
  product: InternalProduct,
  overallScore: number,
  specScore: number,
  chemScore: number,
  mechScore: number,
  rankIndex: number
): { type: RecommendationType; tag: string } {
  if (rankIndex === 0 && overallScore >= 90) {
    return { type: 'best_match', tag: '最佳综合替代' };
  }

  if (product.costLevel === 'premium' || mechScore >= 95) {
    return { type: 'perf_upgrade', tag: '性能升级替代' };
  }

  if (product.costLevel === 'economy') {
    return { type: 'cost_effective', tag: '经济型高性价比' };
  }

  if (product.specialTags.some(t => t.includes('低温') || t.includes('ESR') || t.includes('双相'))) {
    return { type: 'special_variant', tag: '强化特质变型' };
  }

  return { type: 'best_match', tag: '相近推荐品' };
}

/**
 * 主匹配推荐算法入口
 * 仅计算：产品规格(默认10%)、化学成分(默认45%)、力学性能(默认45%)
 */
export function matchProducts(
  clientReq: CustomerRequirement,
  database: InternalProduct[]
): MatchResult[] {
  // 仅提取规格、成分、力学三项权重，默认值分别为 10、45、45
  const specWeight = clientReq.weights?.specWeight ?? 10;
  const chemWeight = clientReq.weights?.chemWeight ?? 45;
  const mechWeight = clientReq.weights?.mechWeight ?? 45;

  const totalWeight = Math.max(1, specWeight + chemWeight + mechWeight);

  const rawResults: Array<{
    product: InternalProduct;
    overallScore: number;
    scores: { specScore: number; chemScore: number; mechScore: number };
    specEvaluation: SpecEvaluationItem[];
    chemEvaluation: ChemicalEvaluationItem[];
    mechEvaluation: MechanicalEvaluationItem[];
  }> = [];

  for (const product of database) {
    // 1. 产品规格匹配度 (默认权重 10%)
    const { score: specScore, evaluation: specEvaluation } = evaluateSpecCompliance(
      clientReq.thicknessMin,
      clientReq.thicknessMax,
      clientReq.widthMin,
      clientReq.widthMax,
      product
    );

    // 2. 化学成分匹配度 (默认权重 45%)
    const { score: chemScore, evaluation: chemEvaluation } = evaluateChemicalConformity(
      clientReq.chemical, 
      product
    );

    // 3. 力学性能达标度 (默认权重 45%)
    const { score: mechScore, evaluation: mechEvaluation } = evaluateMechanicalCompliance(
      clientReq.mechanical, 
      product
    );

    // 加权综合分 (仅按规格、成分、力学计算)
    const overallScore = Math.round(
      (specScore * specWeight +
        chemScore * chemWeight +
        mechScore * mechWeight) / totalWeight
    );

    rawResults.push({
      product,
      overallScore: Math.min(100, Math.max(0, overallScore)),
      scores: { specScore, chemScore, mechScore },
      specEvaluation,
      chemEvaluation,
      mechEvaluation,
    });
  }

  // 排序：综合得分从高到低
  rawResults.sort((a, b) => b.overallScore - a.overallScore);

  // 构造最终推荐结果列表，并赋上专业分析
  const results: MatchResult[] = rawResults.map((item, index) => {
    const { type, tag } = determineRecommendationType(
      item.product,
      item.overallScore,
      item.scores.specScore,
      item.scores.chemScore,
      item.scores.mechScore,
      index
    );

    const engineeringNotes = generateEngineeringNotes(
      item.product,
      item.scores.specScore,
      item.scores.chemScore,
      item.scores.mechScore,
      clientReq
    );

    return {
      product: item.product,
      overallScore: item.overallScore,
      scores: item.scores,
      recommendationType: type,
      recommendationTag: tag,
      specEvaluation: item.specEvaluation,
      chemEvaluation: item.chemEvaluation,
      mechEvaluation: item.mechEvaluation,
      engineeringNotes,
      carbonEquivalentCEV: item.product.carbonEquivalentCEV,
      prenScore: item.product.prenScore,
    };
  });

  return results;
}
