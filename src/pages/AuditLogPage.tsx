import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ScrollText, Search, Filter } from 'lucide-react';

const entityColors: Record<string, string> = {
  alert: 'bg-red-100 text-red-700',
  maintenance: 'bg-amber-100 text-amber-700',
  reading: 'bg-cyan-100 text-cyan-700',
  threshold: 'bg-violet-100 text-violet-700',
  user: 'bg-blue-100 text-blue-700',
  labresult: 'bg-emerald-100 text-emerald-700',
};

export const AuditLogPage: React.FC = () => {
  const { auditLog, users, currentRole } = useStore();
  const [q, setQ] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const entityTypes = ['all', ...Array.from(new Set(auditLog.map(e => e.entityType.toLowerCase())))];

  const filtered = auditLog
    .filter(e => entityFilter === 'all' || e.entityType.toLowerCase() === entityFilter)
    .filter(e => {
      const ql = q.toLowerCase();
      return (
        e.action.toLowerCase().includes(ql) ||
        e.details.toLowerCase().includes(ql) ||
        e.entityId.toLowerCase().includes(ql)
      );
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 100);

  if (currentRole !== 'Admin') {
    return (
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <Breadcrumbs />
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Audit Log</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <ScrollText size={32} className="mx-auto text-amber-400 mb-3" />
          <p className="font-semibold text-amber-700">Admin access required</p>
          <p className="text-sm text-amber-600 mt-1">Switch to Admin role to view the audit log.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <ScrollText size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Audit Log</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Immutable record of all system actions. Showing last 100 entries.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search actions, details…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <Filter size={15} className="text-slate-400 shrink-0" />
        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 capitalize"
        >
          {entityTypes.map(t => <option key={t} value={t} className="capitalize">{t === 'all' ? 'All Types' : t}</option>)}
        </select>
        <span className="text-xs text-slate-400">{filtered.length} entries</span>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Timestamp</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">User</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const user = users.find(u => u.id === entry.userId);
                const colorKey = entry.entityType.toLowerCase();
                const colorClass = entityColors[colorKey] ?? 'bg-slate-100 text-slate-600';
                return (
                  <tr key={entry.id} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-4 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                      {format(entry.timestamp, 'dd MMM, HH:mm')}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 text-xs hidden sm:table-cell">
                      {user?.name ?? entry.userId}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${colorClass}`}>
                        {entry.entityType}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium text-xs">{entry.action}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs hidden md:table-cell max-w-xs truncate">
                      {entry.details}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No audit entries match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
