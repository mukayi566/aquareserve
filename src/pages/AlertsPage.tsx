import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Filter, MapPin, Clock, User, ArrowRight } from 'lucide-react';
import type { RiskLevel, AlertStatus } from '../types';

const STATUS_OPTIONS: Array<AlertStatus | 'all'> = ['all', 'open', 'assigned', 'verified', 'actioned', 'closed'];
const RISK_OPTIONS: Array<RiskLevel | 'all'> = ['all', 'High', 'Watch', 'Low'];
const AREAS = ['all', 'kanyama', 'chawama', 'matero', 'chilanga', 'chelston', 'ngombe', 'kalingalinga', 'misisi'];

const statusColors: Record<AlertStatus, string> = {
  open:     'bg-slate-100 text-slate-700',
  assigned: 'bg-blue-100 text-blue-700',
  verified: 'bg-violet-100 text-violet-700',
  actioned: 'bg-teal-100 text-teal-700',
  closed:   'bg-emerald-100 text-emerald-700',
};

export const AlertsPage: React.FC = () => {
  const { alerts, sites, users } = useStore();
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const filtered = alerts
    .filter(a => riskFilter === 'all' || a.riskLevel === riskFilter)
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => {
      if (areaFilter === 'all') return true;
      const site = sites.find(s => s.id === a.siteId);
      return site?.area === areaFilter;
    })
    .sort((a, b) => {
      const rOrder = { High: 0, Watch: 1, Low: 2 };
      const rDiff = rOrder[a.riskLevel] - rOrder[b.riskLevel];
      if (rDiff !== 0) return rDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Alerts</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Filter size={15} className="text-slate-400" />

        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value as RiskLevel | 'all')}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {RISK_OPTIONS.map(r => <option key={r} value={r}>{r === 'all' ? 'All Risk Levels' : r}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as AlertStatus | 'all')}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        <select
          value={areaFilter}
          onChange={e => setAreaFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {AREAS.map(a => <option key={a} value={a}>{a === 'all' ? 'All Areas' : a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
        </select>

        <span className="text-xs text-slate-400">{filtered.length} alerts</span>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const site = sites.find(s => s.id === alert.siteId);
          const assignee = users.find(u => u.id === alert.assignedTo);
          return (
            <Link
              key={alert.id}
              to={`/alerts/${alert.id}`}
              className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 hover:border-cyan-200 hover:shadow-sm transition-all group"
            >
              <div className="shrink-0">
                <RiskBadge risk={alert.riskLevel} size="md" pulse={alert.riskLevel === 'High'} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{alert.title}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={11} />
                    {site?.name ?? alert.siteId}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} />
                    {format(alert.createdAt, 'dd MMM yyyy')}
                  </span>
                  {assignee && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <User size={11} />
                      {assignee.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[alert.status]}`}>
                  {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </span>
                <span className="text-xs text-slate-400">{alert.confidence}%</span>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">No alerts match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
