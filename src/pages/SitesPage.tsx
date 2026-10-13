import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { differenceInHours } from 'date-fns';
import {
  Search, ArrowUpDown, Droplets, MapPin, Users, Clock, ArrowRight,
} from 'lucide-react';
import type { SiteType } from '../types';

const NOW = new Date('2026-10-13T17:00:00Z');

const typeLabels: Record<SiteType, string> = {
  borehole: 'Borehole',
  kiosk: 'Kiosk',
  school_tap: 'School Tap',
  clinic_supply: 'Clinic Supply',
  reservoir: 'Reservoir',
};

type SortKey = 'name' | 'area' | 'risk' | 'population' | 'freshness';

export const SitesPage: React.FC = () => {
  const { sites, riskMap } = useStore();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [sortKey, setSortKey] = useState<SortKey>('risk');
  const [sortAsc, setSortAsc] = useState(true);
  const [areaFilter, setAreaFilter] = useState('all');

  const areas = ['all', ...Array.from(new Set(sites.map(s => s.area)))];

  const riskOrder = { High: 0, Watch: 1, Low: 2 };

  const filtered = sites
    .filter(s => {
      const ql = q.toLowerCase();
      if (areaFilter !== 'all' && s.area !== areaFilter) return false;
      return (
        s.name.toLowerCase().includes(ql) ||
        s.area.toLowerCase().includes(ql) ||
        typeLabels[s.type].toLowerCase().includes(ql)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'area') cmp = a.area.localeCompare(b.area);
      else if (sortKey === 'risk') cmp = riskOrder[riskMap[a.id]?.risk ?? 'Low'] - riskOrder[riskMap[b.id]?.risk ?? 'Low'];
      else if (sortKey === 'population') cmp = a.servedPopulation - b.servedPopulation;
      else if (sortKey === 'freshness') cmp = differenceInHours(NOW, a.lastUpdated) - differenceInHours(NOW, b.lastUpdated);
      return sortAsc ? cmp : -cmp;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortHeader: React.FC<{ k: SortKey; label: string }> = ({ k, label }) => (
    <button
      onClick={() => toggleSort(k)}
      className="flex items-center gap-1 font-semibold text-slate-600 hover:text-cyan-700 transition-colors"
    >
      {label}
      <ArrowUpDown size={13} className={sortKey === k ? 'text-cyan-600' : 'text-slate-300'} />
    </button>
  );

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Water Points</h1>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-56">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, area or type…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <select
          value={areaFilter}
          onChange={e => setAreaFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {areas.map(a => (
            <option key={a} value={a}>{a === 'all' ? 'All Areas' : a.charAt(0).toUpperCase() + a.slice(1)}</option>
          ))}
        </select>
        <div className="text-sm text-slate-400 flex items-center">{filtered.length} sites</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3"><SortHeader k="name" label="Site Name" /></th>
                <th className="text-left px-4 py-3"><SortHeader k="area" label="Area" /></th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3"><SortHeader k="risk" label="Risk" /></th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Confidence</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell"><SortHeader k="population" label="Population" /></th>
                <th className="text-left px-4 py-3 hidden lg:table-cell"><SortHeader k="freshness" label="Data Age" /></th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((site, i) => {
                const risk = riskMap[site.id];
                const ageH = differenceInHours(NOW, site.lastUpdated);
                const isStale = ageH > 48;
                return (
                  <tr
                    key={site.id}
                    className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Droplets size={14} className="text-cyan-400 shrink-0" />
                        <span className="font-medium text-slate-800">{site.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin size={12} />
                        {site.area.charAt(0).toUpperCase() + site.area.slice(1)}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-500">{typeLabels[site.type]}</td>
                    <td className="px-4 py-3">
                      <RiskBadge risk={risk?.risk ?? 'Low'} size="sm" pulse={risk?.risk === 'High'} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${(risk?.confidence ?? 0) > 70 ? 'bg-emerald-400' :
                                (risk?.confidence ?? 0) > 40 ? 'bg-amber-400' : 'bg-red-400'
                              }`}
                            style={{ width: `${risk?.confidence ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{risk?.confidence ?? 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Users size={12} />
                        {site.servedPopulation.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className={`flex items-center gap-1 text-xs ${isStale ? 'text-red-500' : 'text-slate-500'}`}>
                        <Clock size={11} />
                        {ageH < 1 ? '<1h' : `${ageH}h`} ago
                        {isStale && ' ⚠ stale'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/sites/${site.id}`}
                        className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium text-xs"
                      >
                        Detail <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No sites match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
