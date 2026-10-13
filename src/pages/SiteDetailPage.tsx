import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { format, differenceInHours } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  AlertTriangle, Clock, Users, Droplets, MapPin,
  CheckCircle, ArrowRight, Info, Building2, Wrench,
} from 'lucide-react';
import type { SiteType } from '../types';

const NOW = new Date('2026-10-13T17:00:00Z');

const typeLabels: Record<SiteType, string> = {
  borehole: 'Borehole', kiosk: 'Kiosk', school_tap: 'School Tap',
  clinic_supply: 'Clinic Supply', reservoir: 'Reservoir',
};

export const SiteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sites, riskMap, readings, faults, alerts, institutions, maintenance } = useStore();

  const site = sites.find(s => s.id === id);
  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Droplets size={40} className="mb-3 opacity-30" />
        <p className="font-semibold text-slate-600">Site not found</p>
        <button onClick={() => navigate('/sites')} className="mt-4 text-cyan-600 hover:underline text-sm">
          Back to Sites
        </button>
      </div>
    );
  }

  const assessment = riskMap[site.id];
  const siteReadings = readings
    .filter(r => r.siteId === site.id && r.qualityFlag === 'ok')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-30);

  const chartData = siteReadings.map(r => ({
    date: format(r.date, 'dd MMM'),
    Flow: r.flowLPH ?? null,
    Level: r.levelM !== null ? Math.round(r.levelM * 100) : null,
    Usage: r.usageLPH ?? null,
  }));

  const siteFaults = faults.filter(f => f.siteId === site.id).sort((a, b) => b.date.getTime() - a.date.getTime());
  const siteAlerts = alerts.filter(a => a.siteId === site.id && a.status !== 'closed');
  const siteInstitutions = institutions.filter(i => site.institutionIds.includes(i.id));
  const siteMaintenance = maintenance.filter(m => m.siteId === site.id);
  const ageH = differenceInHours(NOW, site.lastUpdated);
  const isStale = ageH > 48;

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <Droplets size={20} className="text-cyan-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{site.name}</h1>
            {assessment && <RiskBadge risk={assessment.risk} size="lg" pulse={assessment.risk === 'High'} />}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><MapPin size={13} />{site.area}</span>
            <span>{typeLabels[site.type]}</span>
            <span className="flex items-center gap-1"><Users size={13} />{site.servedPopulation.toLocaleString()} people</span>
            <span className={`flex items-center gap-1 ${isStale ? 'text-red-500 font-medium' : ''}`}>
              <Clock size={13} />
              Data last updated: {format(site.lastUpdated, 'dd MMM yyyy, HH:mm')}
              {isStale && ' ⚠'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link to={`/sites/${id}/readings`} className="px-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            Full Readings
          </Link>
        </div>
      </div>

      {/* Risk assessment card */}
      {assessment && (
        <div className={`rounded-2xl border p-6 mb-6 ${
          assessment.risk === 'High' ? 'bg-red-50 border-red-200' :
          assessment.risk === 'Watch' ? 'bg-amber-50 border-amber-200' :
          'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Risk Assessment</h2>
              <p className="text-xs text-slate-500">Computed {format(assessment.computedAt, 'dd MMM yyyy, HH:mm')} · {assessment.confidence}% confidence</p>
            </div>
            <RiskBadge risk={assessment.risk} size="lg" pulse />
          </div>

          {/* Confidence bar */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-slate-500 w-24">Confidence</span>
            <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  assessment.confidence > 70 ? 'bg-emerald-500' :
                  assessment.confidence > 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${assessment.confidence}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700">{assessment.confidence}%</span>
          </div>

          {/* Reasons */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Reasons</p>
            <ul className="space-y-1">
              {assessment.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Info size={13} className="mt-0.5 shrink-0 text-slate-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {assessment.warnings.length > 0 && (
            <div className="bg-amber-100/60 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">⚠ Data quality warnings (affect confidence)</p>
              {assessment.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-700">{w}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Open alerts for this site */}
      {siteAlerts.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            Open Alerts ({siteAlerts.length})
          </h2>
          <div className="space-y-2">
            {siteAlerts.map(a => (
              <Link key={a.id} to={`/alerts/${a.id}`} className="flex items-center gap-3 bg-white border border-red-100 rounded-xl p-4 hover:border-red-200 transition-colors">
                <RiskBadge risk={a.riskLevel} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.dataFreshnessNote}</p>
                </div>
                <ArrowRight size={14} className="text-slate-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Flow & Usage – Last 30 days</h2>
          <p className="text-xs text-slate-400 mb-4">Litres per hour · OK-quality readings only</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Flow" stroke="#0ea5e9" dot={false} strokeWidth={2} connectNulls={false} />
              <Line type="monotone" dataKey="Usage" stroke="#f59e0b" dot={false} strokeWidth={2} connectNulls={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Water Level – Last 30 days</h2>
          <p className="text-xs text-slate-400 mb-4">Level in cm · OK-quality readings only</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="Level" stroke="#14b8a6" dot={false} strokeWidth={2} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fault history */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Wrench size={15} className="text-slate-400" />
            Fault History ({siteFaults.length})
          </h2>
          {siteFaults.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">No faults recorded</div>
          ) : (
            <div className="space-y-3">
              {siteFaults.slice(0, 5).map(f => (
                <div key={f.id} className="flex items-start gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${f.resolvedDate ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="font-medium text-slate-700">{f.faultType}</p>
                    <p className="text-xs text-slate-500">{f.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {format(f.date, 'dd MMM yyyy')}
                      {f.resolvedDate && ` → Resolved ${format(f.resolvedDate, 'dd MMM')}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Institutions + maintenance */}
        <div className="space-y-4">
          {siteInstitutions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Building2 size={15} className="text-slate-400" />
                Dependent Institutions
              </h2>
              {siteInstitutions.map(inst => (
                <Link key={inst.id} to="/institutions" className="flex items-center gap-2 py-2 hover:text-cyan-700 transition-colors">
                  <CheckCircle size={13} className="text-teal-400" />
                  <span className="text-sm text-slate-700">{inst.name}</span>
                  <span className="text-xs text-slate-400 ml-auto capitalize">{inst.type}</span>
                </Link>
              ))}
            </div>
          )}

          {siteMaintenance.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Wrench size={15} className="text-slate-400" />
                Maintenance
              </h2>
              {siteMaintenance.slice(0, 3).map(m => (
                <div key={m.id} className="flex items-start gap-2 py-2 border-b border-slate-50">
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    m.status === 'overdue' ? 'bg-red-100 text-red-700' :
                    m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    m.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{m.status}</div>
                  <div>
                    <p className="text-sm text-slate-700">{m.title}</p>
                    <p className="text-xs text-slate-400">{format(m.scheduledDate, 'dd MMM yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
