import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Wifi, CheckCircle, AlertTriangle, Users, BarChart3, RotateCcw } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Wifi,
    color: 'bg-cyan-500',
    title: 'Collect',
    subtitle: 'Data capture from the field',
    description: 'Operators submit daily readings (flow, level, usage) manually via the data entry form or via CSV import. Automated logger data can also be ingested.',
    detail: 'Each reading is timestamped and attributed to a user. The system accepts metric or imperial units.',
  },
  {
    step: 2,
    icon: CheckCircle,
    color: 'bg-teal-500',
    title: 'Check Quality',
    subtitle: 'Automatic data validation',
    description: 'Every reading is checked against plausibility rules: values outside expected ranges, gaps > 48 hours, and repeated identical values are all flagged.',
    detail: 'Flags: OK · Missing · Stale (>48h) · Implausible. Flagged data still enters the record — it is not deleted — but it lowers confidence in the risk score.',
  },
  {
    step: 3,
    icon: BarChart3,
    color: 'bg-blue-500',
    title: 'Estimate Risk',
    subtitle: 'Rule engine (no machine learning)',
    description: 'Three transparent rules run per site: (1) sustained flow drop vs 14-day baseline, (2) repeated faults within 30 days, (3) demand rising while supply falls.',
    detail: 'Output: {risk: Low | Watch | High, confidence: 0-100%, reasons[]}. Missing or stale data always lowers confidence and shows a data-quality warning.',
  },
  {
    step: 4,
    icon: AlertTriangle,
    color: 'bg-amber-500',
    title: 'Explain Alert',
    subtitle: 'Human-readable reasoning',
    description: 'When a risk threshold is crossed, an alert is generated with: the specific rule triggered, the data window used, confidence level, data freshness, and a recommended next step.',
    detail: 'AquaReserve never issues a water-safety verdict. Every alert says "recommended for human verification".',
  },
  {
    step: 5,
    icon: Users,
    color: 'bg-violet-500',
    title: 'Human Verification',
    subtitle: 'Operator-led field check',
    description: 'An Admin assigns the alert to an Operator. The operator visits the site, records their findings, and marks the alert as Verified. They then log the action taken.',
    detail: 'Workflow: Open → Assigned → Verified → Action Taken → Closed. Every step is timestamped and added to the audit trail.',
  },
  {
    step: 6,
    icon: RotateCcw,
    color: 'bg-emerald-500',
    title: 'Learn from Outcomes',
    subtitle: 'Evaluation and improvement',
    description: 'Each closed alert records an outcome: Correct, False Alarm, or Missed. The evaluation page aggregates these to show false-alarm rate, response time, and lead time.',
    detail: 'If fewer than 10 outcomes exist, the system shows "Insufficient outcomes to evaluate" rather than misleading statistics.',
  },
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Breadcrumbs />

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">How AquaReserve Works</h1>
        <p className="text-slate-500 text-lg">A transparent, 6-step process from data collection to outcome learning.</p>
      </div>

      {/* Stepper */}
      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-cyan-300 to-emerald-300" />

        <div className="space-y-8">
          {steps.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative flex gap-6">
                {/* Step circle */}
                <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center shrink-0 shadow-lg text-white relative z-10`}>
                  <Icon size={24} />
                </div>

                {/* Content card */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step {s.step}</span>
                      <h2 className="text-xl font-bold text-slate-800">{s.title}</h2>
                      <p className="text-sm font-medium text-slate-500">{s.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-3 leading-relaxed">{s.description}</p>
                  <div className="bg-slate-50 rounded-xl px-4 py-3">
                    <p className="text-xs text-slate-500 leading-relaxed">📎 {s.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key principle */}
      <div className="mt-12 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-2xl p-8 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-3">The Core Principle</h3>
        <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
          AquaReserve is <strong>decision support</strong>, not a decision-maker. Every output is a
          recommendation for a qualified water professional to verify in the field.
          The system is designed to be understood, questioned, and improved.
        </p>
      </div>
    </div>
  );
};
