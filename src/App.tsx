import React, { useState, useEffect } from 'react';
import { CustomerRequirement, MatchResult, InternalProduct, SidebarNavKey, SelectionRecord } from './types';
import { INTERNAL_PRODUCTS } from './data/internalProducts';
import { INITIAL_SELECTION_RECORDS } from './data/selectionRecords';
import { matchProducts } from './utils/matchingEngine';

import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { SelectionRecordsView } from './components/SelectionRecordsView';
import { ProductLibraryView } from './components/ProductLibraryView';
import { OtherViews } from './components/OtherViews';
import { CustomerIntakeForm } from './components/CustomerIntakeForm';
import { RecommendationList } from './components/RecommendationList';
import { DetailedComparisonModal } from './components/DetailedComparisonModal';
import { BatchingTableModal } from './components/BatchingTableModal';
import { HelpModal } from './components/HelpModal';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

const DEFAULT_REQUIREMENT: CustomerRequirement = {
  targetGrade: '42CrMo4',
  standard: 'EN 10083-3',
  deliveryState: '调质态 (+QT)',
  application: '重载齿轮轴与传动轴件',
  thicknessMin: 20,
  thicknessMax: 100,
  widthMin: 1200,
  widthMax: 2000,
  chemical: {
    C: { min: 0.38, max: 0.45 },
    Si: { max: 0.40 },
    Mn: { min: 0.60, max: 0.90 },
    P: { max: 0.025 },
    S: { max: 0.025 },
    Cr: { min: 0.90, max: 1.20 },
    Mo: { min: 0.15, max: 0.30 },
  },
  mechanical: {
    yieldMin: 750,
    tensileMin: 1000,
    elongationMin: 11,
    impactMin: 35,
    impactTemp: '20°C',
    hardnessScale: 'HBW',
  },
  weights: {
    specWeight: 10,
    chemWeight: 45,
    mechWeight: 45,
  },
};

