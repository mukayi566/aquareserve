import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Database, CheckCircle } from 'lucide-react';
import type { DailyReading, DataQualityFlag } from '../types';

export const DataEntryPage: React.FC = () => {
  const { sites, addReading, currentUserId } = useStore();
  const [siteId, setSiteId] = useState('');
  const [flowLPH, setFlowLPH] = useState('');
  const [levelM, setLevelM] = useState('');
  const [usageLPH, setUsageLPH] = useState('');
  const [qualityFlag, setQualityFlag] = useState<DataQualityFlag>('ok');
  const [qualityNote, setQualityNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId) return;
    const reading: DailyReading = {
      id: `r-${Date.now()}`,
      siteId,
      date: new Date(),
      flowLPH: flowLPH ? parseFloat(flowLPH) : null,
      levelM: levelM ? parseFloat(levelM) : null,
      usageLPH: usageLPH ? parseFloat(usageLPH) : null,
      qualityFlag,
      qualityNote: qualityNote || undefined,
      recordedBy: currentUserId,
    };
    addReading(reading);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSiteId(''); setFlowLPH(''); setLevelM(''); setUsageLPH('');
      setQualityFlag('ok'); setQualityNote('');
    }, 2500);
  };

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <Database size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Manual Data Entry</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Record a daily reading for a water point. All entries are timestamped and attributed to your account.
      </p>

      {submitted && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 mb-6">
          <CheckCircle size={20} />
          <span className="font-medium">Reading saved successfully</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Water Point *</label>
          <select
            required
            value={siteId}
            onChange={e => setSiteId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Select a site…</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{s.name} — {s.area}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Flow (L/h)</label>
            <input
              type="number" min="0" step="0.1" value={flowLPH}
              onChange={e => setFlowLPH(e.target.value)}
              placeholder="e.g. 850"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Water Level (m)</label>
            <input
              type="number" min="0" step="0.01" value={levelM}
              onChange={e => setLevelM(e.target.value)}
              placeholder="e.g. 0.85"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usage (L/h)</label>
            <input
              type="number" min="0" step="0.1" value={usageLPH}
              onChange={e => setUsageLPH(e.target.value)}
              placeholder="e.g. 620"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Data Quality</label>
          <div className="flex flex-wrap gap-2">
            {(['ok', 'missing', 'stale', 'implausible'] as DataQualityFlag[]).map(f => (
              <button
                key={f} type="button"
                onClick={() => setQualityFlag(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                  qualityFlag === f
                    ? 'bg-cyan-600 text-white border-cyan-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quality Note (optional)</label>
          <textarea
            rows={2} value={qualityNote}
            onChange={e => setQualityNote(e.target.value)}
            placeholder="Describe any anomaly or reason for the flag…"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Timestamp: {format(new Date(), 'dd MMM yyyy, HH:mm')}
          </span>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
          >
            Save Reading
          </button>
        </div>
      </form>
    </div>
  );
};
