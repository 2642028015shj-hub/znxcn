import React, { useState } from 'react';
import { InternalProduct, MaterialCategory, InternalElementRange } from '../types';
import { 
  X, 
  Search, 
  Filter, 
  Layers, 
  Check, 
  ChevronRight, 
  Sparkles,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: InternalProduct[];
  onSelectProduct: (product: InternalProduct) => void;
}

export const DatabaseCatalogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailProduct, setDetailProduct] = useState<InternalProduct | null>(products[0] || null);

  if (!isOpen) return null;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.standard.toLowerCase().includes(q) ||
      (p.equivalentGrades.gb && p.equivalentGrades.gb.toLowerCase().includes(q)) ||
      (p.equivalentGrades.astm && p.equivalentGrades.astm.toLowerCase().includes(q)) ||
      (p.equivalentGrades.en && p.equivalentGrades.en.toLowerCase().includes(q)) ||
      (p.equivalentGrades.jis && p.equivalentGrades.jis.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="modal-database-catalog"
        className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* 顶部标题栏 */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">公司内部特钢及合金产品数据库</h3>
              <p className="text-xs text-slate-400">
                收录 {products.length} 种经冶金内控与型式认证的高端结构钢、不锈钢、高温耐蚀合金与模具钢
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 搜索与过滤工具栏 */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索内部编码、牌号、国标、美标或欧标 (如: 4140, 316L, H13)..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { key: 'all', label: '全部类别' },
              { key: 'alloy_structural', label: '合金结构钢/调质钢' },
              { key: 'stainless', label: '耐蚀不锈钢/双相钢' },
              { key: 'hsla', label: '低合金高强钢' },
              { key: 'tool_die', label: '模具工具钢' },
              { key: 'special_alloy', label: '高温耐蚀合金' },
              { key: 'light_alloy', label: '铝合金' },
            ].map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1.5 rounded-md transition text-xs font-medium whitespace-nowrap ${
                  selectedCategory === cat.key
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 双栏主体：左侧产品列表，右侧产品深度参数档案 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* 左侧列表 */}
          <div className="lg:col-span-5 border-r border-slate-200 overflow-y-auto p-3 space-y-2 max-h-[300px] lg:max-h-[620px]">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                未找到匹配的内部产品
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isSelected = detailProduct?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setDetailProduct(p)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold font-mono text-sm text-slate-900">
                          {p.code}
                        </span>
                        <div className="font-medium text-slate-700 mt-0.5">
                          {p.name}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {p.categoryLabel}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                      等效: {p.equivalentGrades.gb || ''} | {p.equivalentGrades.astm || ''} | {p.equivalentGrades.en || ''}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                      <span>交货: {p.deliveryState}</span>
                      <span className="text-blue-600 font-semibold">{p.stockLabel}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 右侧选定产品参数详情卡 */}
          <div className="lg:col-span-7 overflow-y-auto p-4 sm:p-6 bg-white space-y-5 max-h-[450px] lg:max-h-[620px]">
            {detailProduct ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {detailProduct.categoryLabel}
                      </span>
                      <span className="text-xs text-slate-500">
                        执行厂标: {detailProduct.standard}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {detailProduct.code}
                    </h4>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">
                      {detailProduct.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct(detailProduct);
                      onClose();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
                  >
                    <span>按此产品匹配相近物料</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 跨国等效牌号 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-700 mb-1.5">跨国执行标准与等效牌号对照</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">中国国标 GB</span>
                      <span className="font-semibold text-slate-800">{detailProduct.equivalentGrades.gb || '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">美国 ASTM / AISI</span>
                      <span className="font-semibold text-slate-800">{detailProduct.equivalentGrades.astm || '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">欧洲 EN / DIN</span>
                      <span className="font-semibold text-slate-800">{detailProduct.equivalentGrades.en || '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block">日本 JIS</span>
                      <span className="font-semibold text-slate-800">{detailProduct.equivalentGrades.jis || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* 化学成分表 */}
                <div>
                  <div className="font-semibold text-xs text-slate-700 mb-2">
                    化学成分内控公差带 (wt%)
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="p-2">元素</th>
                          <th className="p-2">内控下限 (Min%)</th>
                          <th className="p-2">内控上限 (Max%)</th>
                          <th className="p-2">典型生产中心值</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {Object.entries(detailProduct.composition).map(([el, rangeVal]) => {
                          const range = rangeVal as InternalElementRange;
                          return (
                            <tr key={el} className="hover:bg-slate-50">
                              <td className="p-2 font-bold text-slate-900">{el}</td>
                              <td className="p-2 text-slate-600">{range.min}%</td>
                              <td className="p-2 text-slate-600">{range.max}%</td>
                              <td className="p-2 font-semibold text-blue-700">{range.typical}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 力学性能保证值 */}
                <div>
                  <div className="font-semibold text-xs text-slate-700 mb-2">
                    交付力学性能保证指标 (热处理状态: {detailProduct.deliveryState})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">屈服强度 Rp0.2 / ReH</span>
                      <span className="text-base font-bold font-mono text-blue-700">
                        ≥ {detailProduct.mechanical.yield.min} MPa
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        典型值: {detailProduct.mechanical.yield.typical} MPa
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">抗拉强度 Rm</span>
                      <span className="text-base font-bold font-mono text-blue-700">
                        ≥ {detailProduct.mechanical.tensile.min} MPa
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        典型值: {detailProduct.mechanical.tensile.typical} MPa
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">断后伸长率 A</span>
                      <span className="text-base font-bold font-mono text-blue-700">
                        ≥ {detailProduct.mechanical.elongation.min} %
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        典型值: {detailProduct.mechanical.elongation.typical} %
                      </span>
                    </div>

                    {detailProduct.mechanical.impact && (
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">冲击韧性 KV2</span>
                        <span className="text-base font-bold font-mono text-emerald-700">
                          ≥ {detailProduct.mechanical.impact.energy} J
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          试验温度: {detailProduct.mechanical.impact.temp}
                        </span>
                      </div>
                    )}

                    {detailProduct.mechanical.hardness && (
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">硬度范围</span>
                        <span className="text-base font-bold font-mono text-purple-700">
                          {detailProduct.mechanical.hardness.value}
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          标尺: {detailProduct.mechanical.hardness.scale}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 详细描述与应用场景 */}
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800">工艺说明：</span>
                    {detailProduct.description}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">典型构件：</span>
                    {detailProduct.typicalApplications.join('、')}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                请在左侧选择产品查看详细参数
              </div>
            )}
          </div>
        </div>

        {/* 底部栏 */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-lg transition"
          >
            关闭产品库
          </button>
        </div>
      </div>
    </div>
  );
};
