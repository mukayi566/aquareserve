import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { Settings, Bell, Clock, Ruler, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, currentRole } = useStore();
  const canEdit = currentRole === 'Admin';

  const [notifEmail, setNotifEmail] = useState(settings.notificationEmail);
  const [notifSMS, setNotifSMS] = useState(settings.notificationSMS);
  const [units, setUnits] = useState<'metric' | 'imperial'>(settings.units);
  const [throttleH, setThrottleH] = useState(settings.alertThrottleHours);
  const [staleH, setStaleH] = useState(settings.dataStaleHours);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-cyan-500' : 'bg-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <Settings size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">System-wide configuration. Changes apply to all users.
        {!canEdit && ' Admin access required to edit settings.'}
      </p>

      {!canEdit && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3 mb-6">
          <Info size={14} /> Settings are read-only for your current role.
        </div>
      )}

      <div className="space-y-5">
        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-slate-400" />
            <h2 className="font-semibold text-slate-700">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Email Notifications</p>
                <p className="text-xs text-slate-400">Send alert emails to assigned operators</p>
              </div>
              <Toggle value={notifEmail} onChange={setNotifEmail} disabled={!canEdit} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">SMS Notifications</p>
                <p className="text-xs text-slate-400">Send SMS to registered phone numbers</p>
              </div>
              <Toggle value={notifSMS} onChange={setNotifSMS} disabled={!canEdit} />
            </div>
          </div>
        </div>

        {/* Units */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Ruler size={16} className="text-slate-400" />
            <h2 className="font-semibold text-slate-700">Measurement Units</h2>
          </div>
          <div className="flex gap-3">
            {(['metric', 'imperial'] as const).map(u => (
              <button
                key={u}
                disabled={!canEdit}
                onClick={() => canEdit && setUnits(u)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                  units === u
                    ? 'bg-cyan-600 text-white border-cyan-600'
                    : 'bg-white border-slate-200 text-slate-600'
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Alert thresholds */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={16} className="text-slate-400" />
            <h2 className="font-semibold text-slate-700">Alert & Data Settings</h2>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">Alert Throttle</p>
                  <p className="text-xs text-slate-400">Minimum hours between repeated alerts for the same site</p>
                </div>
                <span className="text-sm font-bold text-cyan-700">{throttleH}h</span>
              </div>
              <input
                type="range" min={1} max={72} step={1}
                value={throttleH}
                disabled={!canEdit}
                onChange={e => setThrottleH(parseInt(e.target.value))}
                className="w-full accent-cyan-600 disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1h</span><span>72h</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-slate-700">Data Staleness Threshold</p>
                  <p className="text-xs text-slate-400">Hours after which a reading is considered stale</p>
                </div>
                <span className="text-sm font-bold text-cyan-700">{staleH}h</span>
              </div>
              <input
                type="range" min={6} max={168} step={6}
                value={staleH}
                disabled={!canEdit}
                onChange={e => setStaleH(parseInt(e.target.value))}
                className="w-full accent-cyan-600 disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>6h</span><span>7 days</span></div>
            </div>
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
          >
            Save Changes
          </button>
          {saved && <span className="text-sm text-emerald-600 font-medium">Settings saved ✓</span>}
        </div>
      )}
    </div>
  );
};
