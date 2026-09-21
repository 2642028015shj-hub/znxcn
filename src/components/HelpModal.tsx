import React from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  FlaskConical, 
  Gauge, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="modal-help-guide"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">选材对标评定与匹配算法说明</h3>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed flex-1">
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              1. 三维核心加权对标算法架构
            </h4>
            <p>
              系统专一聚焦于<strong>产品规格能力、化学成分吻合度、力学性能达标度</strong>三大工程硬指标进行匹配度计算（支持在设置栏自定义微调）：
            </p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1.5 text-slate-600">
              <li><strong>产品规格匹配度 (Product Specifications, 默认权重 10%)</strong>：严格考核客户输入的厚度/直径范围与板材宽度需求，比对内部产线设备与可供交货规格上限与下限，确保排产可行性与优良切边出材率。</li>
              <li><strong>化学成分吻合度 (Chemical Conformity, 默认权重 45%)</strong>：计算主要强化元素(C, Cr, Ni, Mo等)及有害杂质(P, S)与图纸公差区间的重叠率(Overlap Ratio)及超差惩罚，保证合金化体系与显微组织稳定性。</li>
              <li><strong>力学性能达标度 (Mechanical Compliance, 默认权重 45%)</strong>：深度考核屈服强度(Rp0.2)、抗拉强度(Rm)、断后伸长率(A)及冲击功(KV2)、硬度是否达到设计要求，量化承载安全储备裕度。</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. 推荐产品类型定位
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="font-bold text-emerald-800">最佳等效对标 (Best Match)</div>
                <div className="text-emerald-700 mt-0.5">标准牌号直接对应，成分公差与力学参数完全重合，可原图纸免变更直接替代。</div>
              </div>
              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                <div className="font-bold text-purple-800">性能升级替代 (Perf Upgrade)</div>
                <div className="text-purple-700 mt-0.5">屈服强度或低温冲击指标显著超出客户指标（如双相钢替代普通不锈钢、特级调质代普通调质），安全储备高。</div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                <div className="font-bold text-amber-800">经济型相近替代 (Cost Effective)</div>
                <div className="text-amber-700 mt-0.5">满足基本力学指标，大批量现货备库，价格经济，适合成本敏感型普通工况。</div>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-800">强化特质变型 (Special Variant)</div>
                <div className="text-blue-700 mt-0.5">具备特殊抗腐蚀（如 PREN &gt; 35）、-40℃深冷冲击或电渣重熔高纯净度特殊冶金标签。</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-1.5">
              <FlaskConical className="w-4 h-4 text-indigo-600" />
              3. 关键冶金参数计算说明
            </h4>
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
              <div><strong>国际焊接学会碳当量公式 (IIW CEV)</strong>:</div>
              <div className="text-blue-700">CEV = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15</div>
              <div className="text-slate-500 font-sans">CEV &le; 0.40% 焊接性优良；0.40%~0.45% 需轻度预热；&gt; 0.45% 必须预热 150℃~200℃ 焊接。</div>
              <div className="mt-2"><strong>耐点蚀当量指数 (PREN)</strong>:</div>
              <div className="text-emerald-700">PREN = Cr + 3.3 &times; Mo + 16 &times; N</div>
              <div className="text-slate-500 font-sans">适用于不锈钢与耐蚀合金，数值越大耐海水及氯离子孔蚀能力越强。</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg transition"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
