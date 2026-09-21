import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Layers, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  CircleMinus, 
  CirclePlus,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { InternalProduct } from '../types';

interface Props {
  products: InternalProduct[];
  onInitiateSelectionWithGrade?: (grade: string) => void;
  onInitiateSelection: () => void;
}

export const ProductLibraryView: React.FC<Props> = ({
  products,
  onInitiateSelectionWithGrade,
  onInitiateSelection,
}) => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedDeliveryState, setSelectedDeliveryState] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [selectedSpecialReq, setSelectedSpecialReq] = useState('');
  const [showMoreConditions, setShowMoreConditions] = useState(true);

  // 尺寸规格
  const [thickMin, setThickMin] = useState('');
  const [thickMax, setThickMax] = useState('');
  const [widthMin, setWidthMin] = useState('');
  const [widthMax, setWidthMax] = useState('');

  // 模拟产品库数据 (对照截图及内部真实特钢产品)
  const [libraryData] = useState([
    {
      id: 'lib-1',
      index: 1,
      grade: 'A572Gr50',
      standard: 'ASTM A572',
      shape: '热轧开平板',
      deliveryState: '正火',
      thickMin: 10,
      thickMax: 10,
      widthMin: 1250,
      widthMax: 2000,
      updatedAt: '2026-09-18',
      cMin: null,
      cMax: 0.23,
      siMin: null,
      siMax: 0.40,
      mnMin: null,
      mnMax: 1.35,
      pMin: null,
      pMax: 0.035,
    },
    {
      id: 'lib-2',
      index: 2,
      grade: 'Q235C',
      standard: 'GB/T 3274',
      shape: '热轧卷板',
      deliveryState: '回火',
      thickMin: 2.76,
      thickMax: 25.4,
      widthMin: 1200,
      widthMax: 2100,
      updatedAt: '2026-09-15',
      cMin: 0.13,
      cMax: 0.16,
      siMin: 0.05,
      siMax: 0.15,
      mnMin: 0.25,
      mnMax: 0.45,
      pMin: null,
      pMax: 0.035,
    },
    {
      id: 'lib-3',
      index: 3,
      grade: 'YF235-J1',
      standard: 'GB/T 3274',
      shape: '热轧卷板',
      deliveryState: '热轧',
      thickMin: 1.2,
      thickMax: 25.4,
      widthMin: 1250,
      widthMax: 2100,
      updatedAt: '2026-09-12',
      cMin: 0.055,
      cMax: 0.07,
      siMin: null,
      siMax: 0.025,
      mnMin: 0.25,
      mnMax: 0.33,
      pMin: null,
      pMax: 0.025,
    },
    {
      id: 'lib-4',
      index: 4,
      grade: 'Q345R',
      standard: 'GB/T 713',
      shape: '热轧开平板',
      deliveryState: '正火',
      thickMin: 6.0,
      thickMax: 60.0,
      widthMin: 1500,
      widthMax: 2500,
      updatedAt: '2026-09-19',
      cMin: 0.14,
      cMax: 0.17,
      siMin: 0.05,
      siMax: 0.15,
      mnMin: 1.25,
      mnMax: 1.35,
      pMin: null,
      pMax: 0.020,
    },
    {
      id: 'lib-5',
      index: 5,
      grade: '42CrMo4',
      standard: 'EN 10083-3',
      shape: '优质圆棒',
      deliveryState: '调质 (+QT)',
      thickMin: 20.0,
      thickMax: 280.0,
      widthMin: null,
      widthMax: null,
      updatedAt: '2026-09-20',
      cMin: 0.38,
      cMax: 0.45,
      siMin: 0.17,
      siMax: 0.37,
      mnMin: 0.60,
      mnMax: 0.90,
      pMin: null,
      pMax: 0.025,
    },
    {
      id: 'lib-6',
      index: 6,
      grade: '316L',
      standard: 'ASTM A240',
      shape: '宽厚板',
      deliveryState: '固溶 (+AT)',
      thickMin: 8.0,
      thickMax: 90.0,
      widthMin: 1500,
      widthMax: 2200,
      updatedAt: '2026-09-17',
      cMin: null,
      cMax: 0.030,
      siMin: null,
      siMax: 0.75,
      mnMin: null,
      mnMax: 2.00,
      pMin: null,
      pMax: 0.045,
    },
    {
      id: 'lib-7',
      index: 7,
      grade: '60Si2Mn',
      standard: 'GB/T 1222',
      shape: '弹簧扁钢',
      deliveryState: '淬火+中温回火',
      thickMin: 12.0,
      thickMax: 35.0,
      widthMin: 80,
      widthMax: 160,
      updatedAt: '2026-09-14',
      cMin: 0.56,
      cMax: 0.64,
      siMin: 1.50,
      siMax: 2.00,
      mnMin: 0.60,
      mnMax: 0.90,
      pMin: null,
      pMax: 0.030,
    }
  ]);

  const [activeChemList, setActiveChemList] = useState([
    { element: 'C', min: '', max: '' },
    { element: 'Si', min: '', max: '' },
    { element: 'Mn', min: '', max: '' },
    { element: 'P', min: '', max: '' },
  ]);

  const [activeMechList, setActiveMechList] = useState([
    { prop: '抗拉强度(MPa)', min: '', max: '' },
    { prop: '屈服强度(MPa)', min: '', max: '' },
    { prop: '断后伸长率(%)', min: '', max: '' },
  ]);

  const handleReset = () => {
    setSelectedGrade('');
    setSelectedStandard('');
    setSelectedDeliveryState('');
    setSelectedShape('');
    setSelectedScope('');
    setSelectedSpecialReq('');
    setThickMin('');
    setThickMax('');
    setWidthMin('');
    setWidthMax('');
  };

  return (
    <div className="space-y-4 pb-12 text-xs">
      {/* 顶部多维检索表单区 (严格忠实于附件样式) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3.5">
        {/* 第一行 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-700 font-medium shrink-0">牌号</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="flex-1 h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择牌号</option>
              <option value="42CrMo4">42CrMo4</option>
              <option value="Q345R">Q345R</option>
              <option value="A572Gr50">A572Gr50</option>
              <option value="316L">316L</option>
              <option value="Q235C">Q235C</option>
              <option value="60Si2Mn">60Si2Mn</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-700 font-medium shrink-0">执行标准</span>
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="flex-1 h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择执行标准</option>
              <option value="GB/T 713">GB/T 713</option>
              <option value="EN 10083-3">EN 10083-3</option>
              <option value="ASTM A572">ASTM A572</option>
              <option value="ASTM A240">ASTM A240</option>
              <option value="GB/T 3274">GB/T 3274</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-700 font-medium shrink-0">交货状态</span>
            <select
              value={selectedDeliveryState}
              onChange={(e) => setSelectedDeliveryState(e.target.value)}
              className="flex-1 h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择交货状态</option>
              <option value="正火">正火 (+N)</option>
              <option value="调质">调质 (+QT)</option>
              <option value="回火">回火 (+T)</option>
              <option value="热轧">热轧 (+AR)</option>
              <option value="固溶">固溶 (+AT)</option>
            </select>
          </div>
        </div>

        {/* 第二行 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-700 font-medium shrink-0">产品形态</span>
            <select
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
              className="flex-1 h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择产品形态</option>
              <option value="热轧开平板">热轧开平板</option>
              <option value="热轧卷板">热轧卷板</option>
              <option value="中厚板">中厚板</option>
              <option value="优质圆棒">优质圆棒</option>
              <option value="弹簧扁钢">弹簧扁钢</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-700 font-medium shrink-0">产品范围</span>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="flex-1 h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择产品范围</option>
              <option value="锅炉压力容器板">锅炉压力容器板</option>
              <option value="合金调质机械结构钢">合金调质机械结构钢</option>
              <option value="耐候及高强结构钢">耐候及高强结构钢</option>
              <option value="特种奥氏体不锈钢">特种奥氏体不锈钢</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-16 text-slate-700 font-medium shrink-0">特殊需求</span>
            <select
              value={selectedSpecialReq}
              onChange={(e) => setSelectedSpecialReq(e.target.value)}
              className="flex-1 h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">请选择特殊需求</option>
              <option value="超低P/S超纯净">超低P/S超纯净钢</option>
              <option value="超低温冲击">超低温冲击 (-40℃ / -196℃)</option>
              <option value="抗氢致开裂HIC">抗氢致开裂 (HIC/SSCC)</option>
              <option value="高淬透性保淬透带">高淬透性 (H钢)</option>
            </select>
          </div>
        </div>

        {/* 第三行：尺寸规格 */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <span className="w-16 text-slate-700 font-medium shrink-0">尺寸规格:</span>
          
          {/* 厚度 */}
          <div className="flex items-center gap-1.5">
            <select className="h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700">
              <option>厚度</option>
              <option>规格直径</option>
            </select>
            <input
              type="text"
              placeholder="最小值"
              value={thickMin}
              onChange={(e) => setThickMin(e.target.value)}
              className="h-8.5 w-20 px-2 bg-white border border-slate-300 rounded text-xs text-center"
            />
            <span className="text-slate-400">~</span>
            <input
              type="text"
              placeholder="最大值"
              value={thickMax}
              onChange={(e) => setThickMax(e.target.value)}
              className="h-8.5 w-20 px-2 bg-white border border-slate-300 rounded text-xs text-center"
            />
          </div>

          {/* 宽度 */}
          <div className="flex items-center gap-1.5 ml-2">
            <select className="h-8.5 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700">
              <option>宽度</option>
            </select>
            <input
              type="text"
              placeholder="最小值"
              value={widthMin}
              onChange={(e) => setWidthMin(e.target.value)}
              className="h-8.5 w-20 px-2 bg-white border border-slate-300 rounded text-xs text-center"
            />
            <span className="text-slate-400">~</span>
            <input
              type="text"
              placeholder="最大值"
              value={widthMax}
              onChange={(e) => setWidthMax(e.target.value)}
              className="h-8.5 w-20 px-2 bg-white border border-slate-300 rounded text-xs text-center"
            />
          </div>
        </div>

        {/* 第四行：化学成分 */}
        {showMoreConditions && (
          <>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-slate-100">
              <span className="w-16 text-slate-700 font-medium shrink-0">化学成分:</span>
              <div className="flex flex-wrap items-center gap-3">
                {activeChemList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <select
                      value={item.element}
                      onChange={(e) => {
                        const newList = [...activeChemList];
                        newList[idx].element = e.target.value;
                        setActiveChemList(newList);
                      }}
                      className="h-8.5 w-16 px-2 bg-white border border-slate-300 rounded text-xs font-mono font-medium"
                    >
                      <option value="C">C</option>
                      <option value="Si">Si</option>
                      <option value="Mn">Mn</option>
                      <option value="P">P</option>
                      <option value="S">S</option>
                      <option value="Cr">Cr</option>
                      <option value="Mo">Mo</option>
                      <option value="Ni">Ni</option>
                    </select>
                    <input
                      type="text"
                      placeholder="最小值"
                      value={item.min}
                      onChange={(e) => {
                        const newList = [...activeChemList];
                        newList[idx].min = e.target.value;
                        setActiveChemList(newList);
                      }}
                      className="h-8.5 w-16 px-2 bg-white border border-slate-300 rounded text-xs text-center font-mono"
                    />
                    <span className="text-slate-400">~</span>
                    <input
                      type="text"
                      placeholder="最大值"
                      value={item.max}
                      onChange={(e) => {
                        const newList = [...activeChemList];
                        newList[idx].max = e.target.value;
                        setActiveChemList(newList);
                      }}
                      className="h-8.5 w-16 px-2 bg-white border border-slate-300 rounded text-xs text-center font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChemList(activeChemList.filter((_, i) => i !== idx));
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <CircleMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setActiveChemList([...activeChemList, { element: 'Cr', min: '', max: '' }]);
                  }}
                  className="p-1 text-blue-500 hover:text-blue-600"
                  title="添加化学元素"
                >
                  <CirclePlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 第五行：力学性能 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-slate-100">
              <span className="w-16 text-slate-700 font-medium shrink-0">力学性能:</span>
              <div className="flex flex-wrap items-center gap-3">
                {activeMechList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <select
                      value={item.prop}
                      onChange={(e) => {
                        const newList = [...activeMechList];
                        newList[idx].prop = e.target.value;
                        setActiveMechList(newList);
                      }}
                      className="h-8.5 w-28 px-2 bg-white border border-slate-300 rounded text-xs truncate"
                    >
                      <option value="抗拉强度(MPa)">抗拉强度(MPa)</option>
                      <option value="屈服强度(MPa)">屈服强度(MPa)</option>
                      <option value="断后伸长率(%)">断后伸长率(%)</option>
                      <option value="冲击功(J)">冲击功(J)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="最小值"
                      value={item.min}
                      onChange={(e) => {
                        const newList = [...activeMechList];
                        newList[idx].min = e.target.value;
                        setActiveMechList(newList);
                      }}
                      className="h-8.5 w-16 px-2 bg-white border border-slate-300 rounded text-xs text-center font-mono"
                    />
                    <span className="text-slate-400">~</span>
                    <input
                      type="text"
                      placeholder="最大值"
                      value={item.max}
                      onChange={(e) => {
                        const newList = [...activeMechList];
                        newList[idx].max = e.target.value;
                        setActiveMechList(newList);
                      }}
                      className="h-8.5 w-16 px-2 bg-white border border-slate-300 rounded text-xs text-center font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMechList(activeMechList.filter((_, i) => i !== idx));
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500"
                    >
                      <CircleMinus className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setActiveMechList([...activeMechList, { prop: '冲击功(J)', min: '', max: '' }]);
                  }}
                  className="p-1 text-blue-500 hover:text-blue-600"
                  title="添加力学指标"
                >
                  <CirclePlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* 底部控制与查询按钮 */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowMoreConditions(!showMoreConditions)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            {showMoreConditions ? (
              <>
                <span>收起更多条件</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>展开更多条件</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-product-lib-query"
              type="button"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            <button
              id="btn-product-lib-reset"
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium transition cursor-pointer"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 查询结果列表 (对照附件表格) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* 表格操作栏 */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">
              查询结果
            </h3>
            <span className="text-[11px] text-slate-400">
              共 477 条合格物料与钢号档案
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition cursor-pointer"
            >
              导出Excel
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition cursor-pointer"
            >
              对比
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition cursor-pointer"
            >
              新建
            </button>
          </div>
        </div>

        {/* 宽幅表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th rowSpan={2} className="py-2.5 px-3 w-8 border-r border-slate-200">
                  <input type="checkbox" className="rounded" />
                </th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200">序号</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200">牌号</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200">执行标准</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200">产品形态</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200">交货状态</th>
                <th colSpan={2} className="py-1.5 px-2 border-r border-b border-slate-200">厚度 (mm)</th>
                <th colSpan={2} className="py-1.5 px-2 border-r border-b border-slate-200">宽度 (mm)</th>
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200">更新日期</th>
                <th colSpan={2} className="py-1.5 px-2 border-r border-b border-slate-200">C</th>
                <th colSpan={2} className="py-1.5 px-2 border-r border-b border-slate-200">Si</th>
                <th colSpan={2} className="py-1.5 px-2 border-r border-b border-slate-200">Mn</th>
                <th colSpan={2} className="py-1.5 px-2 border-r border-b border-slate-200">P</th>
                <th rowSpan={2} className="py-2.5 px-3 sticky right-0 bg-slate-50 shadow-xs">操作</th>
              </tr>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px]">
                <th className="py-1 px-1.5 border-r border-slate-200">最小值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最大值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最小值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最大值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最小值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最大值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最小值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最大值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最小值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最大值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最小值</th>
                <th className="py-1 px-1.5 border-r border-slate-200">最大值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {libraryData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition">
                  <td className="py-2 px-3 border-r border-slate-100">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="py-2 px-3 font-mono border-r border-slate-100">{item.index}</td>
                  <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-100">{item.grade}</td>
                  <td className="py-2 px-3 font-mono text-slate-600 border-r border-slate-100">{item.standard}</td>
                  <td className="py-2 px-3 border-r border-slate-100">{item.shape}</td>
                  <td className="py-2 px-3 border-r border-slate-100">{item.deliveryState}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.thickMin ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.thickMax ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.widthMin ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.widthMax ?? '-'}</td>
                  <td className="py-2 px-3 font-mono text-slate-500 border-r border-slate-100">{item.updatedAt}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.cMin ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.cMax ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.siMin ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.siMax ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.mnMin ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.mnMax ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.pMin ?? '-'}</td>
                  <td className="py-2 px-2 font-mono border-r border-slate-100">{item.pMax ?? '-'}</td>
                  
                  {/* 操作列 */}
                  <td className="py-2 px-3 sticky right-0 bg-white shadow-xs whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          if (onInitiateSelectionWithGrade) {
                            onInitiateSelectionWithGrade(item.grade);
                          } else {
                            onInitiateSelection();
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        title="以此牌号发起智能选材与替代推荐"
                      >
                        选材
                      </button>
                      <button type="button" className="text-blue-600 hover:text-blue-800">
                        详情
                      </button>
                      <button type="button" className="text-blue-600 hover:text-blue-800">
                        编辑
                      </button>
                      <button type="button" className="text-rose-500 hover:text-rose-700">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 表格底部翻页 (对照附件底部 共 477 条 10条/页) */}
        <div className="p-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div className="text-xs">
            显示第 1 至 7 项，共 477 条产品数据
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono">共 477 条</span>
            <select className="h-7 px-2 bg-white border border-slate-300 rounded text-xs">
              <option>10条/页</option>
              <option>20条/页</option>
              <option>50条/页</option>
            </select>

            <div className="flex items-center gap-1 font-mono text-xs">
              <button className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-not-allowed" disabled>
                &lt;
              </button>
              <button className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold">
                1
              </button>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded">
                2
              </button>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded">
                3
              </button>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded">
                4
              </button>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded">
                5
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded">
                48
              </button>
              <button className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
