import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { CheckSquare, MapPin, Clock, AlertTriangle } from 'lucide-react';

export const MyTasksPage: React.FC = () => {
  const { alerts, sites, currentUserId, currentRole, users } = useStore();

  const myAlerts = alerts.filter(a =>
    (a.assignedTo === currentUserId && a.status !== 'closed') ||
    (currentRole === 'Admin' && a.status === 'open')
  );

  const currentUser = users.find(u => u.id === currentUserId);

  if (currentRole === 'Viewer') {
    return (
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <Breadcrumbs />
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <AlertTriangle size={32} className="mb-3 opacity-50" />
          <p className="font-semibold text-slate-600">Viewer access only</p>
          <p className="text-sm text-slate-400 mt-2">Viewers cannot be assigned tasks. Switch to Admin or Operator role.</p>
        </div>
      </div>
    );
  }

  const verificationChecklist = [
    'Physically inspect the water point',
    'Check pump operation and control panel',
    'Verify flow meter reading against display',
    'Record water level manually',
    'Document any visible faults or abnormalities',
    'Speak to local community water committee representative',
    'Report findings in the system',
  ];

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
        <p className="text-slate-500 text-sm mt-1">
          Logged in as: <span className="font-medium text-slate-700">{currentUser?.name ?? 'Unknown'}</span> ({currentRole})
        </p>
      </div>

      {myAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
          <CheckSquare size={40} className="mb-3 opacity-40" />
          <p className="font-semibold text-slate-600">No pending tasks</p>
          <p className="text-sm">All alerts have been actioned or no alerts are assigned to you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myAlerts.map(alert => {
            const site = sites.find(s => s.id === alert.siteId);
            const needsVerify = alert.status === 'assigned' && alert.assignedTo === currentUserId;
            const needsAssign = currentRole === 'Admin' && alert.status === 'open';

            return (
              <div key={alert.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <RiskBadge risk={alert.riskLevel} size="md" pulse={alert.riskLevel === 'High'} />
                    <div>
                      <h3 className="font-semibold text-slate-800">{alert.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={11} />{site?.name ?? alert.siteId}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock size={11} />{format(alert.createdAt, 'dd MMM')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/alerts/${alert.id}`}
                    className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
                  >
                    {needsAssign ? 'Assign' : needsVerify ? 'Verify' : 'View'}
                  </Link>
                </div>

                <p className="text-sm text-slate-600 mb-4">{alert.description}</p>

                {/* Verification checklist for assigned alerts */}
                {needsVerify && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-3">
                      Field Verification Checklist
                    </p>
                    <ul className="space-y-2">
                      {verificationChecklist.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-violet-800">
                          <CheckSquare size={14} className="text-violet-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-violet-600 mt-3">
                      After completing field check, open the alert and click "Mark as Verified".
                    </p>
                  </div>
                )}

                {needsAssign && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Admin Action Required</p>
                    <p className="text-sm text-blue-700">This alert is unassigned. Open it to assign to an operator.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
