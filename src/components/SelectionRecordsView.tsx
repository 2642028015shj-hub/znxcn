import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Download, 
  RotateCcw, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { SelectionRecord, CustomerRequirement, ElementRange } from '../types';

interface Props {
  records: SelectionRecord[];
  onInitiateSelection: () => void;
  onLoadRecordToEngine: (req: CustomerRequirement, record: SelectionRecord) => void;
  onViewRecordDetail: (record: SelectionRecord) => void;
}

export const SelectionRecordsView: React.FC<Props> = ({
  records,
  onInitiateSelection,
  onLoadRecordToEngine,
  onViewRecordDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'trial_production' | 'reviewing'>('all');
  const [selectedRecordForPreview, setSelectedRecordForPreview] = useState<SelectionRecord | null>(null);

  // 过滤记录
  const filteredRecords = records.filter(rec => {
    const matchesSearch = 
      rec.targetGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.recordNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.bestMatchedProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.creator.includes(searchTerm) ||
      rec.application.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计数值
  const totalCount = records.length;
  const completedCount = records.filter(r => r.status === 'completed').length;
  const trialCount = records.filter(r => r.status === 'trial_production').length;
  const avgScore = totalCount > 0 
    ? (records.reduce((acc, r) => acc + r.overallScore, 0) / totalCount).toFixed(1)
    : '0.0';

  const exportRecordsCSV = () => {
    const headers = ['选材单号', '发起时间', '发起人', '目标牌号', '执行标准', '交货状态', '推荐替代产品', '匹配得分', '状态'];
    const rows = filteredRecords.map(r => [
      r.recordNo,
      r.createdAt,
      `${r.creator}(${r.creatorDept})`,
      r.targetGrade,
      r.standard,
      r.deliveryState,
      r.bestMatchedProductName,
      `${r.overallScore}%`,
      r.statusLabel
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `永锋特钢_选材记录清单_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 顶部标题与主要行动栏 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              选材记录
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              全生命周期可追溯
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            沉淀特钢研发、外标对标与生产替代方案，支持历史工艺指标一键载入重新选材与技术复核
          </p>
        </div>

        {/* 核心行动按钮：发起选材 */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="btn-export-records-csv"
            type="button"
            onClick={exportRecordsCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 transition shadow-2xs cursor-pointer"
            title="导出 CSV 表格"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>导出记录</span>
          </button>

          <button
            id="btn-initiate-selection-main"
            type="button"
            onClick={onInitiateSelection}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition duration-150 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>发起选材</span>
          </button>
        </div>
      </div>

      {/* 关键指标概览卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">累计选材方案</div>
            <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
              {totalCount} <span className="text-xs font-normal text-slate-400">项</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">已定型推荐</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              {completedCount} <span className="text-xs font-normal text-slate-400">方案</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">转产/试制订单</div>
            <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
              {trialCount} <span className="text-xs font-normal text-slate-400">批次</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">平均综合吻合度</div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
              {avgScore}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 搜索与多维度筛选栏 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* 搜索输入 */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-records"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索目标牌号、选材单号、替代产品或发起人..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* 状态快速过滤 */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            <span className="text-slate-400 shrink-0 mr-1">状态：</span>
            {[
              { key: 'all', label: '全部' },
              { key: 'completed', label: '已推荐定型' },
              { key: 'trial_production', label: '已转生产试制' },
              { key: 'reviewing', label: '技术评审中' },
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as any)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 选材记录表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              选材方案清单
            </span>
            <span className="text-xs font-mono text-slate-400">
              (共 {filteredRecords.length} 条)
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              吻合度 &gt; 95% 推荐替代
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-semibold select-none">
                <th className="py-3 px-3.5 w-10 text-center">#</th>
                <th className="py-3 px-3.5">选材单号</th>
                <th className="py-3 px-3.5">目标牌号 / 执行标准</th>
                <th className="py-3 px-3.5">产品形态 / 规格</th>
                <th className="py-3 px-3.5">推荐替代产品方案</th>
                <th className="py-3 px-3.5 text-center">综合匹配分</th>
                <th className="py-3 px-3.5">发起人</th>
                <th className="py-3 px-3.5">发起时间</th>
                <th className="py-3 px-3.5 text-center">状态</th>
                <th className="py-3 px-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p>暂无符合条件的选材记录</p>
                    <button
                      type="button"
                      onClick={onInitiateSelection}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>立即发起选材</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const isTopScore = rec.overallScore >= 96;
                  return (
                    <tr 
                      key={rec.id}
                      className="hover:bg-blue-50/40 transition group"
                    >
                      {/* 序号 */}
                      <td className="py-3 px-3.5 text-center text-slate-400 font-mono">
                        {index + 1}
                      </td>

                      {/* 选材单号 */}
                      <td className="py-3 px-3.5">
                        <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {rec.recordNo}
                        </span>
                      </td>

                      {/* 目标牌号 & 标准 */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900 text-sm">
                          {rec.targetGrade}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {rec.standard}
                        </div>
                      </td>

                      {/* 产品形态 / 规格 */}
                      <td className="py-3 px-3.5">
                        <div className="text-slate-800 font-medium truncate max-w-[140px]" title={rec.application}>
                          {rec.application || '通用结构件'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {rec.specSummary}
                        </div>
                      </td>

                      {/* 推荐最佳替代品 */}
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900">
                          {rec.bestMatchedProductName}
                        </div>
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                          <span className="font-mono">{rec.bestMatchedGrade}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[10px] bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                            {rec.matchType}
                          </span>
                        </div>
                      </td>

                      {/* 综合匹配分 */}
                      <td className="py-3 px-3.5 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-mono font-bold text-xs ${
                          isTopScore 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {rec.overallScore}%
                        </span>
                      </td>

                      {/* 发起人 */}
                      <td className="py-3 px-3.5">
                        <div className="text-slate-800 font-medium">
                          {rec.creator}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rec.creatorDept}
                        </div>
                      </td>

                      {/* 发起时间 */}
                      <td className="py-3 px-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {rec.createdAt}
                      </td>

                      {/* 状态 */}
                      <td className="py-3 px-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          rec.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.status === 'trial_production'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rec.statusLabel}
                        </span>
                      </td>

                      {/* 操作 */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 载入选材系统按钮 */}
                          <button
                            type="button"
                            onClick={() => onLoadRecordToEngine(rec.requirement, rec)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="将此记录指标直接载入材料智能选材与替代推荐系统"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>载入选材</span>
                          </button>

                          {/* 查看详情 */}
                          <button
                            type="button"
                            onClick={() => setSelectedRecordForPreview(rec)}
                            className="px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition cursor-pointer"
                          >
                            <span>详情</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 记录详情弹窗 */}
      {selectedRecordForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded border border-blue-400/30">
                    {selectedRecordForPreview.recordNo}
                  </span>
                  <h3 className="text-base font-bold">
                    选材评定报告档案
                  </h3>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  发起时间：{selectedRecordForPreview.createdAt} &middot; 发起人：{selectedRecordForPreview.creator} ({selectedRecordForPreview.creatorDept})
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecordForPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition text-lg"
              >
                ✕
              </button>
            </div>

            {/* 弹窗主体 */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              {/* 核心比对卡片 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-500 mb-1">客户原始输入要求</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {selectedRecordForPreview.targetGrade}
                  </div>
                  <div className="text-slate-500 mt-1 space-y-0.5 text-[11px]">
                    <div>执行标准：{selectedRecordForPreview.standard}</div>
                    <div>交货状态：{selectedRecordForPreview.deliveryState}</div>
                    <div>产品形态：{selectedRecordForPreview.application}</div>
                    <div>规格要求：{selectedRecordForPreview.specSummary}</div>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-700 mb-1 flex items-center justify-between">
                    <span>系统推荐最佳替代料</span>
                    <span className="text-sm font-mono font-bold text-emerald-600">
                      {selectedRecordForPreview.overallScore}% 吻合
                    </span>
                  </div>
                  <div className="text-base font-bold text-emerald-950">
                    {selectedRecordForPreview.bestMatchedProductName}
                  </div>
                  <div className="text-emerald-900 mt-1 space-y-0.5 text-[11px]">
                    <div>对应牌号：{selectedRecordForPreview.bestMatchedGrade}</div>
                    <div>推荐属性：{selectedRecordForPreview.matchType}</div>
                    <div>物料编号：{selectedRecordForPreview.bestMatchedProductCode}</div>
                    <div>状态流转：{selectedRecordForPreview.statusLabel}</div>
                  </div>
                </div>
              </div>

              {/* 技术评语 */}
              {selectedRecordForPreview.notes && (
                <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="font-semibold text-blue-900 mb-1">技术评语与推荐结论：</div>
                  <p className="text-blue-800 leading-relaxed">
                    {selectedRecordForPreview.notes}
                  </p>
                </div>
              )}

              {/* 关键成分比对预览 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800 mb-2">主要化学成分限额要求 (wt%)：</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedRecordForPreview.requirement.chemical).map(([elem, rawRange]) => {
                    const range = rawRange as ElementRange;
                    return (
                      <span key={elem} className="px-2 py-1 bg-white border border-slate-200 rounded font-mono text-[11px]">
                        <strong className="text-slate-800">{elem}:</strong> {range.min !== undefined ? `${range.min}%` : '0'} ~ {range.max !== undefined ? `${range.max}%` : '余量'}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRecordForPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                关闭
              </button>

              <button
                type="button"
                onClick={() => {
                  const req = selectedRecordForPreview.requirement;
                  const rec = selectedRecordForPreview;
                  setSelectedRecordForPreview(null);
                  onLoadRecordToEngine(req, rec);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>进入材料智能选材系统重新核算</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
