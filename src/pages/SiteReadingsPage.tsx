import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { DataQualityFlag } from '../types';

const flagColors: Record<DataQualityFlag, string> = {
  ok: 'bg-emerald-100 text-emerald-700',
  missing: 'bg-red-100 text-red-700',
  stale: 'bg-amber-100 text-amber-700',
  implausible: 'bg-orange-100 text-orange-700',
};

const flagIcons: Record<DataQualityFlag, typeof CheckCircle> = {
  ok: CheckCircle,
  missing: AlertTriangle,
  stale: Clock,
  implausible: AlertTriangle,
};

export const SiteReadingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sites, readings } = useStore();
  const [flagFilter, setFlagFilter] = useState<DataQualityFlag | 'all'>('all');
  const [page, setPage] = useState(0);
  const PER_PAGE = 25;

  const site = sites.find(s => s.id === id);
  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="font-semibold">Site not found</p>
        <button onClick={() => navigate('/sites')} className="mt-2 text-cyan-600 text-sm hover:underline">Back to Sites</button>
      </div>
    );
  }

  const siteReadings = readings
    .filter(r => r.siteId === id)
    .filter(r => flagFilter === 'all' || r.qualityFlag === flagFilter)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalPages = Math.ceil(siteReadings.length / PER_PAGE);
  const pageReadings = siteReadings.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const flagCounts = readings
    .filter(r => r.siteId === id)
    .reduce((acc, r) => { acc[r.qualityFlag] = (acc[r.qualityFlag] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Reading History – {site.name}</h1>
      <p className="text-slate-500 text-sm mb-6">90-day reading archive with data quality flags</p>

      {/* Quality summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(['ok', 'missing', 'stale', 'implausible'] as DataQualityFlag[]).map(flag => {
          const Icon = flagIcons[flag];
          return (
            <button
              key={flag}
              onClick={() => setFlagFilter(f => f === flag ? 'all' : flag)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                flagFilter === flag ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <Icon size={14} className={flagColors[flag].split(' ')[1]} />
              <span className="capitalize">{flag}</span>
              <span className="ml-auto text-slate-400 text-xs">{flagCounts[flag] ?? 0}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Flow (L/h)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Level (m)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Usage (L/h)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Quality</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {pageReadings.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-slate-50 ${r.qualityFlag !== 'ok' ? 'bg-amber-50/40' : i % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                >
                  <td className="px-4 py-2.5 font-medium text-slate-700">{format(r.date, 'dd MMM yyyy')}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.flowLPH?.toLocaleString() ?? '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.levelM ?? '—'}</td>
                  <td className="px-4 py-2.5 text-slate-600">{r.usageLPH?.toLocaleString() ?? '—'}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${flagColors[r.qualityFlag]}`}>
                      {r.qualityFlag}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-400 hidden md:table-cell">{r.qualityNote ?? '—'}</td>
                </tr>
              ))}
              {pageReadings.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No readings match filter</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, siteReadings.length)} of {siteReadings.length}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
