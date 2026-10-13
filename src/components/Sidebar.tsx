import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, Droplets, Building2, Bell, ClipboardList,
  Wrench, Truck, Database, FileUp, BarChart3, FileText, MessageSquare,
  Route, Users, ScrollText, Settings, Shield, CheckSquare, FlaskConical,
  Sliders, AreaChart, ChevronLeft, ChevronRight,
  Info, Lightbulb,
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: 'Public',
    items: [
      { to: '/', label: 'Home', icon: Lightbulb },
      { to: '/how-it-works', label: 'How It Works', icon: Route },
      { to: '/about', label: 'About', icon: Info },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/map', label: 'Map View', icon: Map },
      { to: '/sites', label: 'Water Points', icon: Droplets },
      { to: '/areas', label: 'Areas', icon: AreaChart },
      { to: '/institutions', label: 'Institutions', icon: Building2 },
    ],
  },
  {
    label: 'Alerts & Actions',
    items: [
      { to: '/alerts', label: 'Alerts', icon: Bell },
      { to: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
      { to: '/maintenance', label: 'Maintenance', icon: Wrench },
      { to: '/alternative-supply', label: 'Alt. Supply', icon: Truck },
    ],
  },
  {
    label: 'Data',
    items: [
      { to: '/data/entry', label: 'Manual Entry', icon: Database },
      { to: '/data/import', label: 'Import', icon: FileUp },
      { to: '/data/quality', label: 'Data Quality', icon: CheckSquare },
      { to: '/data/lab-results', label: 'Lab Results', icon: FlaskConical },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { to: '/rules', label: 'Rule Thresholds', icon: Sliders },
      { to: '/evaluation', label: 'Evaluation', icon: BarChart3 },
      { to: '/reports', label: 'Reports', icon: FileText },
      { to: '/sms-preview', label: 'SMS Preview', icon: MessageSquare },
      { to: '/pilot-plan', label: 'Pilot Plan', icon: ClipboardList },
    ],
  },
  {
    label: 'Governance',
    items: [
      { to: '/users', label: 'Users', icon: Users, roles: ['Admin'] },
      { to: '/audit-log', label: 'Audit Log', icon: ScrollText, roles: ['Admin'] },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, currentRole } = useStore();
  const location = useLocation();

  const canSee = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(currentRole);
  };

  return (
    <aside
      className={`hidden md:flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      } shrink-0 relative`}
    >
      {/* Collapse button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-cyan-600 shadow-sm z-10 transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navSections.map(section => (
          <div key={section.label} className="mb-4">
            {!sidebarCollapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {section.label}
              </p>
            )}
            {section.items.filter(canSee).map(item => {
              const Icon = item.icon;
              const isActive = item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Icon size={16} className={`shrink-0 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Role indicator at bottom */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">Role: <span className="font-semibold text-slate-700">{currentRole}</span></span>
          </div>
        </div>
      )}
    </aside>
  );
};

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
export const MobileNav: React.FC = () => {
  const location = useLocation();
  const mobileItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/sites', label: 'Sites', icon: Droplets },
    { to: '/settings', label: 'More', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40">
      {mobileItems.map(item => {
        const Icon = item.icon;
        const isActive = item.to === '/dashboard'
          ? location.pathname === '/dashboard'
          : location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive ? 'text-cyan-600' : 'text-slate-500'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
