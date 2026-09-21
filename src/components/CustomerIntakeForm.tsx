import React, { useState } from 'react';
import { 
  CustomerRequirement, 
  CustomerMechanicalReq 
} from '../types';
import { 
  Search, 
  RotateCcw, 
  Sliders, 
  FlaskConical, 
  Gauge, 
  Layers, 
  CircleMinus,
  CirclePlus
} from 'lucide-react';

interface Props {
  requirement: CustomerRequirement;
  onChange: (req: CustomerRequirement) => void;
  onMatch: () => void;
  isMatching: boolean;
}

const ALL_CHEM_ELEMENTS = [
  'C', 'Si', 'Mn', 'P', 'S', 'Cr', 'Ni', 'Mo', 'V', 'Ti',
  'Cu', 'Al', 'Nb', 'B', 'W', 'N', 'Co', 'Zr', 'Ta', 'Sn', 'Pb', 'Sb', 'Bi', 'O', 'H'
];

export const CustomerIntakeForm: React.FC<Props> = ({
  requirement,
  onChange,
  onMatch,
  isMatching,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'chem' | 'mech' | 'weights'>('basic');
  const [showAdvancedWeights, setShowAdvancedWeights] = useState(false);

  const handleBasicChange = (field: keyof CustomerRequirement, value: any) => {
    onChange({
      ...requirement,
      [field]: value,
    });
  };

  const handleMechChange = (field: keyof CustomerMechanicalReq, value: any) => {
    onChange({
      ...requirement,
      mechanical: {
        ...requirement.mechanical,
        [field]: value === '' ? undefined : Number(value) || value,
      },
    });
  };

  const handleChemicalChange = (element: string, minOrMax: 'min' | 'max', valueStr: string) => {
    const val = valueStr === '' ? undefined : parseFloat(valueStr);
    const curr = requirement.chemical[element] || {};
    const updated = {
      ...requirement.chemical,
      [element]: {
        ...curr,
        [minOrMax]: val,
      },
    };
    onChange({
      ...requirement,
      chemical: updated,
    });
  };

  const handleRemoveElement = (element: string) => {
    const updated = { ...requirement.chemical };
    delete updated[element];
    onChange({
      ...requirement,
      chemical: updated,
    });
  };

  const handleElementKeyChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const currentChem = { ...requirement.chemical };
    const existingVal = currentChem[oldKey] || {};
    const newChem: Record<string, { min?: number; max?: number }> = {};
    for (const k of Object.keys(currentChem)) {
      if (k === oldKey) {
        newChem[newKey] = existingVal;
      } else {
        newChem[k] = currentChem[k];
      }
    }
    onChange({
      ...requirement,
      chemical: newChem,
    });
  };

  const handleAddNewElement = () => {
    const existingKeys = Object.keys(requirement.chemical);
    const nextAvailable = ALL_CHEM_ELEMENTS.find(el => !existingKeys.includes(el)) || `El${existingKeys.length + 1}`;
    onChange({
      ...requirement,
      chemical: {
        ...requirement.chemical,
        [nextAvailable]: {},
      },
    });
  };

  const handleWeightInputChange = (key: keyof CustomerRequirement['weights'], rawVal: string) => {
    if (rawVal === '') {
      onChange({
        ...requirement,
        weights: {
          ...requirement.weights,
          [key]: 0,
        },
      });
      return;
    }
    let val = parseInt(rawVal, 10);
    if (isNaN(val)) val = 0;
    val = Math.max(0, Math.min(100, val));

    onChange({
      ...requirement,
      weights: {
        ...requirement.weights,
        [key]: val,
      },
    });
  };

  const balanceWeightsTo100 = () => {
    const s = requirement.weights.specWeight ?? 0;
    const c = requirement.weights.chemWeight ?? 0;
    const m = requirement.weights.mechWeight ?? 0;
    const sum = s + c + m;
    if (sum === 0) {
      onChange({ ...requirement, weights: { specWeight: 10, chemWeight: 45, mechWeight: 45 } });
      return;
    }
    const newS = Math.round((s / sum) * 100);
    const newC = Math.round((c / sum) * 100);
    const newM = Math.max(0, 100 - newS - newC);
    onChange({ ...requirement, weights: { specWeight: newS, chemWeight: newC, mechWeight: newM } });
  };

  const handleReset = () => {
    onChange({
      targetGrade: '',
      standard: '',
      deliveryState: '',
      application: '',
      thicknessMin: undefined,
      thicknessMax: undefined,
      widthMin: undefined,
      widthMax: undefined,
      chemical: {
        C: {},
        Si: {},
        Mn: {},
        P: { max: 0.035 },
        S: { max: 0.035 },
        Cr: {},
        Ni: {},
        Mo: {},
      },
      mechanical: {},
      weights: {
        specWeight: 10,
        chemWeight: 45,
        mechWeight: 45,
      },
    });
  };

  // 统计已填入参数数量
  const chemCount = Object.keys(requirement.chemical).filter(
    k => requirement.chemical[k]?.min !== undefined || requirement.chemical[k]?.max !== undefined
  ).length;

  const mechCount = [
    requirement.mechanical.yieldMin,
    requirement.mechanical.tensileMin,
    requirement.mechanical.elongationMin,
    requirement.mechanical.impactMin,
    requirement.mechanical.hardnessMin,
  ].filter(v => v !== undefined).length;

  return (
    <div id="customer-intake-form" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 表头区 */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              客户选材需求录入
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-reset-form"
              onClick={handleReset}
              type="button"
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition flex items-center gap-1"
              title="重置表单"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 模块切换选项卡 */}
      <div className="flex border-b border-slate-200 bg-slate-100/50 text-xs font-medium overflow-x-auto">
        <button
          id="tab-basic"
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`flex-1 min-w-[100px] py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === 'basic'
              ? 'border-blue-600 text-blue-700 font-semibold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. 基础牌号与标准</span>
          {requirement.targetGrade && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          id="tab-chem"
          type="button"
          onClick={() => setActiveTab('chem')}
          className={`flex-1 min-w-[100px] py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === 'chem'
              ? 'border-blue-600 text-blue-700 font-semibold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>2. 化学成分 ({chemCount})</span>
          {chemCount > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
              {chemCount}
            </span>
          )}
        </button>

        <button
          id="tab-mech"
          type="button"
          onClick={() => setActiveTab('mech')}
          className={`flex-1 min-w-[100px] py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === 'mech'
              ? 'border-blue-600 text-blue-700 font-semibold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>3. 力学性能 ({mechCount})</span>
          {mechCount > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
              {mechCount}
            </span>
          )}
        </button>

        <button
          id="tab-weights"
          type="button"
          onClick={() => setActiveTab('weights')}
          className={`py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1 ${
            activeTab === 'weights'
              ? 'border-blue-600 text-blue-700 font-semibold bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="算法匹配权重微调"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>匹配权重</span>
        </button>
      </div>

      {/* 选项卡内容容器 */}
      <div className="p-4 sm:p-5">
        {/* Tab 1: 基础牌号与标准 */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  目标牌号 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-target-grade"
                  type="text"
                  value={requirement.targetGrade}
                  onChange={(e) => handleBasicChange('targetGrade', e.target.value)}
                  placeholder="例如：42CrMo4, 316L, Q355B, H13..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  执行标准
                </label>
                <input
                  id="input-standard"
                  type="text"
                  value={requirement.standard}
                  onChange={(e) => handleBasicChange('standard', e.target.value)}
                  placeholder="例如：EN 10083-3, ASTM A240, GB/T 1591..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  交货状态
                </label>
                <select
                  id="select-delivery-state"
                  value={requirement.deliveryState}
                  onChange={(e) => handleBasicChange('deliveryState', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- 请选择或任意状态 --</option>
                  <option value="调质态 (+QT)">调质态 (+QT / 淬火+高温回火)</option>
                  <option value="固溶退火态 (+AT)">固溶酸洗态 (+AT / 不锈钢/双相钢)</option>
                  <option value="正火或正火轧制 (+N)">正火态 (+N / 低温冲击高强钢)</option>
                  <option value="球化退火态">球化退火态 (模具钢/轴承钢)</option>
                  <option value="T6 (固溶+人工时效)">T6 (固溶+完全时效 / 铝合金)</option>
                  <option value="热轧态 (+AR)">热轧态 (+AR / 需后续二次加工)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  产品形态
                </label>
                <input
                  id="input-application"
                  type="text"
                  value={requirement.application}
                  onChange={(e) => handleBasicChange('application', e.target.value)}
                  placeholder="例如：锻件、圆棒、特厚板、热轧板卷..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 规格尺寸要求：厚度与宽度 (支持输入最小/最大值) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 厚度规格 */}
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    厚度规格
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        id="input-thickness-min"
                        type="number"
                        step="any"
                        value={requirement.thicknessMin ?? ''}
                        onChange={(e) => handleBasicChange('thicknessMin', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                        placeholder="最小值 Min"
                        className="w-full pl-2.5 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="absolute right-2 top-2 text-[11px] text-slate-400 pointer-events-none">mm</span>
                    </div>
                    <div className="relative">
                      <input
                        id="input-thickness-max"
                        type="number"
                        step="any"
                        value={requirement.thicknessMax ?? ''}
                        onChange={(e) => handleBasicChange('thicknessMax', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                        placeholder="最大值 Max"
                        className="w-full pl-2.5 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="absolute right-2 top-2 text-[11px] text-slate-400 pointer-events-none">mm</span>
                    </div>
                  </div>
                </div>

                {/* 宽度规格 */}
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    宽度规格 (mm)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        id="input-width-min"
                        type="number"
                        step="any"
                        value={requirement.widthMin ?? ''}
                        onChange={(e) => handleBasicChange('widthMin', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                        placeholder="最小值 Min"
                        className="w-full pl-2.5 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="absolute right-2 top-2 text-[11px] text-slate-400 pointer-events-none">mm</span>
                    </div>
                    <div className="relative">
                      <input
                        id="input-width-max"
                        type="number"
                        step="any"
                        value={requirement.widthMax ?? ''}
                        onChange={(e) => handleBasicChange('widthMax', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                        placeholder="最大值 Max"
                        className="w-full pl-2.5 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <span className="absolute right-2 top-2 text-[11px] text-slate-400 pointer-events-none">mm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 化学成分要求 (wt%) */}
        {activeTab === 'chem' && (
          <div className="p-1">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
              {Object.keys(requirement.chemical).map((element) => {
                const range = requirement.chemical[element] || {};
                const availableElements = Array.from(new Set([...ALL_CHEM_ELEMENTS, ...Object.keys(requirement.chemical)]));
                return (
                  <div
                    key={element}
                    className="flex items-center gap-1.5 shrink-0"
                  >
                    <select
                      value={element}
                      onChange={(e) => handleElementKeyChange(element, e.target.value)}
                      className="h-8.5 w-20 px-2.5 bg-white border border-slate-300 rounded-md text-xs font-mono font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      {availableElements.map((el) => (
                        <option
                          key={el}
                          value={el}
                          disabled={el !== element && !!requirement.chemical[el]}
                        >
                          {el}
                        </option>
                      ))}
                    </select>

                    <input
                      id={`chem-${element}-min`}
                      type="number"
                      step="any"
                      placeholder="最小值"
                      value={range.min ?? ''}
                      onChange={(e) => handleChemicalChange(element, 'min', e.target.value)}
                      className="h-8.5 w-20 sm:w-24 px-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-center placeholder:text-slate-400"
                    />

                    <span className="text-slate-400 text-xs select-none px-0.5">~</span>

                    <input
                      id={`chem-${element}-max`}
                      type="number"
                      step="any"
                      placeholder="最大值"
                      value={range.max ?? ''}
                      onChange={(e) => handleChemicalChange(element, 'max', e.target.value)}
                      className="h-8.5 w-20 sm:w-24 px-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-center placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveElement(element)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      title={`删除 ${element} 元素`}
                    >
                      <CircleMinus className="w-5 h-5 stroke-[1.5]" />
                    </button>
                  </div>
                );
              })}

              {/* 附件格式的圆形加号添加按钮 */}
              <button
                id="btn-add-element-circle"
                type="button"
                onClick={handleAddNewElement}
                className="p-1 text-blue-500 hover:text-blue-600 transition cursor-pointer shrink-0"
                title="添加元素"
              >
                <CirclePlus className="w-6 h-6 stroke-[1.75]" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: 规定力学性能 */}
        {activeTab === 'mech' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 屈服强度 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    规定非比例延伸强度 Rp0.2 / ReH
                  </label>
                  <span className="text-[11px] text-blue-600 font-mono font-medium">MPa</span>
                </div>
                <input
                  id="input-yield-min"
                  type="number"
                  value={requirement.mechanical.yieldMin ?? ''}
                  onChange={(e) => handleMechChange('yieldMin', e.target.value)}
                  placeholder="例如：750 (屈服强度下限)"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* 抗拉强度 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    抗拉强度 Rm
                  </label>
                  <span className="text-[11px] text-blue-600 font-mono font-medium">MPa</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="input-tensile-min"
                    type="number"
                    value={requirement.mechanical.tensileMin ?? ''}
                    onChange={(e) => handleMechChange('tensileMin', e.target.value)}
                    placeholder="Min 例如：980"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <span className="text-slate-400 text-xs">~</span>
                  <input
                    id="input-tensile-max"
                    type="number"
                    value={requirement.mechanical.tensileMax ?? ''}
                    onChange={(e) => handleMechChange('tensileMax', e.target.value)}
                    placeholder="Max (可选)"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* 断后伸长率 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    断后伸长率 A
                  </label>
                  <span className="text-[11px] text-blue-600 font-mono font-medium">%</span>
                </div>
                <input
                  id="input-elongation-min"
                  type="number"
                  value={requirement.mechanical.elongationMin ?? ''}
                  onChange={(e) => handleMechChange('elongationMin', e.target.value)}
                  placeholder="例如：12 (塑性延展下限)"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* 冲击吸收功 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    夏比V型冲击吸收功 KV2
                  </label>
                  <span className="text-[11px] text-blue-600 font-mono font-medium">J</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="input-impact-min"
                    type="number"
                    value={requirement.mechanical.impactMin ?? ''}
                    onChange={(e) => handleMechChange('impactMin', e.target.value)}
                    placeholder="能量(J) 如：47"
                    className="w-2/3 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <select
                    id="select-impact-temp"
                    value={requirement.mechanical.impactTemp || '20°C'}
                    onChange={(e) => handleMechChange('impactTemp', e.target.value)}
                    className="w-1/3 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="20°C">20°C (常温)</option>
                    <option value="0°C">0°C</option>
                    <option value="-20°C">-20°C (低温)</option>
                    <option value="-40°C">-40°C (极寒)</option>
                    <option value="-196°C">-196°C (深冷)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 硬度范围 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  硬度规范要求 (可选)
                </label>
                <div className="flex items-center gap-2">
                  {(['HBW', 'HRC', 'HV'] as const).map((scale) => (
                    <label key={scale} className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="hardnessScale"
                        checked={(requirement.mechanical.hardnessScale || 'HBW') === scale}
                        onChange={() => handleMechChange('hardnessScale', scale)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{scale}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="input-hardness-min"
                  type="number"
                  value={requirement.mechanical.hardnessMin ?? ''}
                  onChange={(e) => handleMechChange('hardnessMin', e.target.value)}
                  placeholder="下限 如 280"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
                <span className="text-slate-400 text-xs">~</span>
                <input
                  id="input-hardness-max"
                  type="number"
                  value={requirement.mechanical.hardnessMax ?? ''}
                  onChange={(e) => handleMechChange('hardnessMax', e.target.value)}
                  placeholder="上限 如 320"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 算法匹配权重微调 */}
        {activeTab === 'weights' && (
          <div className="space-y-4">
            {/* 总权重限制状态条 */}
            <div className={`p-3 rounded-lg border flex flex-wrap items-center justify-between gap-2 text-xs ${
              ((requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0)) === 100
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">总权重设置：</span>
                <span className="font-mono font-bold text-sm">
                  {(requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0)}%
                </span>
                <span className="text-slate-500 font-medium">/ 总权重限制为 100%</span>
                {((requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0)) === 100 ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                    符合要求
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                    {((requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0)) > 100 
                      ? `超出 ${((requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0)) - 100}%` 
                      : `未满，还需 ${100 - ((requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0))}%`}
                  </span>
                )}
              </div>

              {((requirement.weights.specWeight ?? 0) + (requirement.weights.chemWeight ?? 0) + (requirement.weights.mechWeight ?? 0)) !== 100 && (
                <button
                  type="button"
                  onClick={balanceWeightsTo100}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-300 rounded-md transition shadow-2xs cursor-pointer"
                >
                  一键平衡至100%
                </button>
              )}
            </div>

            {/* 直接输入各维度权重数值 */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              {/* 1. 产品规格 */}
              <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    规格尺寸匹配权重
                  </div>
                  <div className="text-[11px] text-slate-400">
                    厚度、圆棒直径、板材宽度尺寸覆盖范围
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    id="input-weight-spec"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={requirement.weights.specWeight ?? 0}
                    onChange={(e) => handleWeightInputChange('specWeight', e.target.value)}
                    className="w-20 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-right font-bold text-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono">%</span>
                </div>
              </div>

              {/* 2. 化学成分 */}
              <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    化学成分吻合权重
                  </div>
                  <div className="text-[11px] text-slate-400">
                    主要与微量合金元素公差带重合比对
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    id="input-weight-chem"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={requirement.weights.chemWeight ?? 0}
                    onChange={(e) => handleWeightInputChange('chemWeight', e.target.value)}
                    className="w-20 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-right font-bold text-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono">%</span>
                </div>
              </div>

              {/* 3. 力学性能 */}
              <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    力学性能达标权重
                  </div>
                  <div className="text-[11px] text-slate-400">
                    屈服抗拉强度、延伸率、低温冲击功与硬度
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    id="input-weight-mech"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={requirement.weights.mechWeight ?? 0}
                    onChange={(e) => handleWeightInputChange('mechWeight', e.target.value)}
                    className="w-20 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-right font-bold text-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono">%</span>
                </div>
              </div>
            </div>

            {/* 预设权重快捷选项 */}
            <div className="flex flex-wrap gap-2 text-xs items-center">
              <span className="text-slate-500">预设方案：</span>
              <button
                type="button"
                onClick={() => onChange({ ...requirement, weights: { specWeight: 10, chemWeight: 45, mechWeight: 45 } })}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                默认 (10% / 45% / 45%)
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...requirement, weights: { specWeight: 10, chemWeight: 60, mechWeight: 30 } })}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                成分优先 (10% / 60% / 30%)
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...requirement, weights: { specWeight: 10, chemWeight: 30, mechWeight: 60 } })}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                力学优先 (10% / 30% / 60%)
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...requirement, weights: { specWeight: 30, chemWeight: 35, mechWeight: 35 } })}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
              >
                规格优先 (30% / 35% / 35%)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 底部匹配执行操作栏 */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
        <button
          id="btn-run-match"
          type="button"
          onClick={onMatch}
          disabled={isMatching}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
        >
          <Search className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
          <span>开始智能比对并推荐相近产品</span>
        </button>
      </div>
    </div>
  );
};
