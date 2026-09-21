import React from 'react';
import { 
  Compass, 
  HelpCircle
} from 'lucide-react';

interface Props {
  onOpenHelp: () => void;
}

export const Header: React.FC<Props> = ({
  onOpenHelp,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & 品牌名 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                材料智能选材与替代推荐系统
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                PRO 工业版
              </span>
            </div>
          </div>
        </div>

        {/* 右侧快捷动作 */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-nav-help"
            type="button"
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">评定指南</span>
          </button>
        </div>
      </div>
    </header>
  );
};
