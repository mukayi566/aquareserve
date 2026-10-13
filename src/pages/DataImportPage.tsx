import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format, differenceInHours } from 'date-fns';
import { Upload, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { DataQualityFlag } from '../types';

const NOW = new Date('2026-10-13T17:00:00Z');

const flagColors: Record<DataQualityFlag, string> = {
  ok: 'bg-emerald-100 text-emerald-700',
  missing: 'bg-slate-100 text-slate-600',
  stale: 'bg-amber-100 text-amber-700',
  implausible: 'bg-red-100 text-red-700',
};

export const DataImportPage: React.FC = () => {
  const { readings, sites } = useStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [importDone, setImportDone] = useState(false);

  const recentReadings = readings
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 30);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setTimeout(() => setImportDone(true), 800);
    }
  };

  const flagCounts: Record<DataQualityFlag, number> = { ok: 0, missing: 0, stale: 0, implausible: 0 };
  readings.forEach(r => { flagCounts[r.qualityFlag]++; });

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <Upload size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Data Import</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Upload CSV files from field devices or SCADA exports. Each row must include: site_id, date, flow_lph, level_m, usage_lph, quality_flag.
      </p>

      {/* Upload area */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center mb-8 hover:border-cyan-300 transition-colors">
        <Upload size={32} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-600 font-medium mb-1">Drop your CSV here</p>
        <p className="text-slate-400 text-sm mb-4">or click to browse</p>
        <label className="cursor-pointer inline-block">
          <input type="file" accept=".csv" className="sr-only" onChange={handleFile} />
          <span className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors">
            Choose File
          </span>
        </label>
        {fileName && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
            <FileText size={15} />
            {fileName}
            {importDone && <CheckCircle size={15} className="text-emerald-500" />}
          </div>
        )}
      </div>

      {/* Quality summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {(Object.entries(flagCounts) as [DataQualityFlag, number][]).map(([flag, count]) => (
          <div key={flag} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">{count}</div>
            <div className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full inline-block capitalize ${flagColors[flag]}`}>{flag}</div>
          </div>
        ))}
      </div>

      {/* Recent readings log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Clock size={15} className="text-slate-400" />
          <span className="font-semibold text-slate-700 text-sm">Recent Readings (last 30)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Site</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Flow (L/h)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Level (m)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Quality</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Age</th>
              </tr>
            </thead>
            <tbody>
              {recentReadings.map((r, i) => {
                const site = sites.find(s => s.id === r.siteId);
                const ageH = differenceInHours(NOW, r.date);
                return (
                  <tr key={r.id} className={`border-b border-slate-50 ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                    <td className="px-4 py-3 font-medium text-slate-700">{site?.name ?? r.siteId}</td>
                    <td className="px-4 py-3 text-slate-500">{format(r.date, 'dd MMM yy')}</td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{r.flowLPH ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{r.levelM ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${flagColors[r.qualityFlag]}`}>
                        {r.qualityFlag}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`flex items-center gap-1 text-xs ${ageH > 48 ? 'text-red-500' : 'text-slate-400'}`}>
                        {ageH > 48 && <AlertTriangle size={11} />}
                        {ageH < 1 ? '<1h' : `${ageH}h`}
                      </span>
                    </td>
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
