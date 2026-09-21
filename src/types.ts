export type MaterialCategory = 
  | 'alloy_structural'  // 合金结构钢 / 调质钢 / 渗碳钢
  | 'stainless'         // 不锈钢 / 耐蚀合金
  | 'hsla'              // 低合金高强钢
  | 'tool_die'          // 模具工具钢
  | 'special_alloy'     // 高温/镍基特种合金
  | 'light_alloy';      // 铝/铜有色轻合金

export interface ElementRange {
  min?: number;
  max?: number;
  target?: number;
}

export interface InternalElementRange {
  min: number;
  max: number;
  typical: number;
}

export interface CustomerMechanicalReq {
  yieldMin?: number;        // 规定塑性延伸强度 Rp0.2 或 ReH (MPa)
  yieldMax?: number;
  tensileMin?: number;      // 抗拉强度 Rm (MPa)
  tensileMax?: number;
  elongationMin?: number;   // 断后伸长率 A (%)
  impactMin?: number;       // 冲击吸收功 KV2 / AKV (J)
  impactTemp?: string;      // 试验温度 (如 "20°C", "0°C", "-20°C", "-40°C")
  hardnessMin?: number;     // 硬度下限
  hardnessMax?: number;     // 硬度上限
  hardnessScale?: 'HBW' | 'HRC' | 'HV';
}

export interface InternalMechanicalProp {
  yield: { min: number; typical: number };
  tensile: { min: number; max?: number; typical: number };
  elongation: { min: number; typical: number };
  impact?: { energy: number; temp: string };
  hardness?: { value: string; scale: 'HBW' | 'HRC' | 'HV' };
}

export interface CustomerRequirement {
  targetGrade: string;              // 客户图纸指定牌号 (如 42CrMo4, 316L, Q355B)
  standard: string;                 // 执行标准 (如 EN 10083-3, ASTM A240, GB/T 1591)
  deliveryState: string;            // 交货状态 / 热处理 (如 调质 QT, 退火 Annealed, 固溶 Solution)
  application: string;              // 部件用途/应用环境 (如 重载齿轮轴、酸性化工反应釜)
  thicknessMin?: number;            // 规格厚度最小值 (mm)
  thicknessMax?: number;            // 规格厚度最大值 (mm)
  widthMin?: number;                // 规格宽度最小值 (mm)
  widthMax?: number;                // 规格宽度最大值 (mm)
  chemical: Record<string, ElementRange>; // 化学成分要求 (wt%)
  mechanical: CustomerMechanicalReq; // 力学性能要求
  weights: {
    specWeight: number;             // 产品规格权重 (0-100, 默认 10)
    chemWeight: number;             // 化学成分权重 (0-100, 默认 45)
    mechWeight: number;             // 力学性能权重 (0-100, 默认 45)
  };
}

export interface BatchingMaterialItem {
  name: string;             // 原材料名称 (如 优质重废钢, 生铁, 低碳铬铁, 钼铁等)
  amountKg: number;         // 吨钢加入量 (kg/t)
  unitPrice: number;        // 原料单价 (元/kg 或 元/吨按标准折算)
  unitPriceDisplay: string; // 单价展示文本 (如 "2.85元/kg")
  costPerTon: number;       // 吨钢分项成本 (元/吨)
  role: string;             // 配料作用 (基料/合金化/脱氧造渣)
}

export interface BatchingPlan {
  furnaceRoute: string;     // 冶炼与热加工路径
  recoveryRate: number;     // 综合收得率 (%)
  materials: BatchingMaterialItem[]; // 关键原材料装料配比清单
  slagNotes?: string;       // 精炼造渣说明
}

export interface CostEstimation {
  rawMaterialCost: number;  // 吨钢原料及铁合金配料成本 (元/吨)
  processingCost: number;   // 冶炼精炼与成型热处理加工成本 (元/吨)
  totalCostPerTon: number;  // 吨钢综合生产成本 (元/吨)
  marketPriceRange: string; // 市场参考出厂指导价 (元/吨)
  economicAdvantage: string;// 成本经济效益与对标分析
}

