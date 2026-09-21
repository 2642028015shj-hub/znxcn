import React from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  HelpCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { SidebarNavKey } from '../types';

interface Props {
  currentNav: SidebarNavKey;
  onToggleSidebar: () => void;
  onOpenHelp: () => void;
  onInitiateSelection: () => void;
  onBackToRecords?: () => void;
}

export const TopNavbar: React.FC<Props> = ({
  currentNav,
  onToggleSidebar,
  onOpenHelp,
  onInitiateSelection,
  onBackToRecords,
}) => {
  const [isDark, setIsDark] = React.useState(false);

  const getTitle = () => {
    switch (currentNav) {
      case 'selection_records':
        return '选材记录';
      case 'selection_engine':
        return '材料智能选材与替代推荐系统';
      case 'products':
        return '产品库';
      case 'standards':
        return '标准库';
      case 'grade_convert':
        return '牌号转换';
      case 'production':
        return '生产数据';
      default:
        return '选材记录';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* 左侧：折叠按钮 + 页面标题 */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
          title="折叠/展开侧边栏"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {currentNav === 'selection_engine' && onBackToRecords && (
            <button
              id="btn-nav-back-records"
              type="button"
              onClick={onBackToRecords}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-md transition cursor-pointer mr-1"
              title="返回选材记录列表"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>选材记录</span>
              <span className="text-slate-300">/</span>
            </button>
          )}

          <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            {getTitle()}
          </h2>

          {currentNav === 'selection_engine' && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              工业特钢选型引擎
            </span>
          )}
        </div>
      </div>

      {/* 右侧：发起选材快捷键、主题切换、帮助、用户信息 */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentNav !== 'selection_engine' && (
          <button
            id="btn-top-initiate-selection"
            type="button"
            onClick={onInitiateSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs hover:shadow transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>发起选材</span>
          </button>
        )}

        {/* 评定指南 */}
        <button
          id="btn-top-help"
          type="button"
          onClick={onOpenHelp}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
          title="评定指南与规则"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* 主题切换图标 */}
        <button
          id="btn-theme-toggle"
          type="button"
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
          title={isDark ? '切换至亮色模式' : '切换至暗色模式'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* 用户信息头像 (按照附件样式) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            陶
          </div>
          <span className="text-xs font-medium text-slate-700 hidden sm:inline">
            陶淳
          </span>
        </div>
      </div>
    </header>
  );
};
