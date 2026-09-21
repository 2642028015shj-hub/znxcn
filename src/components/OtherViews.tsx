import React, { useState } from 'react';
import { 
  Activity, 
  BookOpen, 
  ArrowLeftRight, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Flame,
  Layers,
  FileCheck
} from 'lucide-react';
import { SidebarNavKey } from '../types';

interface OtherViewProps {
  type: 'production' | 'standards' | 'grade_convert';
  onInitiateSelection: (initialGrade?: string) => void;
}

export const OtherViews: React.FC<OtherViewProps> = ({ type, onInitiateSelection }) => {
  const [search, setSearch] = useState('');

  if (type === 'production') {
    return (
      <div className="space-y-4 pb-12 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              生产数据监控中心
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              实时追踪特钢冶炼炉次配料收得率、连铸连轧产线负荷与成品理化检验合格率
            </p>
          </div>
          <button
            type="button"
            onClick={() => onInitiateSelection()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>基于产线余坯发起选材</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">当前在线特钢炉批</div>
            <div className="text-2xl font-bold font-mono text-slate-800 mt-1">18 <span className="text-xs font-normal text-slate-400">炉次</span></div>
            <div className="text-emerald-600 mt-2 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> LF/VD精炼纯净度达标率 99.8%
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">当日调质产线产能</div>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-1">3,420 <span className="text-xs font-normal text-slate-400">吨</span></div>
            <div className="text-slate-500 mt-2">热处理等温温控精度 &plusmn;3℃</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-slate-500 font-medium">保函MTC出证速度</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">100% <span className="text-xs font-normal text-slate-400">线上溯源</span></div>
            <div className="text-slate-500 mt-2">直连国家钢铁材料质量监督检验中心</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'standards') {
    const standardsList = [
      { code: 'GB/T 3077-2015', name: '合金结构钢技术条件', category: '国标 GB', count: 46 },
      { code: 'EN 10083-3:2018', name: '淬火和回火用钢 - 硼合金钢及其他合金钢交货技术条件', category: '欧标 EN', count: 38 },
      { code: 'ASTM A240/A240M', name: '压力容器及通用铬和铬镍不锈钢板标准规范', category: '美标 ASTM', count: 52 },
      { code: 'GB/T 713-2023', name: '锅炉和压力容器用钢板', category: '国标 GB', count: 24 },
      { code: 'JIS G4053:2016', name: '机械制造结构用低合金钢', category: '日标 JIS', count: 32 },
    ];

    return (
      <div className="space-y-4 pb-12 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              冶金技术标准库
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              覆盖 GB/T、ASTM、EN、JIS、ISO 现行及内控冶炼技术标准库，支持标准成分性能阈值直通选材
            </p>
          </div>
          <button
            type="button"
            onClick={() => onInitiateSelection()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>进入智能选材</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索标准号 (如 GB/T 3077, EN 10083)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {standardsList.map((st, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{st.code}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">{st.category}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">{st.name}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onInitiateSelection()}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded font-medium text-xs flex items-center gap-1"
                >
                  <span>以此标准选材</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'grade_convert') {
    const crossList = [
      { gb: '42CrMo / 42CrMoA', astm: 'AISI 4140 / 4142', en: '42CrMo4 / 1.7225', jis: 'SCM440', type: '调质合金结构钢' },
      { gb: '022Cr17Ni12Mo2', astm: 'AISI 316L', en: '1.4404 / X2CrNiMo17-12-2', jis: 'SUS316L', type: '耐蚀奥氏体不锈钢' },
      { gb: 'Q345R', astm: 'SA-516 Gr.70', en: 'P355GH', jis: 'SGV480', type: '锅炉与承压容器板' },
      { gb: 'Q355B / Q355D', astm: 'ASTM A572 Gr.50', en: 'S355JR / S355J2', jis: 'SM490A', type: '低合金高强结构钢' },
      { gb: '60Si2Mn', astm: 'AISI 9260', en: '60SiCr7', jis: 'SUP7', type: '高强度弹簧钢' },
    ];

    return (
      <div className="space-y-4 pb-12 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-blue-600" />
              国际钢号等效转换对照
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              提供中(GB)、美(ASTM/AISI)、欧(EN/DIN)、日(JIS)跨国标准牌号交叉对照与一键智能匹配
            </p>
          </div>
          <button
            type="button"
            onClick={() => onInitiateSelection()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>智能选材推荐</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">中国国标 (GB/T)</th>
                <th className="py-3 px-4">美标 (ASTM/AISI)</th>
                <th className="py-3 px-4">欧标 (EN/DIN)</th>
                <th className="py-3 px-4">日标 (JIS)</th>
                <th className="py-3 px-4">大类属性</th>
                <th className="py-3 px-4 text-right">选材与替代</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {crossList.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">{row.gb}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{row.astm}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{row.en}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{row.jis}</td>
                  <td className="py-3 px-4 text-slate-500">{row.type}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onInitiateSelection(row.en.split('/')[0].trim())}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition"
                    >
                      替代选型
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};
