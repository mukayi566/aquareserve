import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { Sliders, Info } from 'lucide-react';

const categoryColors: Record<string, string> = {
  flow: 'bg-cyan-50 border-cyan-200',
  level: 'bg-blue-50 border-blue-200',
  fault: 'bg-red-50 border-red-200',
  demand: 'bg-violet-50 border-violet-200',
  data: 'bg-amber-50 border-amber-200',
};

const categoryText: Record<string, string> = {
  flow: 'text-cyan-700',
  level: 'text-blue-700',
  fault: 'text-red-700',
  demand: 'text-violet-700',
  data: 'text-amber-700',
};

export const RulesPage: React.FC = () => {
  const { thresholds, updateThreshold, currentRole, recomputeRisks } = useStore();
  const canEdit = currentRole === 'Admin';

  const categories = Array.from(new Set(thresholds.map(t => t.category)));

  const handleChange = (id: string, value: number) => {
    updateThreshold(id, value);
    recomputeRisks();
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <Sliders size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Rule Thresholds</h1>
      </div>
      <p className="text-slate-500 text-sm mb-2">
        Configure the thresholds that drive risk scoring. Changes trigger immediate re-evaluation of all site risks.
      </p>
      {!canEdit && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3 mb-6">
          <Info size={14} /> Thresholds are read-only for your current role. Switch to Admin to edit.
        </div>
      )}
      {canEdit && (
        <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs rounded-xl px-4 py-3 mb-6">
          <Info size={14} /> Adjusting a threshold immediately recomputes risk for all water points.
        </div>
      )}

      <div className="space-y-8">
        {categories.map(cat => (
          <div key={cat}>
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 capitalize ${categoryText[cat] ?? 'text-slate-600'}`}>
              {cat} thresholds
            </h2>
            <div className="space-y-3">
              {thresholds.filter(t => t.category === cat).map(t => (
                <div key={t.id} className={`rounded-2xl border p-5 ${categoryColors[cat] ?? 'bg-white border-slate-100'}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-slate-700 w-20 text-right">
                        {t.value} <span className="text-xs font-normal text-slate-400">{t.unit}</span>
                      </span>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="mt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-10">{t.min}</span>
                        <input
                          type="range"
                          min={t.min}
                          max={t.max}
                          step={(t.max - t.min) / 100}
                          value={t.value}
                          onChange={e => handleChange(t.id, parseFloat(e.target.value))}
                          className="flex-1 accent-cyan-600"
                        />
                        <span className="text-xs text-slate-400 w-10 text-right">{t.max}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-400">min</span>
                        <span className="text-xs font-semibold text-cyan-700">{t.value.toFixed(1)} {t.unit}</span>
                        <span className="text-xs text-slate-400">max</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
