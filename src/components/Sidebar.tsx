import React from 'react';
import { 
  Activity, 
  Layers, 
  BookOpen, 
  ArrowLeftRight, 
  ClipboardList,
  Sparkles
} from 'lucide-react';
import { SidebarNavKey } from '../types';

interface Props {
  currentNav: SidebarNavKey;
  onSelectNav: (key: SidebarNavKey) => void;
  isCollapsed: boolean;
  onInitiateSelection: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentNav,
  onSelectNav,
  isCollapsed,
  onInitiateSelection,
}) => {
  const menuItems = [
    {
      key: 'production' as SidebarNavKey,
      label: '生产数据',
      icon: Activity,
    },
    {
      key: 'products' as SidebarNavKey,
      label: '产品库',
      icon: Layers,
    },
    {
      key: 'standards' as SidebarNavKey,
      label: '标准库',
      icon: BookOpen,
    },
    {
      key: 'grade_convert' as SidebarNavKey,
      label: '牌号转换',
      icon: ArrowLeftRight,
    },
    {
      key: 'selection_records' as SidebarNavKey,
      label: '选材记录',
      icon: ClipboardList,
      badge: '新',
    },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16' : 'w-56'
      } bg-[#141b2d] text-slate-200 transition-all duration-300 ease-in-out shrink-0 flex flex-col z-30 min-h-screen border-r border-slate-800 select-none`}
    >
      {/* 顶部企业品牌标识 */}
      <div className="h-16 px-3.5 flex items-center gap-2.5 border-b border-slate-800/80">
        {/* 永锋集团官方风格绿色标志 */}
        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-400/40">
          <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.6"/>
            <path d="M16 6 L20 14 L24 14 L18 20 L21 26 L16 22 L11 26 L14 20 L8 14 L12 14 Z" fill="currentColor"/>
          </svg>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col truncate">
            <span className="text-[15px] font-bold text-white tracking-wide leading-tight">
              永锋集团
            </span>
            <span className="text-[9px] text-slate-400 font-medium tracking-wider">
              YONGFENG GROUP
            </span>
          </div>
        )}
      </div>

      {/* 快捷发起选材按钮 (侧边栏专属快捷入口) */}
      <div className="p-3">
        <button
          id="btn-sidebar-quick-initiate"
          type="button"
          onClick={onInitiateSelection}
          title="发起选材：进入材料智能选材与替代推荐系统"
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-start px-3 py-2'
          } rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm hover:shadow transition duration-200 cursor-pointer group`}
        >
          <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform shrink-0" />
          {!isCollapsed && (
            <span className="ml-2 font-medium">发起选材</span>
          )}
        </button>
      </div>

      {/* 主导航菜单列表 */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentNav === item.key;
          return (
            <button
              key={item.key}
              id={`nav-sidebar-${item.key}`}
              type="button"
              onClick={() => onSelectNav(item.key)}
              title={item.label}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
              } py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 底部系统状态说明 */}
      {!isCollapsed && (
        <div className="p-3.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>选型引擎 v2.8</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          </div>
          <div className="text-slate-400 truncate">
            智能特钢配比服务在线
          </div>
        </div>
      )}
    </aside>
  );
};
