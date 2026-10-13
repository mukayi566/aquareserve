import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, Search, ChevronDown, User, Shield, Eye,
  CheckCheck, ExternalLink,
} from 'lucide-react';
import { useStore, selectUnreadNotifications } from '../store/useStore';
import { format } from 'date-fns';

const roleConfig = {
  Admin:    { icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
  Operator: { icon: User,   color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
  Viewer:   { icon: Eye,    color: 'text-slate-600',  bg: 'bg-slate-50'  },
};

export const TopBar: React.FC = () => {
  const { currentRole, setRole, notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const unread = useStore(selectUnreadNotifications);
  const [roleOpen, setRoleOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const navigate = useNavigate();

  const RoleIcon = roleConfig[currentRole].icon;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/sites?q=${encodeURIComponent(searchQ)}`);
    setSearchQ('');
  };

  const notifTypeColor: Record<string, string> = {
    alert: 'bg-red-500',
    maintenance: 'bg-amber-500',
    data: 'bg-blue-500',
    system: 'bg-slate-500',
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 z-30 sticky top-0 shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mr-4 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
          <span className="text-white font-bold text-xs">AQ</span>
        </div>
        <span className="font-bold text-slate-800 hidden sm:block">AquaReserve</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search water points…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => { setRoleOpen(o => !o); setBellOpen(false); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium transition-colors hover:bg-slate-50 ${roleConfig[currentRole].color}`}
          >
            <RoleIcon size={15} />
            <span className="hidden sm:block">{currentRole}</span>
            <ChevronDown size={14} />
          </button>
          {roleOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
              {(['Admin', 'Operator', 'Viewer'] as const).map(role => {
                const { icon: Icon, color, bg } = roleConfig[role];
                return (
                  <button
                    key={role}
                    onClick={() => { setRole(role); setRoleOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:${bg} ${color} transition-colors ${currentRole === role ? 'font-semibold' : ''}`}
                  >
                    <Icon size={15} />
                    {role}
                    {currentRole === role && <span className="ml-auto text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => { setBellOpen(o => !o); setRoleOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            id="notification-bell"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6">No notifications</p>
                )}
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-slate-50 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? 'bg-cyan-50/40' : ''}`}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkTo) { navigate(n.linkTo); setBellOpen(false); }
                    }}
                  >
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notifTypeColor[n.type]}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-slate-800 ${!n.read ? 'font-semibold' : ''}`}>{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{format(n.timestamp, 'dd MMM, HH:mm')}</p>
                    </div>
                    {n.linkTo && <ExternalLink size={13} className="text-slate-300 mt-1 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
