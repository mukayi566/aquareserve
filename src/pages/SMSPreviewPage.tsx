import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, typeof CheckCircle> = {
  sent: Clock,
  delivered: CheckCircle,
  failed: XCircle,
};

export const SMSPreviewPage: React.FC = () => {
  const { smsAlerts, alerts, sites } = useStore();
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'delivered' | 'failed'>('all');

  const filtered = smsAlerts
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

  const sentCount = smsAlerts.filter(s => s.status === 'sent').length;
  const deliveredCount = smsAlerts.filter(s => s.status === 'delivered').length;
  const failedCount = smsAlerts.filter(s => s.status === 'failed').length;
  const deliveryRate = smsAlerts.length > 0
    ? Math.round((deliveredCount / smsAlerts.length) * 100)
    : 0;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">SMS Preview</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Review outbound SMS alerts sent to operators and community water monitors. Numbers are masked for privacy.
      </p>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sent', value: smsAlerts.length, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Delivered', value: deliveredCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: sentCount, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Delivery Rate', value: `${deliveryRate}%`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-xs text-slate-500 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'delivered', 'sent', 'failed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
              statusFilter === s
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === 'all' ? 'All' : s}
            {s === 'failed' && failedCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5">{failedCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* SMS list */}
      <div className="space-y-3">
        {filtered.map(sms => {
          const alert = alerts.find(a => a.id === sms.alertId);
          const site = alert ? sites.find(s => s.id === alert.siteId) : null;
          const Icon = statusIcons[sms.status];
          return (
            <div key={sms.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <MessageSquare size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{sms.recipient}</p>
                    <p className="text-xs text-slate-400">{site?.name ?? 'Unknown site'} · {format(sms.sentAt, 'dd MMM, HH:mm')}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[sms.status]}`}>
                  <Icon size={11} />
                  {sms.status}
                </span>
              </div>

              {/* Message bubble */}
              <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed border border-slate-100">
                {sms.message}
              </div>

              {alert && (
                <div className="mt-2 text-xs text-slate-400">
                  Alert: {alert.title} · Risk: <span className={alert.riskLevel === 'High' ? 'text-red-500' : alert.riskLevel === 'Watch' ? 'text-amber-500' : 'text-emerald-500'}>{alert.riskLevel}</span>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">No SMS messages match the selected filter.</div>
        )}
      </div>
    </div>
  );
};
