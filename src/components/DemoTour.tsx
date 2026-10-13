import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { X, ArrowRight, LayoutDashboard, Bell, CheckSquare, BarChart3 } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Dashboard Overview',
    description: 'The dashboard shows real-time KPI cards, recent alerts, and a risk trend chart for all 25 monitored water points.',
    icon: LayoutDashboard,
    route: '/dashboard',
    highlight: 'KPI cards show High/Watch/Low risk counts and open alerts.',
  },
  {
    title: 'Alert Detail & Workflow',
    description: 'Each alert explains why it was raised, shows confidence level, data freshness, and walks you through the Assign → Verify → Action → Outcome workflow.',
    icon: Bell,
    route: '/alerts/alert-01',
    highlight: 'See the full audit trail and recommended next step.',
  },
  {
    title: 'Operator Tasks',
    description: 'Operators see only their assigned alerts and a verification checklist. Role-based access means viewers cannot take actions.',
    icon: CheckSquare,
    route: '/my-tasks',
    highlight: 'Try switching roles in the top bar to see different views.',
  },
  {
    title: 'Evaluation & Honesty',
    description: 'The evaluation page shows false-alarm rate, missed events, and response time computed only from logged outcomes. Under 10 outcomes it shows "Insufficient data".',
    icon: BarChart3,
    route: '/evaluation',
    highlight: 'No accuracy figure is ever shown without sufficient evidence.',
  },
];

export const DemoTour: React.FC = () => {
  const { demoTourActive, demoTourStep, nextDemoStep, endDemoTour } = useStore();
  const navigate = useNavigate();

  if (!demoTourActive) return null;

  const step = TOUR_STEPS[demoTourStep];
  const isLast = demoTourStep === TOUR_STEPS.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    navigate(step.route);
    if (isLast) {
      endDemoTour();
    } else {
      nextDemoStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[9998] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        {/* Close */}
        <button
          onClick={endDemoTour}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === demoTourStep ? 'w-6 bg-cyan-500' : i < demoTourStep ? 'w-3 bg-cyan-300' : 'w-3 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step number */}
        <p className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-2">
          Step {demoTourStep + 1} of {TOUR_STEPS.length}
        </p>

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
            <Icon size={20} className="text-cyan-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">{step.title}</h3>
        </div>

        <p className="text-slate-600 text-sm mb-3">{step.description}</p>

        <div className="bg-cyan-50 rounded-lg px-4 py-2.5 mb-5">
          <p className="text-xs text-cyan-700 font-medium">💡 {step.highlight}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={endDemoTour}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Skip tour
          </button>
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
          >
            {isLast ? 'Finish' : 'Next'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
