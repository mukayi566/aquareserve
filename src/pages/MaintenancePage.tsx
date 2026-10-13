import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Wrench, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import type { MaintenanceStatus, MaintenanceType } from '../types';

const statusColors: Record<MaintenanceStatus, string> = {
  scheduled:   'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed:   'bg-emerald-100 text-emerald-700',
  overdue:     'bg-red-100 text-red-700',
};

const statusIcons: Record<MaintenanceStatus, typeof CheckCircle> = {
  scheduled: Calendar,
  in_progress: Wrench,
  completed: CheckCircle,
  overdue: AlertTriangle,
};

export const MaintenancePage: React.FC = () => {
  const { maintenance, sites, users, currentRole, updateMaintenance } = useStore();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MaintenanceType | 'all'>('all');

  const filtered = maintenance
    .filter(m => statusFilter === 'all' || m.status === statusFilter)
    .filter(m => typeFilter === 'all' || m.type === typeFilter)
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  const overdueCount = maintenance.filter(m => m.status === 'overdue').length;
  const upcomingCount = maintenance.filter(m => m.status === 'scheduled').length;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-slate-500 text-sm mt-1">Planned and reactive maintenance schedule</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {([
          { label: 'Overdue', count: overdueCount, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'In Progress', count: maintenance.filter(m => m.status === 'in_progress').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Scheduled', count: upcomingCount, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', count: maintenance.filter(m => m.status === 'completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]).map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as MaintenanceStatus | 'all')}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">All Statuses</option>
          {(['overdue', 'in_progress', 'scheduled', 'completed'] as MaintenanceStatus[]).map(s => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as MaintenanceType | 'all')}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="all">Planned & Reactive</option>
          <option value="planned">Planned only</option>
          <option value="reactive">Reactive only</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map(m => {
          const site = sites.find(s => s.id === m.siteId);
          const assignee = users.find(u => u.id === m.assignedTo);
          const Icon = statusIcons[m.status];

          return (
            <div key={m.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${m.status === 'overdue' ? 'border-red-200' : 'border-slate-100'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${statusColors[m.status].replace('text-', 'bg-').replace('700', '50').replace('-100', '-50')}`}>
                  <Icon size={18} className={statusColors[m.status].split(' ')[1]} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[m.status]}`}>
                      {m.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{m.type}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">{m.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{m.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                    <span>Site: {site?.name ?? m.siteId}</span>
                    <span>Assigned to: {assignee?.name ?? m.assignedTo}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      Scheduled: {format(m.scheduledDate, 'dd MMM yyyy')}
                    </span>
                    {m.completedDate && <span>Completed: {format(m.completedDate, 'dd MMM yyyy')}</span>}
                    {m.cost && <span>Est. cost: ZMW {m.cost.toLocaleString()}</span>}
                  </div>
                </div>

                {currentRole !== 'Viewer' && m.status !== 'completed' && (
                  <button
                    onClick={() => updateMaintenance(m.id, {
                      status: m.status === 'scheduled' || m.status === 'overdue' ? 'in_progress' : 'completed',
                      completedDate: m.status === 'in_progress' ? new Date() : undefined,
                    })}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-xs font-medium hover:bg-cyan-100 transition-colors"
                  >
                    {m.status === 'in_progress' ? 'Mark Complete' : 'Start'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">No maintenance records match filter</div>
        )}
      </div>
    </div>
  );
};
