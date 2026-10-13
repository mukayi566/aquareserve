import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { BarChart3, Info, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export const EvaluationPage: React.FC = () => {
  const { alerts } = useStore();

  const closed = alerts.filter(a => a.status === 'closed');
  const withOutcome = closed.filter(a => a.outcome !== 'pending');

  const correct = withOutcome.filter(a => a.outcome === 'correct').length;
  const falseAlarm = withOutcome.filter(a => a.outcome === 'false_alarm').length;
  const missed = withOutcome.filter(a => a.outcome === 'missed').length;

  const MIN_OUTCOMES = 10;
  const sufficient = withOutcome.length >= MIN_OUTCOMES;

  const falseAlarmRate = sufficient ? Math.round((falseAlarm / withOutcome.length) * 100) : null;
  const detectionRate = sufficient ? Math.round((correct / withOutcome.length) * 100) : null;

  // Resolution time
  const resolutionTimes = closed
    .filter(a => a.closedAt && a.createdAt)
    .map(a => (a.closedAt!.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60));
  const avgResolutionH = resolutionTimes.length > 0
    ? Math.round(resolutionTimes.reduce((s, v) => s + v, 0) / resolutionTimes.length)
    : null;

  // Outcome distribution for the bar chart
  const outcomes = [
    { label: 'Correct', count: correct, color: 'bg-emerald-400', text: 'text-emerald-700' },
    { label: 'False Alarm', count: falseAlarm, color: 'bg-amber-400', text: 'text-amber-700' },
    { label: 'Missed', count: missed, color: 'bg-red-400', text: 'text-red-700' },
  ];
  const total = outcomes.reduce((s, o) => s + o.count, 0);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Evaluation</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Alert accuracy is computed only from logged outcomes of closed alerts. Metrics are shown only when at least {MIN_OUTCOMES} outcomes are available.
      </p>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl px-4 py-3 mb-8">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>
          Accuracy figures are derived solely from confirmed outcomes recorded by operators.
          No metric is displayed without sufficient evidence ({MIN_OUTCOMES}+ outcomes required).
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Closed Alerts', value: closed.length, icon: BarChart3, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'With Outcome', value: withOutcome.length, icon: BarChart3, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Detection Rate', value: sufficient ? `${detectionRate}%` : '—', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'False Alarm Rate', value: sufficient ? `${falseAlarmRate}%` : '—', icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`${k.bg} rounded-2xl p-5 text-center`}>
              <Icon size={18} className={`mx-auto mb-2 ${k.color}`} />
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-slate-500 mt-1">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Outcome distribution */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-4">Outcome Distribution</p>
        {total === 0 ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <AlertTriangle size={15} /> No outcomes logged yet.
          </div>
        ) : (
          <>
            <div className="flex rounded-full overflow-hidden h-5 gap-0.5 mb-4">
              {outcomes.map(o => o.count > 0 && (
                <div key={o.label} style={{ flex: o.count }} className={`${o.color} flex items-center justify-center`}>
                  {o.count > 1 && <span className="text-[10px] text-white font-bold">{o.count}</span>}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6">
              {outcomes.map(o => (
                <div key={o.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-sm ${o.color}`} />
                  <span className="text-sm text-slate-600">{o.label}</span>
                  <span className={`text-sm font-bold ${o.text}`}>{o.count}</span>
                  {total > 0 && <span className="text-xs text-slate-400">({Math.round((o.count / total) * 100)}%)</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Resolution time */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">Average Resolution Time</p>
        {avgResolutionH === null ? (
          <p className="text-slate-400 text-sm">No closed alerts with timestamps available.</p>
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-cyan-600">{avgResolutionH}</span>
            <span className="text-slate-500 text-sm mb-1">hours from alert creation to close</span>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">
          Computed from {resolutionTimes.length} alerts with both creation and close timestamps.
        </p>
      </div>

      {!sufficient && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Insufficient data</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {MIN_OUTCOMES - withOutcome.length} more outcomes needed before accuracy metrics are shown.
              Close alerts and record outcomes to build this dataset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
