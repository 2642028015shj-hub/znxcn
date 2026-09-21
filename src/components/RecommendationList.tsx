import React, { useState } from 'react';
import { 
  MatchResult, 
  CustomerRequirement,
  InternalProduct
} from '../types';
import { 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Coins,
  TableProperties,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Ruler,
  FlaskConical,
  Gauge,
  BookmarkPlus,
  CheckCircle2
} from 'lucide-react';

interface Props {
  results: MatchResult[];
  customerReq: CustomerRequirement;
  onSelectCompare: (result: MatchResult) => void;
  onOpenBatching?: (product: InternalProduct) => void;
  onSaveRecord?: (result: MatchResult) => void;
}

export const RecommendationList: React.FC<Props> = ({
  results,
  customerReq,
  onSelectCompare,
  onOpenBatching,
  onSaveRecord,
}) => {
  // 维护卡片各维度子项详情展开状态
  const [expandedSubitems, setExpandedSubitems] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const toggleSubitems = (id: string) => {
    setExpandedSubitems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveClick = (result: MatchResult) => {
    if (onSaveRecord) {
      onSaveRecord(result);
      setSavedIds(prev => ({ ...prev, [result.product.id]: true }));
      setTimeout(() => {
        setSavedIds(prev => ({ ...prev, [result.product.id]: false }));
      }, 3000);
    }
  };

  // 严格只展示匹配度最高的 5 个产品
  const topFiveResults = results.slice(0, 5);

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">等待执行选材比对</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          请在上方填写客户提供的牌号、化学成分与力学指标后，点击“开始智能比对并推荐”。
        </p>
      </div>
    );
  }

  return (
    <div id="recommendation-list-panel" className="space-y-4">
      {/* 推荐产品区域标题栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 bg-blue-600 rounded-xs" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>推荐相近产品</span>
              <span className="text-xs font-normal text-slate-500 font-mono">(Top 5)</span>
            </h3>
          </div>
        </div>
      </div>

      {/* 推荐卡片列表（最多展示5个） */}
      <div className="space-y-4">
        {topFiveResults.map((result, idx) => {
          const { product, overallScore, scores } = result;

          // 统计成分与力学合规状况
          const chemAlerts = result.chemEvaluation.filter(c => c.status === 'alert').length;
          const mechAlerts = result.mechEvaluation.filter(m => m.status === 'alert').length;

          return (
            <div
              key={product.id}
              id={`card-recommendation-${product.id}`}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden"
            >
              {/* 卡片头部 */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                        TOP {idx + 1}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                        {product.code}
                      </h4>
                      <span className="text-xs text-slate-500 font-normal">
                        ({product.name})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>标准: <strong className="text-slate-700 font-normal">{product.standard}</strong></span>
                      <span>&middot;</span>
                      <span>交货状态: <strong className="text-slate-700 font-normal">{product.deliveryState}</strong></span>
                      <span>&middot;</span>
                      <span>品类: <strong className="text-slate-700 font-normal">{product.categoryLabel}</strong></span>
                    </div>
                  </div>

                  {/* 综合匹配度大分牌 */}
                  <div className="text-right shrink-0 bg-blue-50/70 border border-blue-100 rounded-xl px-3.5 py-2">
                    <div className="text-[11px] text-blue-700 font-medium">综合匹配度</div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700 leading-tight">
                      {overallScore}
                      <span className="text-sm font-semibold">%</span>
                    </div>
                  </div>
                </div>

                {/* 对标跨国标准牌号 */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-slate-400 text-[11px]">等效对标:</span>
                  {product.equivalentGrades.gb && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">
                      GB: {product.equivalentGrades.gb}
                    </span>
                  )}
                  {product.equivalentGrades.astm && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">
                      ASTM: {product.equivalentGrades.astm}
                    </span>
                  )}
                  {product.equivalentGrades.en && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">
                      EN: {product.equivalentGrades.en}
                    </span>
                  )}
                  {product.equivalentGrades.jis && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">
                      JIS: {product.equivalentGrades.jis}
                    </span>
                  )}
                </div>

                {/* 产品规格供货能力 */}
                <div className="mt-2.5 text-xs text-slate-600 flex items-center gap-1.5 bg-blue-50/50 px-2.5 py-1.5 rounded border border-blue-100">
                  <span className="font-semibold text-blue-800 text-[11px] shrink-0">可供规格能力:</span>
                  <span className="text-slate-700 font-mono text-[11px]">{product.specifications?.sizeRangeDisplay || '常规规格供货'}</span>
                </div>

                {/* 维度得分三维条 (产品规格 10% / 化学成分 45% / 力学性能 45%) */}
                <div className="mt-3.5 grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>产品规格吻合</span>
                      <span className="font-mono font-semibold text-slate-700">{scores.specScore}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scores.specScore >= 90 ? 'bg-blue-600' : scores.specScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${scores.specScore}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">计算权重 10%</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>化学成分吻合</span>
                      <span className="font-mono font-semibold text-slate-700">{scores.chemScore}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scores.chemScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${scores.chemScore}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">计算权重 45%</div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>力学性能达标</span>
                      <span className="font-mono font-semibold text-slate-700">{scores.mechScore}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scores.mechScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${scores.mechScore}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">计算权重 45%</div>
                  </div>
                </div>

                {/* 维度子项匹配度明细看板 */}
                <div className="mt-3.5 bg-slate-50/80 rounded-lg border border-slate-200/80 p-3">
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                      <span>各维度子项匹配度明细</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSubitems(product.id)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{expandedSubitems[product.id] ? '收起子项明细' : '展开子项明细表'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSubitems[product.id] ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* 1. 规格子项胶囊 */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0 w-16">
                        <Ruler className="w-3 h-3 text-blue-600" /> 规格子项:
                      </span>
                      {result.specEvaluation?.map((item, idx) => (
                        <span 
                          key={idx} 
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono ${
                            (item.matchScore ?? 100) >= 90 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : (item.matchScore ?? 100) >= 70 
                              ? 'bg-amber-50 border-amber-200 text-amber-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          <span className="font-sans text-[10px] text-slate-600">{item.dimension}</span>
                          <span className="font-bold">{item.matchScore ?? 100}%</span>
                        </span>
                      ))}
                    </div>

                    {/* 2. 化学成分子项胶囊 */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0 w-16">
                        <FlaskConical className="w-3 h-3 text-blue-600" /> 成分子项:
                      </span>
                      {result.chemEvaluation?.slice(0, 8).map((item, idx) => (
                        <span 
                          key={idx} 
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono ${
                            (item.matchScore ?? item.overlapPercent) >= 90 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : (item.matchScore ?? item.overlapPercent) >= 70 
                              ? 'bg-amber-50 border-amber-200 text-amber-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          <span className="font-bold">{item.element}</span>
                          <span>{item.matchScore ?? item.overlapPercent}%</span>
                        </span>
                      ))}
                      {(result.chemEvaluation?.length ?? 0) > 8 && (
                        <span className="text-[10px] text-slate-400">+{result.chemEvaluation.length - 8}项</span>
                      )}
                    </div>

                    {/* 3. 力学性能子项胶囊 */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0 w-16">
                        <Gauge className="w-3 h-3 text-indigo-600" /> 力学子项:
                      </span>
                      {result.mechEvaluation?.map((item, idx) => (
                        <span 
                          key={idx} 
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-mono ${
                            (item.matchScore ?? 90) >= 90 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : (item.matchScore ?? 90) >= 75 
                              ? 'bg-amber-50 border-amber-200 text-amber-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          <span className="font-sans text-[10px] text-slate-600">{item.property}</span>
                          <span className="font-bold">{item.matchScore ?? 90}%</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 展开的完整子项考核表格 */}
                  {expandedSubitems[product.id] && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2.5">
                      <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-md bg-white">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200">
                            <tr>
                              <th className="p-1.5 font-semibold">维度</th>
                              <th className="p-1.5 font-semibold">考核子项</th>
                              <th className="p-1.5 font-semibold">客户要求</th>
                              <th className="p-1.5 font-semibold">内部产品提供</th>
                              <th className="p-1.5 font-semibold">子项匹配度</th>
                              <th className="p-1.5 font-semibold">判定结果</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {/* 规格维度子项 */}
                            {result.specEvaluation?.map((item, idx) => (
                              <tr key={`spec-${idx}`} className="hover:bg-slate-50">
                                <td className="p-1.5 font-semibold text-blue-700 bg-blue-50/40">规格</td>
                                <td className="p-1.5 font-medium text-slate-900">{item.dimension}</td>
                                <td className="p-1.5 font-mono text-slate-600">{item.clientReqStr}</td>
                                <td className="p-1.5 font-mono text-slate-800">{item.productRangeStr}</td>
                                <td className="p-1.5 font-mono font-bold text-emerald-700">
                                  {item.matchScore ?? 100}%
                                </td>
                                <td className="p-1.5 text-slate-600">{item.marginStr}</td>
                              </tr>
                            ))}

                            {/* 化学成分子项 */}
                            {result.chemEvaluation?.map((item, idx) => (
                              <tr key={`chem-${idx}`} className="hover:bg-slate-50">
                                <td className="p-1.5 font-semibold text-emerald-700 bg-emerald-50/40">成分</td>
                                <td className="p-1.5 font-mono font-bold text-slate-900">{item.element}</td>
                                <td className="p-1.5 font-mono text-slate-600">{item.clientRangeStr}</td>
                                <td className="p-1.5 font-mono text-slate-800">{item.productRangeStr}</td>
                                <td className="p-1.5 font-mono font-bold text-emerald-700">
                                  {item.matchScore ?? item.overlapPercent}%
                                </td>
                                <td className="p-1.5 text-slate-600">{item.note}</td>
                              </tr>
                            ))}

                            {/* 力学性能子项 */}
                            {result.mechEvaluation?.map((item, idx) => (
                              <tr key={`mech-${idx}`} className="hover:bg-slate-50">
                                <td className="p-1.5 font-semibold text-indigo-700 bg-indigo-50/40">力学</td>
                                <td className="p-1.5 font-medium text-slate-900">{item.property} ({item.unit})</td>
                                <td className="p-1.5 font-mono text-slate-600">{item.clientReqStr}</td>
                                <td className="p-1.5 font-mono text-slate-800">{item.productValStr}</td>
                                <td className="p-1.5 font-mono font-bold text-emerald-700">
                                  {item.matchScore ?? 90}%
                                </td>
                                <td className="p-1.5 text-slate-600">{item.marginStr}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* 吨钢原料及铁合金成本测算专区 */}
                <div className="mt-3.5 bg-slate-50/80 rounded-lg border border-slate-200/80 p-3 sm:p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500 font-medium">吨钢原料及铁合金成本</div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 font-mono flex items-baseline gap-1">
                          <span>&yen;{Math.round(product.costEstimation.rawMaterialCost).toLocaleString()}</span>
                          <span className="text-xs font-normal text-slate-500">/ 吨</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      {product.costEstimation.economicAdvantage}
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部操作行动栏 */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {chemAlerts === 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> 化学成分完全达标
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> 成分有 {chemAlerts} 项需注意
                    </span>
                  )}
                  <span className="text-slate-300">|</span>
                  {mechAlerts === 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                      <Check className="w-3.5 h-3.5" /> 力学承载无短板
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-medium text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> 力学有 {mechAlerts} 项临界
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onSaveRecord && (
                    <button
                      id={`btn-save-record-${product.id}`}
                      type="button"
                      onClick={() => handleSaveClick(result)}
                      className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer text-xs ${
                        savedIds[product.id]
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                      title="将此选材及推荐方案沉淀至选材记录"
                    >
                      {savedIds[product.id] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>已存入记录</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
                          <span>保存至记录</span>
                        </>
                      )}
                    </button>
                  )}

                  {onOpenBatching && (
                    <button
                      id={`btn-batching-${product.id}`}
                      type="button"
                      onClick={() => onOpenBatching(product)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer text-xs"
                    >
                      <TableProperties className="w-3.5 h-3.5 text-amber-700" />
                      <span>配料表</span>
                    </button>
                  )}

                  <button
                    id={`btn-compare-${product.id}`}
                    type="button"
                    onClick={() => onSelectCompare(result)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition flex items-center gap-1 shadow-2xs cursor-pointer text-xs"
                  >
                    <span>详情</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
