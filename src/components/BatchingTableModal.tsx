import React from 'react';
import { InternalProduct } from '../types';
import { X, TableProperties, Flame, Coins, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  product: InternalProduct | null;
  onClose: () => void;
}

export const BatchingTableModal: React.FC<Props> = ({ product, onClose }) => {
  if (!product) return null;

  const { batchingPlan, costEstimation } = product;

  return (
    <div 
      id="modal-batching-table"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* 弹窗头部 */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <TableProperties className="w-5 h-5" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-mono">
                {product.code} 冶炼配料表
              </h3>
              <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                {product.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              执行标准：{product.standard} &middot; 交货状态：{product.deliveryState}
            </p>
          </div>

          <button
            id="btn-close-batching-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-lg transition"
            title="关闭配料表"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 关键指标看板 */}
        <div className="px-4 sm:px-6 py-3 bg-amber-50/60 border-b border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-white border border-amber-200 px-2.5 py-1 rounded-md text-slate-700 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              综合金属收得率: <strong className="text-slate-900 font-mono">{batchingPlan.recoveryRate}%</strong>
            </span>
            <span className="bg-white border border-amber-200 px-2.5 py-1 rounded-md text-slate-700 font-medium flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              原料及铁合金项数: <strong className="text-slate-900 font-mono">{batchingPlan.materials.length} 种</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-900 font-semibold bg-amber-100/70 px-3 py-1 rounded-md border border-amber-300/60">
            <Coins className="w-4 h-4 text-amber-700" />
            <span>吨钢原料及铁合金成本合计：</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-amber-950">
              &yen;{Math.round(costEstimation.rawMaterialCost).toLocaleString()} / 吨
            </span>
          </div>
        </div>

        {/* 弹窗主体滚动区 */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* 冶炼精炼路径 */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>冶炼与精炼热加工路径：</span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-5 font-mono text-[11px] sm:text-xs">
              {batchingPlan.furnaceRoute}
            </p>
            {batchingPlan.slagNotes && (
              <div className="pl-5 pt-1 text-[11px] text-slate-500">
                <span className="font-medium text-slate-600">造渣与脱氧要点：</span>
                {batchingPlan.slagNotes}
              </div>
            )}
          </div>

          {/* 配料表数据明细 */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>原材料 / 铁合金配比明细清单</span>
              <span className="text-[11px] font-normal text-slate-500">按 1 吨合格合格钢水入炉配料折算</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="p-2.5 font-semibold text-center w-12">序号</th>
                    <th className="p-2.5 font-semibold">原材料 / 铁合金</th>
                    <th className="p-2.5 font-semibold">配料工艺功能与目的</th>
                    <th className="p-2.5 font-semibold text-right">吨钢加入量</th>
                    <th className="p-2.5 font-semibold text-right">原料参考单价</th>
                    <th className="p-2.5 font-semibold text-right">吨钢分项成本</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {batchingPlan.materials.map((mat, mIdx) => (
                    <tr key={mIdx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 text-center font-mono text-slate-400">{mIdx + 1}</td>
                      <td className="p-2.5 font-medium text-slate-900">{mat.name}</td>
                      <td className="p-2.5 text-slate-600">{mat.role}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-blue-700">
                        {mat.amountKg} kg/t
                      </td>
                      <td className="p-2.5 text-right font-mono text-slate-500">{mat.unitPriceDisplay}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                        &yen;{mat.costPerTon.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-amber-50/70 border-t-2 border-amber-200 text-[11px] font-bold text-amber-950">
                    <td colSpan={3} className="p-3 text-right">
                      吨钢原料及铁合金成本合计：
                    </td>
                    <td className="p-3 text-right font-mono text-blue-900">
                      {batchingPlan.materials.reduce((sum, m) => sum + m.amountKg, 0).toFixed(1)} kg
                    </td>
                    <td className="p-3 text-right text-slate-400">-</td>
                    <td className="p-3 text-right font-mono text-sm font-extrabold text-amber-900">
                      &yen;{costEstimation.rawMaterialCost.toFixed(1)} / 吨
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 原料经济对标分析 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>原料成本对标与经济性分析：</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs pl-5">
              {costEstimation.economicAdvantage}
            </p>
          </div>
        </div>

        {/* 弹窗底部操作区 */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
