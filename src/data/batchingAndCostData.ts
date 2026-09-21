import { BatchingPlan, CostEstimation } from '../types';

export const BATCHING_AND_COST_DICT: Record<string, { batchingPlan: BatchingPlan; costEstimation: CostEstimation }> = {
  // 1. 42CrMo-QT
  'prod-42crmo-qt-01': {
    batchingPlan: {
      furnaceRoute: '100t超高功率电弧炉(EAF) → LF白渣精炼 → VD真空脱气 → 连铸方圆坯 → 连续棒材轧制 → 调质热处理(+QT)',
      recoveryRate: 96.8,
      materials: [
        { name: '低硫重型废钢 (重废A级)', amountKg: 820, unitPrice: 2.75, unitPriceDisplay: '2.75元/kg', costPerTon: 2255.0, role: '主金属装料基体' },
        { name: '特级低磷生铁/铁水', amountKg: 220, unitPrice: 3.10, unitPriceDisplay: '3.10元/kg', costPerTon: 682.0, role: '增碳与稀释残留有害微量元素' },
        { name: '低碳铬铁 (FeCr60-C0.25)', amountKg: 18.5, unitPrice: 14.20, unitPriceDisplay: '14.20元/kg', costPerTon: 262.7, role: 'Cr合金化 (提供淬透性与回火抗力)' },
        { name: '高纯钼铁 (FeMo60-A)', amountKg: 3.5, unitPrice: 245.00, unitPriceDisplay: '245.00元/kg', costPerTon: 857.5, role: 'Mo合金化 (防止第二类回火脆性)' },
        { name: '中碳锰铁 (FeMn75-C2.0)', amountKg: 10.5, unitPrice: 7.60, unitPriceDisplay: '7.60元/kg', costPerTon: 79.8, role: 'Mn脱氧与固溶强化' },
        { name: '结晶硅铁 (FeSi75-A)', amountKg: 4.2, unitPrice: 7.80, unitPriceDisplay: '7.80元/kg', costPerTon: 32.8, role: 'Si脱氧与硬化相' },
        { name: '预熔高碱度渣料与铝粒', amountKg: 5.5, unitPrice: 16.00, unitPriceDisplay: '16.00元/kg', costPerTon: 88.0, role: 'VD脱氧脱硫造白渣 (保证S≤0.010%)' }
      ],
      slagNotes: '高碱度精炼白渣(CaO/SiO2≥3.0)，软吹氩时间≥15min，真空脱气保压时间≥12min'
    },
    costEstimation: {
      rawMaterialCost: 4257.8,
      processingCost: 1680.0,
      totalCostPerTon: 5938,
      marketPriceRange: '¥6,600 ~ ¥7,200 / 吨',
      economicAdvantage: '较进口欧标 42CrMo4 吨钢直接节省约 15.8% 采购成本；钼铁精确控制在0.20%中限，既消除回火脆性又最大限度控制合金成本。'
    }
  },

  // 2. 42CrMo4-MOD (含V微合金化)
  'prod-42crmo4-v-02': {
    batchingPlan: {
      furnaceRoute: '100t超高功率电炉 → 强化LF深脱硫 → 延长VD真空脱气 → 电磁搅拌大圆坯连铸 → 控轧控冷 → 精密微晶调质',
      recoveryRate: 97.2,
      materials: [
        { name: '精选特级纯净废钢', amountKg: 810, unitPrice: 2.85, unitPriceDisplay: '2.85元/kg', costPerTon: 2308.5, role: '高纯基础铁源 (严格限制Cu/Sn/As/Sb杂质)' },
        { name: '高纯脱硫生铁', amountKg: 225, unitPrice: 3.15, unitPriceDisplay: '3.15元/kg', costPerTon: 708.8, role: '优质增碳剂与纯净基体' },
        { name: '低碳微碳铬铁 (FeCr60)', amountKg: 19.8, unitPrice: 14.20, unitPriceDisplay: '14.20元/kg', costPerTon: 281.2, role: 'Cr达标 1.12% 中上限' },
        { name: '优质钼铁 (FeMo60)', amountKg: 4.2, unitPrice: 245.00, unitPriceDisplay: '245.00元/kg', costPerTon: 1029.0, role: 'Mo含量稳定至 0.24%，抗冲击强化' },
        { name: '高纯钒铁 (FeV50-A)', amountKg: 1.8, unitPrice: 95.00, unitPriceDisplay: '95.00元/kg', costPerTon: 171.0, role: 'V微合金化 (析出微细VC，大幅细化晶粒)' },
        { name: '低碳锰铁与精硅铁', amountKg: 14.5, unitPrice: 8.20, unitPriceDisplay: '8.20元/kg', costPerTon: 118.9, role: '脱氧与合金微调' },
        { name: '超低硫复合精炼渣系', amountKg: 6.0, unitPrice: 18.00, unitPriceDisplay: '18.00元/kg', costPerTon: 108.0, role: '将S降至 0.003% 极纯水平，杜绝硫化物脆裂' }
      ],
      slagNotes: '精炼白渣深脱硫脱气，氧含量[O]≤10ppm，晶粒度评级达到 8.5~9.0 级'
    },
    costEstimation: {
      rawMaterialCost: 4725.4,
      processingCost: 1760.0,
      totalCostPerTon: 6485,
      marketPriceRange: '¥7,300 ~ ¥7,900 / 吨',
      economicAdvantage: '吨钢成本仅比常规 42CrMo 增加约 9%，但 -40℃ 低温冲击韧性跃升 24%，屈服富余 15%，完全杜绝极寒重载工况下的脆断停机风险。'
    }
  },

  // 3. 40Cr-QT
  'prod-40cr-qt-03': {
    batchingPlan: {
      furnaceRoute: '100t转炉/超高功率电炉 → LF快速精炼 → 连铸热轧圆钢 → 连续辊底炉调质(+QT)',
      recoveryRate: 97.5,
      materials: [
        { name: '普碳与低合金精废钢', amountKg: 830, unitPrice: 2.65, unitPriceDisplay: '2.65元/kg', costPerTon: 2199.5, role: '大宗高性价比金属装料' },
        { name: '高炉脱硫铁水/生铁', amountKg: 210, unitPrice: 3.05, unitPriceDisplay: '3.05元/kg', costPerTon: 640.5, role: '经济铁水资源' },
        { name: '高碳/中碳铬铁', amountKg: 16.5, unitPrice: 12.80, unitPriceDisplay: '12.80元/kg', costPerTon: 211.2, role: 'Cr合金化 (达 0.95%)' },
        { name: '硅锰合金 (SiMn6517)', amountKg: 12.0, unitPrice: 7.20, unitPriceDisplay: '7.20元/kg', costPerTon: 86.4, role: '复合Si/Mn脱氧与脱硫' },
        { name: '辅助脱氧剂及造渣石灰', amountKg: 8.0, unitPrice: 6.50, unitPriceDisplay: '6.50元/kg', costPerTon: 52.0, role: '基础脱氧与常规脱硫' }
      ],
      slagNotes: '成熟标准化精炼工艺，成材率高，无昂贵钼(Mo)添加'
    },
    costEstimation: {
      rawMaterialCost: 3189.6,
      processingCost: 1460.0,
      totalCostPerTon: 4650,
      marketPriceRange: '¥5,200 ~ ¥5,700 / 吨',
      economicAdvantage: '极高经济性！较 42CrMo 吨钢直接节约采购成本约 1,288 元 (节省约 21.6%)，适用于常规中速轴类与标准构件，降本效益显著。'
    }
  },

  // 4. 316L-SP
  'prod-316l-sp-04': {
    batchingPlan: {
      furnaceRoute: '60t电弧炉(EAF)初熔 → AOD氩氧脱碳(精准降碳至≤0.025%) → LF炉调整成分 → 板坯/圆坯连铸 → 固溶退火酸洗(+AT)',
      recoveryRate: 95.8,
      materials: [
        { name: '优质 304/316 级不锈钢返回料', amountKg: 620, unitPrice: 12.50, unitPriceDisplay: '12.50元/kg', costPerTon: 7750.0, role: '含镍铬优质不锈钢重熔基体' },
        { name: '高纯低碳铬铁 (FeCr60)', amountKg: 110, unitPrice: 15.50, unitPriceDisplay: '15.50元/kg', costPerTon: 1705.0, role: '补足 Cr 含量至 17.2%' },
        { name: '高纯电解镍板 / 镍铁 (Ni≥99.9%)', amountKg: 46.5, unitPrice: 128.00, unitPriceDisplay: '128.00元/kg', costPerTon: 5952.0, role: '补足奥氏体稳定化贵金属 Ni 至 11.5%' },
        { name: '高纯钼铁 (FeMo60)', amountKg: 36.5, unitPrice: 245.00, unitPriceDisplay: '245.00元/kg', costPerTon: 8942.5, role: 'Mo含量达到 2.15%，确保耐氯化物点蚀' },
        { name: '低碳锰铁与脱氧微硅铁', amountKg: 18.0, unitPrice: 9.20, unitPriceDisplay: '9.20元/kg', costPerTon: 165.6, role: '脱氧脱气' },
        { name: 'AOD脱碳高纯氩气/氧气/氮气辅耗', amountKg: 1.0, unitPrice: 280.00, unitPriceDisplay: '280元/t', costPerTon: 280.0, role: '超低碳深脱碳冶炼保护' }
      ],
      slagNotes: 'AOD深脱碳+还原期加硅铁还原渣中Cr/Ni氧化物，回收率达98%以上'
    },
    costEstimation: {
      rawMaterialCost: 24795.1,
      processingCost: 2950.0,
      totalCostPerTon: 27745,
      marketPriceRange: '¥29,500 ~ ¥32,000 / 吨',
      economicAdvantage: '通过精选高纯返回料配合AOD高回收率冶炼，吨钢原料损耗降低4.2%；化学成分精准内控在欧标与美标重叠最佳耐蚀窗口。'
    }
  },

  // 5. 2205-DSS
  'prod-2205-dss-05': {
    batchingPlan: {
      furnaceRoute: '50t电弧炉 → AOD炉精准控氮与脱碳 → LF微合金化 → 连铸/模铸扁锭 → 控温热轧 → 固溶水淬退火(+AT)',
      recoveryRate: 95.2,
      materials: [
        { name: '特种高铬不锈钢废料', amountKg: 580, unitPrice: 10.80, unitPriceDisplay: '10.80元/kg', costPerTon: 6264.0, role: '基础洁净金属源' },
        { name: '微碳铬铁 (FeCr60)', amountKg: 195, unitPrice: 15.60, unitPriceDisplay: '15.60元/kg', costPerTon: 3042.0, role: '超高铬化 Cr 达到 22.4%' },
        { name: '电解镍板 / 高镍铁', amountKg: 28.5, unitPrice: 128.00, unitPriceDisplay: '128.00元/kg', costPerTon: 3648.0, role: '节镍设计 (Ni仅需5.6%，较316L节省镍用量50%以上)' },
        { name: '钼铁 (FeMo60)', amountKg: 53.0, unitPrice: 245.00, unitPriceDisplay: '245.00元/kg', costPerTon: 12985.0, role: 'Mo含量达到 3.20%，实现 PREN≥35 强耐点蚀' },
        { name: '含氮合金 / AOD精密吹氮', amountKg: 1.0, unitPrice: 320.00, unitPriceDisplay: '320元/t', costPerTon: 320.0, role: 'N元素控制在 0.17%，以氮代镍强韧化双相晶粒' },
        { name: '复合低碳精炼渣料与辅耗', amountKg: 1.0, unitPrice: 350.00, unitPriceDisplay: '350元/t', costPerTon: 350.0, role: '两相比例 50:50 精准热平衡控制' }
      ],
      slagNotes: '精密铁素体-奥氏体双相比例平衡(45%~55%)，固溶温度 1040~1080℃ 水淬'
    },
    costEstimation: {
      rawMaterialCost: 26609.0,
      processingCost: 3550.0,
      totalCostPerTon: 30159,
      marketPriceRange: '¥32,500 ~ ¥35,500 / 吨',
      economicAdvantage: '综合工程造价大降！尽管吨钢单价比316L略高约8%，但屈服强度为316L的2.2倍，容器筒壁厚可减薄35%，构件总用钢量大减，整机综合采购成本降低20%以上！'
    }
  },

  // 6. Q355ND
  'prod-q355nd-06': {
    batchingPlan: {
      furnaceRoute: '150t转炉(顶底复吹) → LF精炼炉 → 钙处理吹氩微处理 → 板坯连铸(轻压下) → TMCP控轧控冷(+N正火轧制)',
      recoveryRate: 98.2,
      materials: [
        { name: '转炉铁水 (含碳纯净铁源)', amountKg: 850, unitPrice: 2.85, unitPriceDisplay: '2.85元/kg', costPerTon: 2422.5, role: '高温纯净基础铁水' },
        { name: '优质折弯冲剪废钢', amountKg: 190, unitPrice: 2.65, unitPriceDisplay: '2.65元/kg', costPerTon: 503.5, role: '控温金属装料' },
        { name: '高碳锰铁与锰硅合金', amountKg: 16.5, unitPrice: 7.20, unitPriceDisplay: '7.20元/kg', costPerTon: 118.8, role: 'Mn达 1.42% 固溶韧化' },
        { name: '硅铁与复合铝钡脱氧剂', amountKg: 5.5, unitPrice: 8.50, unitPriceDisplay: '8.50元/kg', costPerTon: 46.8, role: '全脱氧洁净控制' },
        { name: '高纯铌铁 (FeNb66)', amountKg: 0.45, unitPrice: 260.00, unitPriceDisplay: '260元/kg', costPerTon: 117.0, role: 'Nb微合金化 (细晶强化)' },
        { name: '钛铁 (FeTi70)', amountKg: 0.35, unitPrice: 38.00, unitPriceDisplay: '38元/kg', costPerTon: 13.3, role: '固定N元素与抑止晶粒粗化' }
      ],
      slagNotes: '转炉高效少渣冶炼+LF低氧化性精炼，-20℃冲击功富裕量≥80%'
    },
    costEstimation: {
      rawMaterialCost: 3221.9,
      processingCost: 1080.0,
      totalCostPerTon: 4302,
      marketPriceRange: '¥4,700 ~ ¥5,100 / 吨',
      economicAdvantage: '大宗产线规模化降本！采用微量Nb-Ti复合微合金化工艺替代传统高合金，既确保-20℃卓越低温韧性，又保持了极佳焊接性(CEV≤0.37)，制造成本处于行业领先水平。'
    }
  },

  // 7. Q690D
  'prod-q690d-07': {
    batchingPlan: {
      furnaceRoute: '100t转炉/电炉 → LF深脱硫精炼 → VD真空脱氢脱气 → 宽厚板坯连铸 → 强力控轧+超快冷(TMCP) → 离线高精度在线回火',
      recoveryRate: 97.4,
      materials: [
        { name: '高纯纯净铁水及重废', amountKg: 980, unitPrice: 2.80, unitPriceDisplay: '2.80元/kg', costPerTon: 2744.0, role: '低杂质基础金属源' },
        { name: '低碳中碳锰铁', amountKg: 17.5, unitPrice: 7.60, unitPriceDisplay: '7.60元/kg', costPerTon: 133.0, role: 'Mn稳定在 1.45%' },
        { name: '低碳铬铁', amountKg: 8.5, unitPrice: 14.20, unitPriceDisplay: '14.20元/kg', costPerTon: 120.7, role: '提供淬透性' },
        { name: '钼铁 (FeMo60)', amountKg: 2.8, unitPrice: 245.00, unitPriceDisplay: '245元/kg', costPerTon: 686.0, role: '抗回火软化与延迟断裂' },
        { name: '铌铁与钒铁复合微合金', amountKg: 1.2, unitPrice: 180.00, unitPriceDisplay: '180元/kg', costPerTon: 216.0, role: 'Nb+V强烈阻止晶粒长大' },
        { name: '硼铁 (FeB18)', amountKg: 0.08, unitPrice: 120.00, unitPriceDisplay: '120元/kg', costPerTon: 9.6, role: '微量B偏聚晶界大幅提升淬透性' },
        { name: '硅钙线深脱硫喂线辅料', amountKg: 1.5, unitPrice: 45.00, unitPriceDisplay: '45元/kg', costPerTon: 67.5, role: '夹杂物球化变性处理' }
      ],
      slagNotes: '超纯净钢冶炼技术，氢含量[H]≤1.5ppm，杜绝超厚板白点缺陷'
    },
    costEstimation: {
      rawMaterialCost: 3976.8,
      processingCost: 1650.0,
      totalCostPerTon: 5627,
      marketPriceRange: '¥6,400 ~ ¥7,000 / 吨',
      economicAdvantage: '以低碳+Cr-Mo-Nb-V-B微合金化替代老式高碳调质方案，屈服强度直达 690MPa 以上，抗拉突破 800MPa，焊接无需苛刻预热，设备结构轻量化降重达 30% 以上。'
    }
  },

  // 8. H13-ESR
  'prod-h13-esr-08': {
    batchingPlan: {
      furnaceRoute: '50t超高功率电弧炉 → LF炉精炼 → VD真空脱气 → 浇注自耗自持电极棒 → 保护气氛电渣重熔(ESR) → 超重型水压机锻造 → 超细化球化退火',
      recoveryRate: 91.5,
      materials: [
        { name: '精选特种模具钢纯净料', amountKg: 850, unitPrice: 3.50, unitPriceDisplay: '3.50元/kg', costPerTon: 2975.0, role: '超低杂质原电极基体' },
        { name: '微碳低硅铬铁 (FeCr60)', amountKg: 88.0, unitPrice: 15.20, unitPriceDisplay: '15.20元/kg', costPerTon: 1337.6, role: 'Cr主合金化 5.10%' },
        { name: '高纯特级钼铁 (FeMo60)', amountKg: 22.5, unitPrice: 245.00, unitPriceDisplay: '245元/kg', costPerTon: 5512.5, role: 'Mo含量达到 1.35%，耐热疲劳' },
        { name: '特级高钒铁 (FeV80)', amountKg: 12.8, unitPrice: 110.00, unitPriceDisplay: '110元/kg', costPerTon: 1408.0, role: 'V达到 1.02%，形成高硬度抗热磨损VC' },
        { name: '高纯金属硅与其他辅料', amountKg: 14.0, unitPrice: 12.50, unitPriceDisplay: '12.50元/kg', costPerTon: 175.0, role: '抗氧化性控制' },
        { name: '电渣重熔高纯特种渣系(CaF2-Al2O3-CaO)', amountKg: 25.0, unitPrice: 28.00, unitPriceDisplay: '28元/kg', costPerTon: 700.0, role: '电渣精炼强力去除微细非金属夹杂物' }
      ],
      slagNotes: '电渣重熔过程熔速严格受控，三维等向性能比(纵/横冲击韧性比)≥0.85'
    },
    costEstimation: {
      rawMaterialCost: 12108.1,
      processingCost: 5200.0,
      totalCostPerTon: 17308,
      marketPriceRange: '¥19,500 ~ ¥22,500 / 吨',
      economicAdvantage: '电渣重熔(ESR)虽增加加工电耗，但模具热疲劳寿命提升 2~3 倍，消除大截面中心偏析与热裂隐患，单次模具压铸寿命成本比节省 40% 以上。'
    }
  },

  // 9. Cr12MoV
  'prod-cr12mov-09': {
    batchingPlan: {
      furnaceRoute: '中频感应炉/电炉 → LF炉微调精炼 → 浇注锻坯 → 高温均匀化扩散退火 → 多向快锻打碎碳化物网 → 球化退火',
      recoveryRate: 94.0,
      materials: [
        { name: '高碳轴承模具废钢', amountKg: 810, unitPrice: 2.90, unitPriceDisplay: '2.90元/kg', costPerTon: 2349.0, role: '基体铁料' },
        { name: '高碳高铬中碳铬铁', amountKg: 195, unitPrice: 13.50, unitPriceDisplay: '13.50元/kg', costPerTon: 2632.5, role: 'Cr含量达到 11.8% 形成高耐磨高碳碳化物' },
        { name: '钼铁 (FeMo60)', amountKg: 8.5, unitPrice: 245.00, unitPriceDisplay: '245元/kg', costPerTon: 2082.5, role: 'Mo含量达到 0.50%' },
        { name: '钒铁 (FeV50)', amountKg: 4.8, unitPrice: 95.00, unitPriceDisplay: '95元/kg', costPerTon: 456.0, role: 'V含量 0.25% 抑制热处理晶粒长大' },
        { name: '辅助脱氧石墨增碳辅料', amountKg: 8.0, unitPrice: 12.00, unitPriceDisplay: '12元/kg', costPerTon: 96.0, role: '碳含量稳定在 1.55%' }
      ],
      slagNotes: '高温长时间均匀化退火(1150℃保压8h)，彻底改善莱氏体共晶碳化物偏析'
    },
    costEstimation: {
      rawMaterialCost: 7616.0,
      processingCost: 2850.0,
      totalCostPerTon: 10466,
      marketPriceRange: '¥12,200 ~ ¥13,800 / 吨',
      economicAdvantage: '国内最经典高耐磨冷作模具钢，配料供应链成熟充裕，较硬质合金冲头降本 65%，多向锻造粉碎碳化物后，模具耐冲裁寿命大幅延长。'
    }
  },

  // 10. 304-AP
  'prod-304-10': {
    batchingPlan: {
      furnaceRoute: '60t电弧炉 → AOD氩氧脱碳炉 → LF精炼 → 连铸方圆管坯/连轧板卷 → 固溶退火酸洗',
      recoveryRate: 96.5,
      materials: [
        { name: '304精选不锈钢回炉料', amountKg: 650, unitPrice: 11.20, unitPriceDisplay: '11.20元/kg', costPerTon: 7280.0, role: '主装料基体' },
        { name: '中低碳铬铁 (FeCr60)', amountKg: 125, unitPrice: 14.50, unitPriceDisplay: '14.50元/kg', costPerTon: 1812.5, role: 'Cr含量稳定在 18.2%' },
        { name: '电解镍板 / 高镍生铁', amountKg: 29.5, unitPrice: 128.00, unitPriceDisplay: '128元/kg', costPerTon: 3776.0, role: 'Ni含量稳定在 8.15%' },
        { name: '锰铁与微硅铁脱氧辅料', amountKg: 15.0, unitPrice: 8.50, unitPriceDisplay: '8.50元/kg', costPerTon: 127.5, role: '脱氧与基础成分微调' },
        { name: 'AOD气体与精炼渣消耗', amountKg: 1.0, unitPrice: 240.00, unitPriceDisplay: '240元/t', costPerTon: 240.0, role: 'AOD常压脱碳保护' }
      ],
      slagNotes: '还原渣中铬回收率≥98.5%，碳含量精控≤0.045%'
    },
    costEstimation: {
      rawMaterialCost: 13236.0,
      processingCost: 2650.0,
      totalCostPerTon: 15886,
      marketPriceRange: '¥17,200 ~ ¥18,600 / 吨',
      economicAdvantage: '大宗工业耐腐蚀最成熟物料！相比 316L 因无需昂贵钼(Mo)且镍含量较低，吨钢采购成本节约达 11,000 元以上(降低约38%)，非强酸高氯工况下的绝对降本首选。'
    }
  },

  // 11. 6061-T6
  'prod-6061-t6-11': {
    batchingPlan: {
      furnaceRoute: '30t蓄热式铝熔炼炉 → 炉外在线电磁搅拌精炼 → 在线双级除气过滤箱 → 半连续水冷铸造圆铸棒 → 均匀化退火 → 大型正向挤压机挤压 → 在线水淬+T6完全人工时效',
      recoveryRate: 93.8,
      materials: [
        { name: '国标 A00 优质原铝锭 (Al≥99.7%)', amountKg: 975, unitPrice: 19.80, unitPriceDisplay: '19.80元/kg', costPerTon: 19305.0, role: '高纯纯铝基体' },
        { name: '特级金属镁锭 (Mg≥99.9%)', amountKg: 11.2, unitPrice: 22.50, unitPriceDisplay: '22.50元/kg', costPerTon: 252.0, role: '生成核心强化相 Mg2Si' },
        { name: '工业结晶硅 (Si≥99.5%)', amountKg: 6.8, unitPrice: 15.20, unitPriceDisplay: '15.20元/kg', costPerTon: 103.4, role: '与Mg结合形成析出硬化相' },
        { name: '铝铜/铝铬中间合金', amountKg: 5.5, unitPrice: 32.00, unitPriceDisplay: '32.00元/kg', costPerTon: 176.0, role: '微量Cu(提升强度)+Cr(细化晶粒并抗应力腐蚀)' },
        { name: '在线除气精炼熔剂及高纯氮氯气体', amountKg: 4.5, unitPrice: 18.00, unitPriceDisplay: '18.00元/kg', costPerTon: 81.0, role: '除氢[H]与滤除微米级夹杂' }
      ],
      slagNotes: '熔体含氢量检测[H]≤0.12ml/100g-Al，T6时效工艺: 175℃×8h'
    },
    costEstimation: {
      rawMaterialCost: 19917.4,
      processingCost: 3800.0,
      totalCostPerTon: 23717,
      marketPriceRange: '¥25,500 ~ ¥28,000 / 吨',
      economicAdvantage: '密度仅为钢材的 1/3 (2.70 g/cm³)，在同等抗拉刚度要求下可为整车或运动机械减重 50% 以上，综合能耗与机动灵活性收益极高。'
    }
  },

  // 12. GH4169 / Inconel 718
  'prod-inconel718-12': {
    batchingPlan: {
      furnaceRoute: '6t真空感应熔炼(VIM)超洁净配料铸造电极棒 → 保护气氛真空自耗电弧重熔(VAR)双联工艺 → 径向精锻机开坯锻造 → 固溶处理(960℃)+双级沉淀时效(720℃×8h+620℃×8h)',
      recoveryRate: 88.5,
      materials: [
        { name: '高纯电解纯镍板 (Ni≥99.98%)', amountKg: 525, unitPrice: 132.00, unitPriceDisplay: '132元/kg', costPerTon: 69300.0, role: 'Ni基体达 52.8%，高温下不发生相变' },
        { name: '高纯金属铌铁 (FeNb66特级)', amountKg: 78.5, unitPrice: 320.00, unitPriceDisplay: '320元/kg', costPerTon: 25120.0, role: 'Nb达到 5.15%，析出γ\"亚稳相核心高温强化' },
        { name: '特纯微碳铬铁/金属铬', amountKg: 190, unitPrice: 28.00, unitPriceDisplay: '28元/kg', costPerTon: 5320.0, role: 'Cr达 18.8%，提供高温抗氧化耐腐蚀保护膜' },
        { name: '高纯纯钼条/特级钼铁', amountKg: 31.0, unitPrice: 260.00, unitPriceDisplay: '260元/kg', costPerTon: 8060.0, role: 'Mo达 3.05%，高温固溶强化基体' },
        { name: '特纯海绵钛与金属铝锭', amountKg: 16.5, unitPrice: 85.00, unitPriceDisplay: '85元/kg', costPerTon: 1402.5, role: 'Ti(0.95%)+Al(0.55%) 析出γ\'强化相' },
        { name: '超纯生铁及微合金化B/Zr辅料', amountKg: 155, unitPrice: 8.50, unitPriceDisplay: '8.50元/kg', costPerTon: 1317.5, role: '余量Fe微量B强化晶界' }
      ],
      slagNotes: 'VIM+VAR双真空熔炼，严格排除低熔点有害杂质(Pb, Bi, Sn, Sb, As总和≤15ppm)'
    },
    costEstimation: {
      rawMaterialCost: 110520.0,
      processingCost: 38000.0,
      totalCostPerTon: 148520,
      marketPriceRange: '¥175,000 ~ ¥205,000 / 吨',
      economicAdvantage: '可在 650℃ 高温下保持极高屈服强度(≥1000MPa)与卓越抗蠕变性能，国内双真空工业化连贯生产突破进口垄断，采购周期从6个月缩短至25天，成本下降35%。'
    }
  },

  // 13. 20CrMnTi
  'prod-20crmnti-13': {
    batchingPlan: {
      furnaceRoute: '100t超高功率电弧炉/转炉 → LF精炼白渣脱硫 → 喂入钛线与钙线微处理 → 方坯连铸(轻压下) → 连续控轧棒材 → 控温软化退火',
      recoveryRate: 97.6,
      materials: [
        { name: '转炉铁水与特选废钢', amountKg: 990, unitPrice: 2.75, unitPriceDisplay: '2.75元/kg', costPerTon: 2722.5, role: '主装料基体' },
        { name: '高碳中碳铬铁', amountKg: 19.5, unitPrice: 13.20, unitPriceDisplay: '13.20元/kg', costPerTon: 257.4, role: 'Cr含量稳定在 1.15%' },
        { name: '硅锰合金 (SiMn6517)', amountKg: 15.2, unitPrice: 7.20, unitPriceDisplay: '7.20元/kg', costPerTon: 109.4, role: 'Mn达到 0.92%' },
        { name: '精炼高纯钛铁线 (FeTi70)', amountKg: 1.1, unitPrice: 42.00, unitPriceDisplay: '42元/kg', costPerTon: 46.2, role: 'Ti控制在 0.065%，强烈细化渗碳晶粒' },
        { name: '脱氧硅钙线与辅渣', amountKg: 5.0, unitPrice: 9.50, unitPriceDisplay: '9.50元/kg', costPerTon: 47.5, role: '造白渣脱硫控制夹杂物形态' }
      ],
      slagNotes: '钛微合金化关键工艺：控制Ti/N比值，避免生成粗大棱角状TiN夹杂物'
    },
    costEstimation: {
      rawMaterialCost: 3183.0,
      processingCost: 1250.0,
      totalCostPerTon: 4433,
      marketPriceRange: '¥4,950 ~ ¥5,400 / 吨',
      economicAdvantage: '汽车齿轮行业最成熟且经济性极佳的标准钢种！吨钢成本极具竞争力，经渗碳淬火后表面耐磨性与心部高韧性平衡极佳，综合性价比无出其右。'
    }
  },

  // 14. GCr15
  'prod-gcr15-14': {
    batchingPlan: {
      furnaceRoute: '100t超高功率电炉 → 强化LF真空精炼 → VD高真空连续脱气(脱氢脱氧) → 保护浇注大方坯连铸 → 控轧控冷棒线材 → 连续保护气氛球化退火',
      recoveryRate: 97.0,
      materials: [
        { name: '精选特级高碳低杂质废钢', amountKg: 850, unitPrice: 2.80, unitPriceDisplay: '2.80元/kg', costPerTon: 2380.0, role: '高纯基础装料 (P≤0.010%, S≤0.005%)' },
        { name: '特级低钛生铁 (Ti≤0.015%)', amountKg: 200, unitPrice: 3.20, unitPriceDisplay: '3.20元/kg', costPerTon: 640.0, role: '增碳至 1.00%，控制Ti杂质以防粗大TiN' },
        { name: '高纯低微碳铬铁 (FeCr60)', amountKg: 25.5, unitPrice: 14.80, unitPriceDisplay: '14.80元/kg', costPerTon: 377.4, role: 'Cr达 1.50%，形成细小均匀(Fe,Cr)3C碳化物' },
        { name: '结晶硅铁与低碳锰铁', amountKg: 6.5, unitPrice: 8.50, unitPriceDisplay: '8.50元/kg', costPerTon: 55.3, role: 'Si/Mn基础微调' },
        { name: '超高纯精炼合成渣系与铝粒', amountKg: 5.0, unitPrice: 22.00, unitPriceDisplay: '22元/kg', costPerTon: 110.0, role: '总氧量[O]控制在 ≤5ppm 超洁净状态' }
      ],
      slagNotes: '深真空脱气保持时间≥20min，超纯净冶炼消除点状及氧化物夹杂，球化退火碳化物评级1~2级'
    },
    costEstimation: {
      rawMaterialCost: 3562.7,
      processingCost: 1720.0,
      totalCostPerTon: 5283,
      marketPriceRange: '¥5,850 ~ ¥6,450 / 吨',
      economicAdvantage: '极低氧含量([O]≤5ppm)使轴承接触疲劳寿命(L10)比普通轴承钢提升 2.5 倍以上，球化退火组织均匀，车削与冷拔加工性能优越，大幅降低后续热处理废品率。'
    }
  }
};