export default function App() {
  // 当前导航页面：默认处于选材记录菜单
  const [currentNav, setCurrentNav] = useState<SidebarNavKey>('selection_records');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 历史选材记录列表 (支持本地持久化)
  const [records, setRecords] = useState<SelectionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('yf_selection_records');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load selection records from localStorage', e);
    }
    return INITIAL_SELECTION_RECORDS;
  });

  // 选材参数与产品数据
  const [requirement, setRequirement] = useState<CustomerRequirement>(DEFAULT_REQUIREMENT);
  const [products] = useState<InternalProduct[]>(INTERNAL_PRODUCTS);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // 弹窗状态管理
  const [detailedModalResult, setDetailedModalResult] = useState<MatchResult | null>(null);
  const [batchingModalProduct, setBatchingModalProduct] = useState<InternalProduct | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toast 消息提示
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 首次渲染预热匹配引擎
  useEffect(() => {
    executeMatching(requirement);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const executeMatching = (req: CustomerRequirement) => {
    setIsMatching(true);
    setTimeout(() => {
      const results = matchProducts(req, products);
      setMatchResults(results);
      setIsMatching(false);
    }, 120);
  };

  const handleManualMatch = () => {
    executeMatching(requirement);
  };

  const handleRequirementChange = (newReq: CustomerRequirement) => {
    setRequirement(newReq);
  };

  // 点击“发起选材”：打开材料智能选材与替代推荐系统页面
  const handleInitiateSelection = (initialGrade?: string) => {
    let newReq = { ...requirement };
    if (initialGrade) {
      newReq.targetGrade = initialGrade;
      setRequirement(newReq);
    }
    executeMatching(newReq);
    setCurrentNav('selection_engine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 从历史选材记录中载入指标至推荐系统
  const handleLoadRecordToEngine = (req: CustomerRequirement, record: SelectionRecord) => {
    setRequirement(req);
    executeMatching(req);
    setCurrentNav('selection_engine');
    showToast(`已成功载入历史选材单【${record.recordNo}】(${record.targetGrade}) 的完整参数`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 保存当前推荐结果到选材记录档案中
  const handleSaveToRecords = (result: MatchResult) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const fullTimeStr = `${now.toISOString().slice(0, 10)} ${timeStr}`;
    const seq = String(records.length + 1).padStart(3, '0');
    const recordNo = `XC-${dateStr}-${seq}`;

    const newRecord: SelectionRecord = {
      id: `rec-${Date.now()}`,
      recordNo,
      createdAt: fullTimeStr,
      creator: '陶淳',
      creatorDept: '技术中心·特钢研究所',
      targetGrade: requirement.targetGrade,
      standard: requirement.standard || '企标/内控',
      deliveryState: requirement.deliveryState || '常规交货',
      application: requirement.application || '工业部件',
      specSummary: `厚度 ${requirement.thicknessMin ?? '-'}~${requirement.thicknessMax ?? '-'}mm`,
      requirement: { ...requirement },
      bestMatchedProductCode: result.product.code,
      bestMatchedProductName: result.product.name,
      bestMatchedGrade: result.product.equivalentGrades.gb || result.product.name,
      overallScore: result.overallScore,
      matchType: result.recommendationTag,
      status: 'completed',
      statusLabel: '已推荐定型',
      notes: `综合匹配度达 ${result.overallScore}%，推荐选用 ${result.product.name} 作为对标替代方案。`,
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    try {
      localStorage.setItem('yf_selection_records', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(`已成功沉淀至选材记录档案：单号【${recordNo}】`);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 antialiased font-sans">
      {/* 左侧永锋集团规范深色导航栏 (包含新增的“选材记录”菜单) */}
      <Sidebar
        currentNav={currentNav}
        onSelectNav={(key) => setCurrentNav(key)}
        isCollapsed={isSidebarCollapsed}
        onInitiateSelection={() => handleInitiateSelection()}
      />

      {/* 主界面右侧区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部主导航条 */}
        <TopNavbar
          currentNav={currentNav}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onInitiateSelection={() => handleInitiateSelection()}
          onBackToRecords={() => setCurrentNav('selection_records')}
        />

        {/* 核心工作区 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          {/* 1. 选材记录页面 (默认展示，点击“发起选材”可跳转至推荐系统) */}
          {currentNav === 'selection_records' && (
            <SelectionRecordsView
              records={records}
              onInitiateSelection={() => handleInitiateSelection()}
              onLoadRecordToEngine={handleLoadRecordToEngine}
              onViewRecordDetail={(record) => {
                // 找到对应的匹配结果并打开详细比对
                const simRes: MatchResult = {
                  product: products.find(p => p.code === record.bestMatchedProductCode) || products[0],
                  overallScore: record.overallScore,
                  scores: { specScore: 98, chemScore: 97, mechScore: 99 },
                  recommendationType: 'best_match',
                  recommendationTag: record.matchType,
                  specEvaluation: [],
                  chemEvaluation: [],
                  mechEvaluation: [],
                  engineeringNotes: [record.notes || ''],
                };
                setDetailedModalResult(simRes);
              }}
            />
          )}

          {/* 2. 材料智能选材与替代推荐系统页面 (点击“发起选材”打开) */}
          {currentNav === 'selection_engine' && (
            <div className="space-y-6">
              {/* 返回选材记录条 */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  id="btn-back-to-records"
                  type="button"
                  onClick={() => setCurrentNav('selection_records')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400" />
                  <span>返回选材记录列表</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>当前处于智能选材与替代评定模式</span>
                </div>
              </div>

              {/* 上部分：客户选材需求录入表单 */}
              <section id="section-customer-intake" className="w-full">
                <CustomerIntakeForm
                  requirement={requirement}
                  onChange={handleRequirementChange}
                  onMatch={handleManualMatch}
                  isMatching={isMatching}
                />
              </section>

              {/* 下部分：推荐相近产品 (Top 5) */}
              <section id="section-recommendations" className="w-full">
                <RecommendationList
                  results={matchResults}
                  customerReq={requirement}
                  onSelectCompare={(result) => setDetailedModalResult(result)}
                  onOpenBatching={(prod) => setBatchingModalProduct(prod)}
                  onSaveRecord={handleSaveToRecords}
                />
              </section>
            </div>
          )}

          {/* 3. 产品库 (忠实还原附件截图的完整查询与表格) */}
          {currentNav === 'products' && (
            <ProductLibraryView
              products={products}
              onInitiateSelection={() => handleInitiateSelection()}
              onInitiateSelectionWithGrade={(grade) => handleInitiateSelection(grade)}
            />
          )}

          {/* 4. 生产数据、标准库、牌号转换 */}
          {(currentNav === 'production' || currentNav === 'standards' || currentNav === 'grade_convert') && (
            <OtherViews
              type={currentNav}
              onInitiateSelection={(grade) => handleInitiateSelection(grade)}
            />
          )}
        </main>

        {/* 底部版权与标准声明 */}
        <footer className="bg-white border-t border-slate-200 py-3.5 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
            <span>永锋集团 &middot; 材料智能选材与替代推荐系统</span>
            <span>工业数字化特钢选型中心 &middot; 具备材质保证书(MTC)跟踪追溯体系</span>
          </div>
        </footer>
      </div>

      {/* 弹窗 1: 深度技术比对矩阵 */}
      {detailedModalResult && (
        <DetailedComparisonModal
          result={detailedModalResult}
          customerReq={requirement}
          onClose={() => setDetailedModalResult(null)}
          onOpenBatching={(prod) => setBatchingModalProduct(prod)}
        />
      )}

      {/* 弹窗 2: 冶炼配料表 */}
      {batchingModalProduct && (
        <BatchingTableModal
          product={batchingModalProduct}
          onClose={() => setBatchingModalProduct(null)}
        />
      )}

      {/* 弹窗 3: 算法与规则说明指南 */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* 全局 Toast 通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