export interface InternalProduct {
  id: string;
  code: string;                     // 内部物料编号 (如 BAO-42CrMo-QT-01)
  name: string;                     // 内部标准品名
  category: MaterialCategory;
  categoryLabel: string;
  equivalentGrades: {
    gb?: string;
    astm?: string;
    en?: string;
    jis?: string;
  };
  standard: string;                 // 厂标或对应标准
  deliveryState: string;            // 内部交货热处理状态
  composition: Record<string, InternalElementRange>; // 各元素化学成分控制区间 (wt%)
  mechanical: InternalMechanicalProp;
  specialTags: string[];            // 核心工艺与特质标签
  stockStatus: 'in_stock' | 'quick_delivery' | 'custom_melt';
  stockLabel: string;
  costLevel: 'economy' | 'standard' | 'premium';
  costLabel: string;
  description: string;
  typicalApplications: string[];
  carbonEquivalentCEV?: number;     // 典型碳当量
  prenScore?: number;               // 耐点蚀当量
  specifications: {
    thicknessMin: number;           // 供应厚度/圆棒直径下限 (mm)
    thicknessMax: number;           // 供应厚度/圆棒直径上限 (mm)
    widthMin?: number;              // 供应板材宽度下限 (mm)
    widthMax?: number;              // 供应板材宽度上限 (mm)
    sizeRangeDisplay: string;       // 规格供货能力说明
  };
  batchingPlan: BatchingPlan;       // 冶炼配料方案
  costEstimation: CostEstimation;   // 吨钢成本核算
}

export interface SpecEvaluationItem {
  dimension: string;                // 规格项目 (厚度/直径、宽度)
  matchScore: number;               // 子项匹配度得分 (0-100)
  status: 'ok' | 'warning' | 'alert' | 'neutral';
  clientReqStr: string;             // 客户指定要求
  productRangeStr: string;          // 内部产品供货能力
  marginStr: string;                // 规格吻合判定
}

export interface ChemicalEvaluationItem {
  element: string;
  matchScore: number;               // 子项成分匹配度得分 (0-100)
  status: 'ok' | 'warning' | 'alert' | 'neutral';
  clientRangeStr: string;
  productRangeStr: string;
  overlapPercent: number;
  note: string;
}

export interface MechanicalEvaluationItem {
  property: string;
  matchScore: number;               // 子项力学达标度得分 (0-100)
  unit: string;
  status: 'ok' | 'warning' | 'alert';
  clientReqStr: string;
  productValStr: string;
  marginStr: string;
}

export type RecommendationType = 
  | 'best_match'        // 最佳等效对标替代
  | 'perf_upgrade'      // 性能升级型替代 (富余裕度高)
  | 'cost_effective'    // 经济型相近替代 (性价比优先)
  | 'special_variant';  // 特殊工况强化变型 (如耐低温、超纯净)

export interface MatchResult {
  product: InternalProduct;
  overallScore: number;           // 综合匹配度 (0 - 100)
  scores: {
    specScore: number;            // 产品规格匹配度 (0 - 100)
    chemScore: number;            // 化学成分匹配度 (0 - 100)
    mechScore: number;            // 力学性能匹配度 (0 - 100)
  };
  recommendationType: RecommendationType;
  recommendationTag: string;
  specEvaluation: SpecEvaluationItem[];
  chemEvaluation: ChemicalEvaluationItem[];
  mechEvaluation: MechanicalEvaluationItem[];
  engineeringNotes: string[];
  carbonEquivalentCEV?: number;
  prenScore?: number;
}

export interface SelectionRecord {
  id: string;
  recordNo: string;             // 选材单号 如 XC-20260920-001
  createdAt: string;            // 选材发起时间
  creator: string;              // 发起人
  creatorDept: string;          // 部门
  targetGrade: string;          // 目标牌号
  standard: string;             // 执行标准
  deliveryState: string;        // 交货状态
  application: string;          // 产品形态/应用说明
  specSummary: string;          // 规格汇总 如 Φ20~100mm
  requirement: CustomerRequirement; // 完整录入要求
  bestMatchedProductCode: string;   // 推荐内部牌号物料编码
  bestMatchedProductName: string;   // 推荐内部产品名称
  bestMatchedGrade: string;         // 对应牌号
  overallScore: number;             // 综合匹配得分 (0-100)
  matchType: string;                // 推荐类型
  status: 'completed' | 'reviewing' | 'trial_production'; // 状态
  statusLabel: string;
  notes?: string;                   // 结论与工程备注
}

export type SidebarNavKey = 'production' | 'products' | 'standards' | 'grade_convert' | 'selection_records' | 'selection_engine';
