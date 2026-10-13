import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format, differenceInHours } from 'date-fns';
import { CheckSquare, AlertTriangle, Clock, Filter } from 'lucide-react';
import type { DataQualityFlag } from '../types';

const NOW = new Date('2026-10-13T17:00:00Z');

const flagColors: Record<DataQualityFlag, string> = {
  ok: 'bg-emerald-100 text-emerald-700',
  missing: 'bg-slate-100 text-slate-600',
  stale: 'bg-amber-100 text-amber-700',
  implausible: 'bg-red-100 text-red-700',
};

const flagIcons: Record<DataQualityFlag, typeof AlertTriangle> = {
  ok: CheckSquare,
  missing: Clock,
  stale: Clock,
  implausible: AlertTriangle,
};

export const DataQualityPage: React.FC = () => {
  const { readings, sites } = useStore();
  const [flagFilter, setFlagFilter] = useState<DataQualityFlag | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const areas = ['all', ...Array.from(new Set(sites.map(s => s.area)))];

  const flagCounts: Record<DataQualityFlag, number> = { ok: 0, missing: 0, stale: 0, implausible: 0 };
  readings.forEach(r => flagCounts[r.qualityFlag]++);

  const filtered = readings
    .filter(r => flagFilter === 'all' || r.qualityFlag === flagFilter)
    .filter(r => {
      if (areaFilter === 'all') return true;
      const site = sites.find(s => s.id === r.siteId);
      return site?.area === areaFilter;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 100);

  const staleCount = sites.filter(s => differenceInHours(NOW, s.lastUpdated) > 48).length;
  const missingCount = flagCounts.missing + flagCounts.implausible;
  const overallPct = Math.round((flagCounts.ok / Math.max(readings.length, 1)) * 100);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <CheckSquare size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Data Quality</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Review data completeness, staleness, and implausible values across all water points.
      </p>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Overall OK', value: `${overallPct}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Stale Sites', value: staleCount, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Missing / Bad', value: missingCount, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Readings', value: readings.length, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-xs text-slate-500 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Quality breakdown bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
        <p className="text-sm font-semibold text-slate-700 mb-3">Reading Quality Distribution</p>
        <div className="flex rounded-full overflow-hidden h-4 gap-0.5">
          {(Object.entries(flagCounts) as [DataQualityFlag, number][]).map(([flag, count]) => (
            count > 0 && (
              <div
                key={flag}
                style={{ flex: count }}
                className={`${flagColors[flag].split(' ')[0]} transition-all`}
                title={`${flag}: ${count}`}
              />
            )
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {(Object.entries(flagCounts) as [DataQualityFlag, number][]).map(([flag, count]) => {
            const Icon = flagIcons[flag];
            return (
              <button
                key={flag}
                onClick={() => setFlagFilter(f => f === flag ? 'all' : flag)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-opacity ${flagFilter !== 'all' && flagFilter !== flag ? 'opacity-40' : ''}`}
              >
                <span className={`w-3 h-3 rounded-sm ${flagColors[flag].split(' ')[0]}`} />
                <Icon size={12} className={flagColors[flag].split(' ')[1]} />
                <span className="capitalize text-slate-600">{flag}</span>
                <span className="text-slate-400">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters + table */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Filter size={15} className="text-slate-400" />
        <select
          value={flagFilter}
          onChange={e => setFlagFilter(e.target.value as DataQualityFlag | 'all')}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">All Flags</option>
          {(['ok', 'missing', 'stale', 'implausible'] as DataQualityFlag[]).map(f => (
            <option key={f} value={f} className="capitalize">{f}</option>
          ))}
        </select>
        <select
          value={areaFilter}
          onChange={e => setAreaFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {areas.map(a => <option key={a} value={a}>{a === 'all' ? 'All Areas' : a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} readings</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Site</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Area</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Flag</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Note</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Age</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const site = sites.find(s => s.id === r.siteId);
                const ageH = differenceInHours(NOW, r.date);
                return (
                  <tr key={r.id} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{site?.name ?? r.siteId}</td>
                    <td className="px-4 py-2.5 text-slate-500 capitalize hidden sm:table-cell">{site?.area ?? '—'}</td>
                    <td className="px-4 py-2.5 text-slate-500">{format(r.date, 'dd MMM yy')}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${flagColors[r.qualityFlag]}`}>
                        {r.qualityFlag}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs hidden md:table-cell">{r.qualityNote ?? '—'}</td>
                    <td className="px-4 py-2.5 text-xs hidden lg:table-cell">
                      <span className={ageH > 48 ? 'text-red-500' : 'text-slate-400'}>
                        {ageH < 1 ? '<1h' : `${ageH}h`}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No readings match filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
