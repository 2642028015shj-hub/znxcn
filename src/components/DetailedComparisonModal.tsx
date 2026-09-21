import React from 'react';
import { MatchResult, CustomerRequirement, InternalProduct } from '../types';
import { 
  X, 
  FlaskConical, 
  Gauge, 
  Layers, 
  Coins,
  Ruler
} from 'lucide-react';

interface Props {
  result: MatchResult | null;
  customerReq: CustomerRequirement;
  onClose: () => void;
  onOpenBatching?: (product: InternalProduct) => void;
}

export const DetailedComparisonModal: React.FC<Props> = ({
  result,
  customerReq,
  onClose,
  onOpenBatching,
}) => {
  if (!result) return null;

  const { 
    product, 
    overallScore, 
    scores, 
    specEvaluation = [], 
    chemEvaluation, 
    mechEvaluation
  } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="modal-detailed-comparison"
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* 弹窗头部 */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                  深度技术比对
                </span>
                <span className="text-xs text-slate-300">
                  客户需求 vs 公司内部产品
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {customerReq.targetGrade || '客户图纸要求'} <span className="text-slate-400 font-normal">对标</span> {product.code} ({product.name})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-xs text-slate-300">综合匹配分</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {overallScore}%
              </span>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 顶部简明对标信息栏 */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <span className="text-slate-400 block text-[11px]">客户目标牌号与标准</span>
            <div className="font-semibold text-slate-800 mt-0.5 font-mono">
              {customerReq.targetGrade || '未指定牌号'}
            </div>
            <div className="text-slate-500 text-[11px]">
              {customerReq.standard || '未指定标准'}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">内部对标牌号与标准</span>
            <div className="font-semibold text-blue-700 mt-0.5 font-mono">
              {product.code}
            </div>
            <div className="text-slate-500 text-[11px]">
              {product.standard}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">热处理交货状态</span>
            <div className="font-medium text-slate-700 mt-0.5">
              客户: {customerReq.deliveryState || '按标准'}
            </div>
            <div className="text-slate-500 text-[11px]">
              内部: {product.deliveryState}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">
              匹配得分
            </span>
            <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[11px]">
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">规格 {scores.specScore}%</span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">成分 {scores.chemScore}%</span>
              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">力学 {scores.mechScore}%</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              可供能力: {product.specifications?.sizeRangeDisplay || '锻件/特种圆棒 Φ20~Φ350mm / 特厚板 20~200mm'}
            </div>
          </div>
        </div>

        {/* 滚动内容区 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. 产品规格尺寸对照与判定 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-600" />
                <span>产品规格尺寸符合度对照表 (权重 10%)</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                供货范围能力：{product.specifications?.sizeRangeDisplay || '锻件/特种圆棒 Φ20~Φ350mm / 特厚板 20~200mm'}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5 font-semibold">规格考核项目</th>
                    <th className="p-2.5 font-semibold">客户图纸需求</th>
                    <th className="p-2.5 font-semibold">内部产线可供规格能力</th>
                    <th className="p-2.5 font-semibold min-w-[110px]">子项匹配度</th>
                    <th className="p-2.5 font-semibold">覆盖判定</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {specEvaluation.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-medium text-slate-900">
                        {item.dimension}
                      </td>
                      <td className="p-2.5 font-mono text-slate-700 font-medium">
                        {item.clientReqStr}
                      </td>
                      <td className="p-2.5 font-mono text-slate-800 font-medium">
                        {item.productRangeStr}
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${
                            (item.matchScore ?? 100) >= 90 ? 'text-emerald-700' : 
                            (item.matchScore ?? 100) >= 70 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {item.matchScore ?? 100}%
                          </span>
                          <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (item.matchScore ?? 100) >= 90 ? 'bg-emerald-500' : 
                                (item.matchScore ?? 100) >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                              }`} 
                              style={{ width: `${item.matchScore ?? 100}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5">
                        {item.status === 'ok' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px]">
                            完全覆盖
                          </span>
                        ) : item.status === 'warning' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[11px]">
                            临界定制
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold text-[11px]">
                            超差需协
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. 化学成分对比矩阵 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                <span>化学成分公差对照表 (wt% / 权重 45%)</span>
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5 font-semibold">元素</th>
                    <th className="p-2.5 font-semibold">客户要求公差区间</th>
                    <th className="p-2.5 font-semibold">公司产品内控区间 (典型值)</th>
                    <th className="p-2.5 font-semibold min-w-[110px]">子项匹配度</th>
                    <th className="p-2.5 font-semibold">重合度判定</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chemEvaluation.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-mono font-bold text-slate-900">
                        {item.element}
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {item.clientRangeStr}
                      </td>
                      <td className="p-2.5 font-mono text-slate-800 font-medium">
                        {item.productRangeStr}
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${
                            (item.matchScore ?? item.overlapPercent) >= 90 ? 'text-emerald-700' : 
                            (item.matchScore ?? item.overlapPercent) >= 70 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {item.matchScore ?? item.overlapPercent}%
                          </span>
                          <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (item.matchScore ?? item.overlapPercent) >= 90 ? 'bg-emerald-500' : 
                                (item.matchScore ?? item.overlapPercent) >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                              }`} 
                              style={{ width: `${item.matchScore ?? item.overlapPercent}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5">
                        {item.status === 'ok' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px]">
                            完全符合 ({item.overlapPercent}%)
                          </span>
                        ) : item.status === 'warning' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[11px]">
                            轻微外延 ({item.overlapPercent}%)
                          </span>
                        ) : item.status === 'alert' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold text-[11px]">
                            区间有差异 ({item.overlapPercent}%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                            常规微量
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. 力学性能对比矩阵 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-600" />
                <span>力学性能与强度指标对标 (权重 45%)</span>
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-2.5 font-semibold">力学性能测试项</th>
                    <th className="p-2.5 font-semibold">单位</th>
                    <th className="p-2.5 font-semibold">客户指标要求</th>
                    <th className="p-2.5 font-semibold">公司产品典型保证值</th>
                    <th className="p-2.5 font-semibold min-w-[110px]">子项达标度</th>
                    <th className="p-2.5 font-semibold">达标状态</th>
                    <th className="p-2.5 font-semibold">性能安全裕度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mechEvaluation.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="p-2.5 font-medium text-slate-900">
                        {item.property}
                      </td>
                      <td className="p-2.5 font-mono text-slate-500">
                        {item.unit}
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">
                        {item.clientReqStr}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-slate-800">
                        {item.productValStr}
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-xs ${
                            (item.matchScore ?? 90) >= 90 ? 'text-emerald-700' : 
                            (item.matchScore ?? 90) >= 75 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {item.matchScore ?? 90}%
                          </span>
                          <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (item.matchScore ?? 90) >= 90 ? 'bg-emerald-500' : 
                                (item.matchScore ?? 90) >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                              }`} 
                              style={{ width: `${item.matchScore ?? 90}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5">
                        {item.status === 'ok' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px]">
                            达标达能
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-[11px]">
                            需关注
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 font-medium text-slate-700">
                        {item.marginStr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. 吨钢原料及铁合金成本测算 */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>吨钢原料及铁合金成本测算</span>
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-amber-900 font-mono font-bold">
                  原料及铁合金成本: &yen;{Math.round(product.costEstimation.rawMaterialCost).toLocaleString()} / 吨
                </span>
              </div>
            </div>

            {/* 原料与合金成本核心卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="text-slate-500 text-xs font-medium">吨钢原料及铁合金成本</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 flex items-baseline gap-1">
                  <span>&yen;{Math.round(product.costEstimation.rawMaterialCost).toLocaleString()}</span>
                  <span className="text-xs font-normal text-slate-500">/ 吨</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="text-slate-500 text-xs font-medium">原料成本对标与经济性分析</div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {product.costEstimation.economicAdvantage}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 弹窗底部操作 */}
        <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            内部物料：<span className="font-semibold text-slate-700 font-mono">{product.code}</span> ({product.name})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition shadow-xs cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
