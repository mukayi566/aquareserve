import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, AlertTriangle, MapPin, BarChart3, Shield, Users,
  ArrowRight, CheckCircle, Zap, Globe, Play,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const capabilities = [
  { icon: Droplets, title: 'Continuous Monitoring', desc: '25 water points tracked with daily flow, level, and usage readings across Lusaka peri-urban areas.' },
  { icon: AlertTriangle, title: 'Transparent Risk Flags', desc: 'Rule-based engine (no ML) with clear reasons: flow drops, repeated faults, demand-supply gaps.' },
  { icon: MapPin, title: 'Spatial Overview', desc: 'Interactive map with colour-coded risk markers, area filters, and direct links to site details.' },
  { icon: BarChart3, title: 'Trend Analysis', desc: '90-day historical charts showing flow, level, and usage per site with data quality flags.' },
  { icon: Shield, title: 'Workflow & Accountability', desc: 'Alert → Assign → Verify → Action → Outcome with full audit trail and timestamped records.' },
  { icon: Users, title: 'Role-Based Access', desc: 'Admins govern, Operators act on assigned alerts, Viewers have read-only visibility.' },
];

const honesty = [
  'Does not assess water safety or potability',
  'Does not replace field verification by water professionals',
  'Shows confidence level and uncertainty on every risk flag',
  'Never shows a shortage countdown without volume and usage data',
  'Evaluation shows false alarms, not just successes',
];

export const LandingPage: React.FC = () => {
  const { startDemoTour } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-sm font-medium mb-8">
            <Zap size={14} />
            NWASCO ICT Water Sector Forum 2026 · Zambia
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-100 bg-clip-text text-transparent">
              AquaReserve
            </span>
          </h1>

          {/* Pitch */}
          <p className="text-xl text-cyan-100 mb-4 max-w-2xl mx-auto font-light">
            AI-assisted early-warning platform for water security in Zambia's peri-urban areas.
          </p>

          {/* Hook */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 mb-10 max-w-2xl mx-auto">
            <p className="text-lg text-white font-medium italic leading-relaxed">
              "What if we could identify a water shortage <em>before</em> a community runs out —
              giving operators time to act, not react?"
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-white transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:-translate-y-0.5"
            >
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => { navigate('/dashboard'); setTimeout(startDemoTour, 300); }}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-white transition-all"
              id="demo-tour-button"
            >
              <Play size={16} />
              Guided Demo Tour
            </button>
            <Link
              to="/how-it-works"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-white transition-all"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-white/5 backdrop-blur-sm border-y border-white/10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Key Capabilities</h2>
          <p className="text-cyan-300 text-center text-sm mb-12">Decision support not a replacement for water professionals</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map(cap => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 group">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                    <Icon size={20} className="text-cyan-300" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{cap.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Honesty section */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium mb-6">
            <Shield size={12} />
            Transparency First
          </div>
          <h2 className="text-2xl font-bold mb-8">What AquaReserve does NOT do</h2>
          <div className="space-y-3">
            {honesty.map(item => (
              <div key={item} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-left">
                <CheckCircle size={16} className="text-amber-300 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gradient-to-r from-cyan-600/30 to-teal-600/30 border-y border-white/10 px-6 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '25', label: 'Water Points' },
            { value: '8', label: 'Areas Covered' },
            { value: '90', label: 'Days of History' },
            { value: '0', label: 'ML Models' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-cyan-200 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Forum footer */}
      <section className="px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
          <Globe size={16} />
          Proposed concept for NWASCO ICT Water Sector Forum 2026, Lusaka, Zambia
        </div>
        <div className="mt-3 text-xs text-slate-500">
          All data is synthetic. This prototype requires validation with real-world water sector data.
        </div>
      </section>
    </div>
  );
};
