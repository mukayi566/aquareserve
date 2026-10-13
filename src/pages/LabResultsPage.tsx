import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { FlaskConical, Plus, CheckCircle } from 'lucide-react';
import type { LabResult } from '../types';

const PARAMETERS = ['pH', 'Turbidity (NTU)', 'Total Coliform (CFU/100mL)', 'E. coli (CFU/100mL)', 'Nitrate (mg/L)', 'Fluoride (mg/L)', 'Chlorine Residual (mg/L)', 'Total Dissolved Solids (mg/L)'];
const LABS = ['NWASCO Reference Lab', 'LWSC Water Quality Lab', 'UNZA Environmental Lab'];

const WHO_LIMITS: Record<string, { limit: number; unit: string }> = {
  'pH': { limit: 8.5, unit: '' },
  'Turbidity (NTU)': { limit: 4, unit: 'NTU' },
  'Total Coliform (CFU/100mL)': { limit: 0, unit: 'CFU/100mL' },
  'E. coli (CFU/100mL)': { limit: 0, unit: 'CFU/100mL' },
  'Nitrate (mg/L)': { limit: 50, unit: 'mg/L' },
  'Fluoride (mg/L)': { limit: 1.5, unit: 'mg/L' },
  'Chlorine Residual (mg/L)': { limit: 5, unit: 'mg/L' },
  'Total Dissolved Solids (mg/L)': { limit: 1000, unit: 'mg/L' },
};

export const LabResultsPage: React.FC = () => {
  const { labResults, sites, addLabResult } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [siteId, setSiteId] = useState('');
  const [parameter, setParameter] = useState(PARAMETERS[0]);
  const [value, setValue] = useState('');
  const [labName, setLabName] = useState(LABS[0]);
  const [testedBy, setTestedBy] = useState('');
  const [notes, setNotes] = useState('');

  const sorted = [...labResults].sort((a, b) => b.collectedDate.getTime() - a.collectedDate.getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId || !value) return;
    const result: LabResult = {
      id: `lab-${Date.now()}`,
      siteId,
      collectedDate: new Date(),
      receivedDate: new Date(),
      parameter,
      value: parseFloat(value),
      unit: WHO_LIMITS[parameter]?.unit ?? '',
      testedBy,
      labName,
      notes,
    };
    addLabResult(result);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false); setShowForm(false);
      setSiteId(''); setValue(''); setTestedBy(''); setNotes('');
    }, 2000);
  };

  const exceedsLimit = (r: LabResult) => {
    const lim = WHO_LIMITS[r.parameter];
    if (!lim) return false;
    return r.parameter === 'pH' ? r.value < 6.5 || r.value > lim.limit : r.value > lim.limit;
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <FlaskConical size={22} className="text-cyan-600" />
          <h1 className="text-2xl font-bold text-slate-800">Lab Results</h1>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
        >
          <Plus size={15} /> Add Result
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-6">Water quality laboratory results. WHO guideline limits are shown for reference.</p>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 space-y-4">
          {submitted && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircle size={16} /> Result saved
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Water Point *</label>
                <select required value={siteId} onChange={e => setSiteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="">Select site…</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Parameter *</label>
                <select value={parameter} onChange={e => setParameter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  {PARAMETERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Value * {WHO_LIMITS[parameter] && `(Limit: ${WHO_LIMITS[parameter].limit} ${WHO_LIMITS[parameter].unit})`}</label>
                <input required type="number" step="0.01" value={value} onChange={e => setValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Lab</label>
                <select value={labName} onChange={e => setLabName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  {LABS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tested By</label>
                <input type="text" value={testedBy} onChange={e => setTestedBy(e.target.value)} placeholder="Analyst name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Site</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Parameter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">WHO Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Lab</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const site = sites.find(s => s.id === r.siteId);
                const exceeded = exceedsLimit(r);
                const lim = WHO_LIMITS[r.parameter];
                return (
                  <tr key={r.id} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{site?.name ?? r.siteId}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.parameter}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-semibold ${exceeded ? 'text-red-600' : 'text-emerald-600'}`}>
                        {r.value} {r.unit}
                      </span>
                      {exceeded && <span className="ml-1 text-xs text-red-400">⚠ exceeds</span>}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs hidden sm:table-cell">
                      {lim ? `${lim.limit} ${lim.unit}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs hidden md:table-cell">{r.labName}</td>
                    <td className="px-4 py-2.5 text-slate-400 text-xs hidden lg:table-cell">{format(r.collectedDate, 'dd MMM yyyy')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
