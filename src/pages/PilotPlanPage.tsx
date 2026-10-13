import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ClipboardList, CheckCircle, Clock, Pause } from 'lucide-react';
import type { PilotStage } from '../types';

const statusConfig: Record<PilotStage['status'], { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle },
  active:    { label: 'Active',    color: 'text-cyan-700',    bg: 'bg-cyan-100',    icon: Clock },
  planned:   { label: 'Planned',   color: 'text-slate-600',   bg: 'bg-slate-100',   icon: Clock },
  on_hold:   { label: 'On Hold',   color: 'text-amber-700',   bg: 'bg-amber-100',   icon: Pause },
};

export const PilotPlanPage: React.FC = () => {
  const { pilotStages } = useStore();
  const sorted = [...pilotStages].sort((a, b) => a.order - b.order);

  const completed = sorted.filter(s => s.status === 'completed').length;
  const progressPct = Math.round((completed / Math.max(sorted.length, 1)) * 100);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <ClipboardList size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Pilot Plan</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        AquaReserve Lusaka Pilot — staged rollout plan with deliverables and status tracking.
      </p>

      {/* Progress header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-slate-800">Overall Progress</p>
            <p className="text-sm text-slate-500 mt-0.5">{completed} of {sorted.length} stages complete</p>
          </div>
          <span className="text-3xl font-bold text-cyan-600">{progressPct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Stages timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />

        <div className="space-y-6">
          {sorted.map((stage, i) => {
            const cfg = statusConfig[stage.status];
            const Icon = cfg.icon;
            return (
              <div key={stage.id} className="relative flex gap-6">
                {/* Circle */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon size={16} className={cfg.color} />
                </div>

                {/* Content */}
                <div className={`flex-1 bg-white rounded-2xl border shadow-sm p-5 ${stage.status === 'active' ? 'border-cyan-300 ring-1 ring-cyan-200' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Stage {stage.order}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800 mt-0.5">{stage.name}</h3>
                    </div>
                    <div className="text-xs text-slate-400 text-right shrink-0">
                      <div>{format(stage.startDate, 'dd MMM yyyy')}</div>
                      <div>→ {format(stage.endDate, 'dd MMM yyyy')}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{stage.description}</p>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Deliverables</p>
                    <ul className="space-y-1">
                      {stage.deliverables.map((d, di) => (
                        <li key={di} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${stage.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
