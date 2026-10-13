import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  map: 'Map View',
  sites: 'Water Points',
  readings: 'Readings',
  areas: 'Areas',
  institutions: 'Institutions',
  alerts: 'Alerts',
  'my-tasks': 'My Tasks',
  maintenance: 'Maintenance',
  'alternative-supply': 'Alternative Supply',
  data: 'Data',
  entry: 'Manual Entry',
  import: 'Import',
  quality: 'Data Quality',
  'lab-results': 'Lab Results',
  rules: 'Rule Thresholds',
  evaluation: 'Evaluation',
  reports: 'Reports',
  'sms-preview': 'SMS Preview',
  'pilot-plan': 'Pilot Plan',
  users: 'Users',
  'audit-log': 'Audit Log',
  settings: 'Settings',
  'how-it-works': 'How It Works',
  about: 'About',
};

export const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) return null;

  const crumbs = parts.map((part, i) => {
    const path = '/' + parts.slice(0, i + 1).join('/');
    const label = routeLabels[part] ?? (part.startsWith('site-') || part.startsWith('alert-')
      ? `#${part.split('-').pop()}`
      : part);
    return { path, label };
  });

  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-slate-500 mb-4">
      <Link to="/" className="hover:text-cyan-600 transition-colors">
        <Home size={14} />
      </Link>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight size={14} className="text-slate-300" />
          {i === crumbs.length - 1 ? (
            <span className="text-slate-700 font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-cyan-600 transition-colors">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
