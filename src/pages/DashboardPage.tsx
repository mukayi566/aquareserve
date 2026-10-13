import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { format, subDays, differenceInHours } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  AlertTriangle, CheckCircle, TrendingDown, Clock, MapPin, ArrowRight,
  Droplets, Activity, Play,
} from 'lucide-react';

const NOW = new Date('2026-10-13T17:00:00Z');

export const DashboardPage: React.FC = () => {
  const { alerts, sites, riskMap, startDemoTour } = useStore();

  // KPI counts
  const highCount = Object.values(riskMap).filter(r => r.risk === 'High').length;
  const watchCount = Object.values(riskMap).filter(r => r.risk === 'Watch').length;
  const lowCount = Object.values(riskMap).filter(r => r.risk === 'Low').length;
  const openAlerts = alerts.filter(a => a.status !== 'closed').length;

  const closedAlerts = alerts.filter(a => a.status === 'closed' && a.closedAt && a.createdAt);
  const avgResponseH = closedAlerts.length > 0
    ? Math.round(closedAlerts.reduce((sum, a) =>
        sum + differenceInHours(a.closedAt!, a.createdAt), 0) / closedAlerts.length)
    : null;

  // Risk trend chart – last 14 days
  const trendData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = subDays(NOW, 13 - i);
      const dateStr = format(date, 'dd MMM');
      const dateStart = new Date(date); dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date); dateEnd.setHours(23, 59, 59, 999);

      // Count alerts active on that day
      const dayAlerts = alerts.filter(a =>
        a.createdAt <= dateEnd && (a.closedAt == null || a.closedAt >= dateStart)
      );
      return {
        date: dateStr,
        High: dayAlerts.filter(a => a.riskLevel === 'High').length,
        Watch: dayAlerts.filter(a => a.riskLevel === 'Watch').length,
        Low: dayAlerts.filter(a => a.riskLevel === 'Low').length,
      };
    });
  }, [alerts]);

  // Recent alerts (last 5 open)
  const recentAlerts = [...alerts]
    .filter(a => a.status !== 'closed')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Sites with issues
  const problematicSites = sites
    .filter(s => riskMap[s.id]?.risk !== 'Low')
    .sort((a, b) => {
      const order = { High: 0, Watch: 1, Low: 2 };
      return order[riskMap[a.id]?.risk ?? 'Low'] - order[riskMap[b.id]?.risk ?? 'Low'];
    })
    .slice(0, 5);

  const kpis = [
    {
      label: 'High Risk Sites',
      value: highCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      subtext: 'Require immediate verification',
    },
    {
      label: 'Watch Sites',
      value: watchCount,
      icon: TrendingDown,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      subtext: 'Monitor closely',
    },
    {
      label: 'Low Risk Sites',
      value: lowCount,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      subtext: 'Operating normally',
    },
    {
      label: 'Open Alerts',
      value: openAlerts,
      icon: Activity,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      subtext: 'Awaiting action or verification',
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <Breadcrumbs />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Water security monitoring {format(NOW, 'EEEE, d MMMM yyyy')}
          </p>
        </div>
        <button
          onClick={startDemoTour}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
          id="demo-tour-start"
        >
          <Play size={14} />
          Demo Tour
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`bg-white rounded-2xl border ${kpi.border} shadow-sm p-5 hover:shadow-md transition-shadow`}>
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={kpi.color} />
              </div>
              <div className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
              <div className="text-sm font-semibold text-slate-700">{kpi.label}</div>
              <div className="text-xs text-slate-400 mt-1">{kpi.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Avg response time pill */}
      {avgResponseH !== null && (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600">
          <Clock size={15} className="text-slate-400" />
          Avg. alert response time: <span className="font-bold text-slate-800">{avgResponseH}h</span>
          <span className="text-xs text-slate-400">(from {closedAlerts.length} closed alerts)</span>
        </div>
      )}

      {/* Chart + Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Risk Alert Trend – Last 14 Days</h2>
          <p className="text-xs text-slate-400 mb-4">Count of active alerts by risk level per day (synthetic demo data)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="High" stackId="1" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
              <Area type="monotone" dataKey="Watch" stackId="1" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
              <Area type="monotone" dataKey="Low" stackId="1" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sites with issues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Sites Requiring Attention</h2>
          <div className="space-y-3">
            {problematicSites.map(site => (
              <Link
                key={site.id}
                to={`/sites/${site.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  riskMap[site.id]?.risk === 'High' ? 'bg-red-50' : 'bg-amber-50'
                }`}>
                  <Droplets size={15} className={
                    riskMap[site.id]?.risk === 'High' ? 'text-red-500' : 'text-amber-500'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate group-hover:text-cyan-700">{site.name}</p>
                  <p className="text-xs text-slate-400">{site.area}</p>
                </div>
                <RiskBadge risk={riskMap[site.id]?.risk ?? 'Low'} size="sm" />
              </Link>
            ))}
          </div>
          <Link to="/sites" className="mt-4 flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium">
            View all sites <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Recent Open Alerts</h2>
          <Link to="/alerts" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentAlerts.map(alert => {
            const site = sites.find(s => s.id === alert.siteId);
            return (
              <Link
                key={alert.id}
                to={`/alerts/${alert.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all group"
              >
                <RiskBadge risk={alert.riskLevel} pulse />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{alert.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={11} className="text-slate-400" />
                    <span className="text-xs text-slate-400">{site?.name ?? alert.siteId}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{format(alert.createdAt, 'dd MMM')}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 capitalize">{alert.status}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {Math.round(alert.confidence)}% confidence
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mini map link */}
      <div className="mt-6">
        <Link
          to="/map"
          className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-semibold hover:from-cyan-500 hover:to-teal-500 transition-all shadow-md hover:shadow-lg"
        >
          <MapPin size={18} />
          Open Full Map View ({sites.length} water points)
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
