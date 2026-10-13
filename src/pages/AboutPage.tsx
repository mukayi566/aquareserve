import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CheckCircle, XCircle, Target, Globe, AlertTriangle } from 'lucide-react';

const limitations = [
  { ok: false, text: 'Does NOT assess water safety or potability — this requires sampling and qualified laboratory analysis.' },
  { ok: false, text: 'Does NOT predict the future — it flags current patterns that historically precede problems.' },
  { ok: false, text: 'Does NOT replace field verification — every High or Watch alert must be confirmed on-site.' },
  { ok: false, text: 'Does NOT show accuracy figures — these can only be computed from a sufficient body of verified outcomes.' },
  { ok: false, text: 'Does NOT give a shortage countdown unless volume, inflow and usage data all exist.' },
];

const goals = [
  'Flag potential shortages or infrastructure faults earlier than manual monitoring allows',
  'Give operators a structured workflow: alert → verify → act → record outcome',
  'Provide a shared, auditable record that supports accountability',
  'Improve over time as outcomes are recorded and thresholds are refined',
  'Be honest about confidence, data quality, and limitations at every step',
];

const honestChecklist = [
  { label: 'Confidence shown on every risk assessment', done: true },
  { label: 'Data freshness shown on every site and alert', done: true },
  { label: 'Missing/stale/implausible data lowers confidence (never ignored)', done: true },
  { label: 'False alarms tracked alongside successes', done: true },
  { label: 'Evaluation suppressed until ≥10 verified outcomes', done: true },
  { label: 'No water-safety or potability verdict anywhere in the system', done: true },
  { label: 'All rules documented and editable by Admin', done: true },
  { label: 'Audit trail on every action', done: true },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Breadcrumbs />

      <h1 className="text-3xl font-bold text-slate-800 mb-2">About AquaReserve</h1>
      <p className="text-slate-500 mb-10">Proposed concept for the NWASCO ICT Water Sector Forum 2026, Lusaka, Zambia.</p>

      {/* Background */}
      <section className="mb-10 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={20} className="text-cyan-600" />
          <h2 className="text-xl font-bold text-slate-800">Project Background</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          Lusaka's peri-urban communities depend on a network of boreholes, kiosks, school taps,
          and clinic supplies operated by LWSC and community water committees. When a pump fails or
          supply falls, households often unable to store more than a day's supply — bear the
          immediate impact.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          AquaReserve proposes to use existing monitoring data (flow meters, operator logs, fault
          reports) to identify patterns that precede shortages. The goal is to shift from reactive
          crisis management to proactive, evidence-based intervention.
        </p>
        <p className="text-slate-600 leading-relaxed">
          This prototype uses entirely synthetic data and is presented for discussion and validation
          by NWASCO, LWSC, and water sector stakeholders. It has not been deployed with real data.
        </p>
      </section>

      {/* Goals */}
      <section className="mb-10 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <Target size={20} className="text-teal-600" />
          <h2 className="text-xl font-bold text-slate-800">Goals</h2>
        </div>
        <ul className="space-y-3">
          {goals.map(goal => (
            <li key={goal} className="flex items-start gap-3">
              <CheckCircle size={16} className="text-teal-500 mt-0.5 shrink-0" />
              <span className="text-slate-600 text-sm leading-relaxed">{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Critical limitations box */}
      <section className="mb-10 bg-red-50 border border-red-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={20} className="text-red-600" />
          <h2 className="text-xl font-bold text-red-800">Critical Limitations</h2>
        </div>
        <div className="bg-red-100/60 rounded-xl px-5 py-4 mb-5">
          <p className="text-red-800 font-semibold text-sm">
            AquaReserve does not assess water safety or potability.
            Determining whether water is safe to drink requires physical and chemical sampling
            conducted by qualified laboratories following recognised standards (e.g., WHO, ZABS).
            No output from this system should be used to make potability decisions.
          </p>
        </div>
        <ul className="space-y-3">
          {limitations.map(l => (
            <li key={l.text} className="flex items-start gap-3">
              <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <span className="text-red-700 text-sm leading-relaxed">{l.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Honesty checklist */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={20} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-800">Honesty Checklist</h2>
        </div>
        <p className="text-slate-500 text-sm mb-5">Features built into the system to ensure responsible use:</p>
        <div className="space-y-2.5">
          {honestChecklist.map(item => (
            <div key={item.label} className="flex items-center gap-3 py-2 border-b border-slate-50">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                item.done ? 'bg-emerald-100' : 'bg-slate-100'
              }`}>
                <CheckCircle size={12} className={item.done ? 'text-emerald-600' : 'text-slate-400'} />
              </div>
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
