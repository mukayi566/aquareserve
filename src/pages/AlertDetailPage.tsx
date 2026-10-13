import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import {
  AlertTriangle, Info, CheckCircle, ArrowRight,
  Shield, Check, Eye,
} from 'lucide-react';
import type { AlertOutcome } from '../types';

const NOW = new Date('2026-10-13T17:00:00Z');

const outcomeColors: Record<AlertOutcome, string> = {
  pending: 'bg-slate-100 text-slate-700',
  correct: 'bg-emerald-100 text-emerald-700',
  false_alarm: 'bg-amber-100 text-amber-700',
  missed: 'bg-red-100 text-red-700',
};

export const AlertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { alerts, sites, users, currentRole, currentUserId, updateAlert, addAuditEntry, addGlobalAuditEntry } = useStore();

  const [actionText, setActionText] = useState('');
  const [outcomeChoice, setOutcomeChoice] = useState<AlertOutcome>('pending');

  const alert = alerts.find(a => a.id === id);
  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <AlertTriangle size={40} className="mb-3 opacity-30" />
        <p className="font-semibold text-slate-600">Alert not found</p>
        <button onClick={() => navigate('/alerts')} className="mt-4 text-cyan-600 hover:underline text-sm">Back to Alerts</button>
      </div>
    );
  }

  const site = sites.find(s => s.id === alert.siteId);
  const assignee = users.find(u => u.id === alert.assignedTo);
  const verifier = users.find(u => u.id === alert.verifiedBy);
  const closedByUser = users.find(u => u.id === alert.closedBy);

  const canAssign = currentRole === 'Admin';
  const canVerify = currentRole !== 'Viewer' && alert.status === 'assigned' && alert.assignedTo === currentUserId;
  const canAction = currentRole !== 'Viewer' && (alert.status === 'verified' || alert.status === 'assigned');
  const canClose = currentRole === 'Admin' && alert.status === 'actioned';
  const isReadOnly = currentRole === 'Viewer';

  const makeAuditId = () => `ae-${Date.now()}`;

  const handleAssign = (userId: string) => {
    const auditEntry = {
      id: makeAuditId(),
      timestamp: NOW,
      userId: currentUserId,
      action: 'Assigned',
      details: `Alert assigned to ${users.find(u => u.id === userId)?.name ?? userId}`,
    };
    updateAlert(id!, {
      status: 'assigned',
      assignedTo: userId,
      assignedAt: NOW,
    });
    addAuditEntry(id!, auditEntry);
    addGlobalAuditEntry({ timestamp: NOW, userId: currentUserId, entityType: 'Alert', entityId: id!, action: 'ASSIGNED', details: auditEntry.details });
  };

  const handleVerify = () => {
    const auditEntry = { id: makeAuditId(), timestamp: NOW, userId: currentUserId, action: 'Verified', details: 'On-site verification completed by operator' };
    updateAlert(id!, { status: 'verified', verifiedAt: NOW, verifiedBy: currentUserId });
    addAuditEntry(id!, auditEntry);
    addGlobalAuditEntry({ timestamp: NOW, userId: currentUserId, entityType: 'Alert', entityId: id!, action: 'VERIFIED', details: auditEntry.details });
  };

  const handleAction = () => {
    if (!actionText.trim()) return;
    const auditEntry = { id: makeAuditId(), timestamp: NOW, userId: currentUserId, action: 'Action taken', details: actionText };
    updateAlert(id!, { status: 'actioned', actionTaken: actionText, actionAt: NOW });
    addAuditEntry(id!, auditEntry);
    addGlobalAuditEntry({ timestamp: NOW, userId: currentUserId, entityType: 'Alert', entityId: id!, action: 'ACTION_TAKEN', details: actionText });
    setActionText('');
  };

  const handleClose = () => {
    if (outcomeChoice === 'pending') return;
    const auditEntry = { id: makeAuditId(), timestamp: NOW, userId: currentUserId, action: 'Closed', details: `Outcome: ${outcomeChoice}` };
    updateAlert(id!, { status: 'closed', outcome: outcomeChoice, closedAt: NOW, closedBy: currentUserId });
    addAuditEntry(id!, auditEntry);
    addGlobalAuditEntry({ timestamp: NOW, userId: currentUserId, entityType: 'Alert', entityId: id!, action: 'CLOSED', details: `Outcome: ${outcomeChoice}` });
  };

  const operators = users.filter(u => u.role !== 'Viewer' && u.active);

  const stepConfig = [
    { key: 'open', label: 'Created', done: true },
    { key: 'assigned', label: 'Assigned', done: ['assigned', 'verified', 'actioned', 'closed'].includes(alert.status) },
    { key: 'verified', label: 'Verified', done: ['verified', 'actioned', 'closed'].includes(alert.status) },
    { key: 'actioned', label: 'Action Taken', done: ['actioned', 'closed'].includes(alert.status) },
    { key: 'closed', label: 'Closed', done: alert.status === 'closed' },
  ];

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <RiskBadge risk={alert.riskLevel} size="lg" pulse={alert.riskLevel === 'High'} />
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${alert.status === 'closed' ? 'bg-emerald-100 text-emerald-700' :
              alert.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                alert.status === 'verified' ? 'bg-violet-100 text-violet-700' :
                  alert.status === 'actioned' ? 'bg-teal-100 text-teal-700' :
                    'bg-slate-100 text-slate-700'
              }`}>
              {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-1">{alert.title}</h1>
          <p className="text-slate-500 text-sm">{alert.description}</p>
        </div>
        <Link to={`/sites/${alert.siteId}`} className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 shrink-0">
          {site?.name ?? alert.siteId} <ArrowRight size={12} />
        </Link>
      </div>

      {/* Workflow progress */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto">
        {stepConfig.map((step, i) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                {step.done ? <Check size={15} /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span className="text-xs mt-1 text-slate-500 whitespace-nowrap">{step.label}</span>
            </div>
            {i < stepConfig.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 ${step.done && stepConfig[i + 1].done ? 'bg-cyan-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Explainer */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Info size={15} className="text-cyan-500" />
              Why was this alert raised?
            </h2>
            <ul className="space-y-2">
              {alert.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-500" />
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-400 mb-1">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${alert.confidence > 70 ? 'bg-emerald-500' : alert.confidence > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${alert.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{alert.confidence}%</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-400 mb-1">Data Freshness</p>
                <p className="text-sm text-slate-700">{alert.dataFreshnessNote}</p>
              </div>
            </div>

            <div className="mt-3 bg-cyan-50 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-cyan-700 mb-1">Recommended Next Step</p>
              <p className="text-sm text-cyan-800">{alert.recommendedStep}</p>
            </div>
          </div>

          {/* Workflow actions */}
          {!isReadOnly && alert.status !== 'closed' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Workflow Actions</h2>

              {/* Assign */}
              {canAssign && alert.status === 'open' && (
                <div>
                  <p className="text-sm text-slate-600 mb-3">Assign to an operator for field verification:</p>
                  <div className="flex flex-wrap gap-2">
                    {operators.map(op => (
                      <button
                        key={op.id}
                        onClick={() => handleAssign(op.id)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {op.name} ({op.role})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verify */}
              {canVerify && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
                >
                  <Eye size={16} />
                  Mark as Verified (field check complete)
                </button>
              )}

              {/* Action taken */}
              {canAction && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Record action taken:</p>
                  <textarea
                    value={actionText}
                    onChange={e => setActionText(e.target.value)}
                    placeholder="Describe the action taken (e.g. 'Technician dispatched. Backup pump ordered.')"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAction}
                    disabled={!actionText.trim()}
                    className="mt-2 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 transition-colors"
                  >
                    Save Action
                  </button>
                </div>
              )}

              {/* Close */}
              {canClose && (
                <div>
                  <p className="text-sm text-slate-600 mb-3">Record outcome and close alert:</p>
                  <div className="flex gap-2 mb-3">
                    {(['correct', 'false_alarm', 'missed'] as AlertOutcome[]).map(o => (
                      <button
                        key={o}
                        onClick={() => setOutcomeChoice(o)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${outcomeChoice === o ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                        {o.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={outcomeChoice === 'pending'}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                  >
                    <CheckCircle size={16} />
                    Close Alert
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Outcome */}
          {alert.outcome !== 'pending' && (
            <div className={`rounded-xl px-5 py-4 ${outcomeColors[alert.outcome]}`}>
              <p className="text-sm font-semibold">
                Outcome: {alert.outcome.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              {alert.closedAt && (
                <p className="text-xs mt-1">Closed {format(alert.closedAt, 'dd MMM yyyy, HH:mm')} by {closedByUser?.name ?? 'System'}</p>
              )}
            </div>
          )}

          {/* Audit trail */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={15} className="text-slate-400" />
              Audit Trail
            </h2>
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-100" />
              <div className="space-y-4">
                {alert.auditTrail.map(entry => {
                  const actor = users.find(u => u.id === entry.userId);
                  return (
                    <div key={entry.id} className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center shrink-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {entry.action}
                          <span className="font-normal text-slate-500"> · {actor?.name ?? entry.userId}</span>
                        </p>
                        <p className="text-xs text-slate-500">{entry.details}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{format(entry.timestamp, 'dd MMM yyyy, HH:mm')}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar meta */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Alert Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-400">Site</dt>
                <dd className="font-medium text-slate-700">{site?.name ?? alert.siteId}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Area</dt>
                <dd className="text-slate-600">{site?.area ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Created</dt>
                <dd className="text-slate-600">{format(alert.createdAt, 'dd MMM yyyy, HH:mm')}</dd>
              </div>
              {assignee && (
                <div>
                  <dt className="text-xs text-slate-400">Assigned to</dt>
                  <dd className="text-slate-600">{assignee.name}</dd>
                  {alert.assignedAt && <dd className="text-xs text-slate-400">{format(alert.assignedAt, 'dd MMM yyyy')}</dd>}
                </div>
              )}
              {verifier && (
                <div>
                  <dt className="text-xs text-slate-400">Verified by</dt>
                  <dd className="text-slate-600">{verifier.name}</dd>
                  {alert.verifiedAt && <dd className="text-xs text-slate-400">{format(alert.verifiedAt, 'dd MMM yyyy')}</dd>}
                </div>
              )}
              {alert.actionTaken && (
                <div>
                  <dt className="text-xs text-slate-400">Action taken</dt>
                  <dd className="text-slate-600">{alert.actionTaken}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className={`rounded-xl px-4 py-3 ${outcomeColors[alert.outcome]}`}>
            <p className="text-xs font-semibold">Outcome</p>
            <p className="text-sm capitalize">{alert.outcome.replace('_', ' ')}</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
            ⚠ This alert is decision support. Human field verification is required before action.
          </div>
        </div>
      </div>
    </div>
  );
};
