import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { Users, Shield, User, Eye, Search, CheckCircle, XCircle } from 'lucide-react';
import type { UserRole } from '../types';

const roleConfig: Record<UserRole, { color: string; bg: string; icon: typeof Shield }> = {
  Admin:    { color: 'text-purple-700', bg: 'bg-purple-100', icon: Shield },
  Operator: { color: 'text-cyan-700',   bg: 'bg-cyan-100',   icon: User },
  Viewer:   { color: 'text-slate-600',  bg: 'bg-slate-100',  icon: Eye },
};

export const UsersPage: React.FC = () => {
  const { users, currentRole } = useStore();
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const canEdit = currentRole === 'Admin';

  const filtered = users
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .filter(u => {
      const ql = q.toLowerCase();
      return u.name.toLowerCase().includes(ql) || u.email.toLowerCase().includes(ql) || (u.area ?? '').toLowerCase().includes(ql);
    });

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-cyan-600" />
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
        </div>
        {canEdit && (
          <button className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors opacity-60 cursor-not-allowed" disabled>
            + Invite User
          </button>
        )}
      </div>
      <p className="text-slate-500 text-sm mb-6">
        System users and their roles. Role changes take effect immediately on next login.
        {!canEdit && ' Admin access required to modify users.'}
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['Admin', 'Operator', 'Viewer'] as UserRole[]).map(role => {
          const cfg = roleConfig[role];
          const Icon = cfg.icon;
          const count = users.filter(u => u.role === role).length;
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(f => f === role ? 'all' : role)}
              className={`rounded-2xl border-2 p-4 text-center transition-all ${
                roleFilter === role ? `border-current ${cfg.bg}` : 'border-slate-100 bg-white hover:bg-slate-50'
              }`}
            >
              <Icon size={18} className={`mx-auto mb-1 ${cfg.color}`} />
              <div className={`text-2xl font-bold ${cfg.color}`}>{count}</div>
              <div className="text-xs text-slate-500 mt-0.5">{role}s</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email or area…"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* User list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Area</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const cfg = roleConfig[u.role];
                const Icon = cfg.icon;
                return (
                  <tr key={u.id} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <Icon size={14} className={cfg.color} />
                        </div>
                        <span className="font-medium text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 capitalize hidden md:table-cell">{u.area ?? '—'}</td>
                    <td className="px-4 py-3">
                      {u.active
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={12} />Active</span>
                        : <span className="flex items-center gap-1 text-xs text-slate-400"><XCircle size={12} />Inactive</span>
                      }
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">No users match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
