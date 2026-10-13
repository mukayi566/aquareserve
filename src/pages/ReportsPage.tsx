import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { FileText, Download, Filter } from 'lucide-react';

const NOW = new Date('2026-10-13T17:00:00Z');

type ReportType = 'alert_summary' | 'site_status' | 'maintenance' | 'data_quality';

const reportDefs: { type: ReportType; label: string; description: string }[] = [
  { type: 'alert_summary', label: 'Alert Summary', description: 'All alerts with status, risk level, and outcome within the selected period.' },
  { type: 'site_status', label: 'Site Status Report', description: 'Current risk, data freshness, and population coverage per water point.' },
  { type: 'maintenance', label: 'Maintenance Log', description: 'Planned and reactive maintenance records with completion status and cost.' },
  { type: 'data_quality', label: 'Data Quality Report', description: 'Reading completeness, stale data, and implausible values across all sites.' },
];

export const ReportsPage: React.FC = () => {
  const { alerts, sites, riskMap, maintenance, readings } = useStore();
  const [selectedType, setSelectedType] = useState<ReportType>('alert_summary');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(false);
    setTimeout(() => setGenerated(true), 400);
  };

  const reportDef = reportDefs.find(r => r.type === selectedType)!;

  // Compute preview rows
  const alertRows = alerts.slice(0, 10).map(a => ({
    site: sites.find(s => s.id === a.siteId)?.name ?? a.siteId,
    title: a.title,
    risk: a.riskLevel,
    status: a.status,
    outcome: a.outcome,
    created: format(a.createdAt, 'dd MMM yyyy'),
  }));

  const siteRows = sites.slice(0, 10).map(s => ({
    name: s.name,
    area: s.area,
    risk: riskMap[s.id]?.risk ?? 'Low',
    pop: s.servedPopulation.toLocaleString(),
    updated: format(s.lastUpdated, 'dd MMM, HH:mm'),
  }));

  const maintRows = maintenance.slice(0, 10).map(m => ({
    title: m.title,
    site: sites.find(s => s.id === m.siteId)?.name ?? m.siteId,
    status: m.status,
    type: m.type,
    scheduled: format(m.scheduledDate, 'dd MMM yyyy'),
    cost: m.cost ? `ZMW ${m.cost.toLocaleString()}` : '—',
  }));

  const flagCounts = { ok: 0, missing: 0, stale: 0, implausible: 0 };
  readings.forEach(r => { (flagCounts as Record<string, number>)[r.qualityFlag]++; });
  const qualityRows = Object.entries(flagCounts).map(([flag, count]) => ({
    flag, count, pct: `${Math.round((count / Math.max(readings.length, 1)) * 100)}%`,
  }));

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <div className="flex items-center gap-3 mb-2">
        <FileText size={22} className="text-cyan-600" />
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
      </div>
      <p className="text-slate-500 text-sm mb-8">
        Generate and export structured reports for sharing with NWASCO, LWSC, and stakeholders.
      </p>

      {/* Report selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {reportDefs.map(r => (
          <button
            key={r.type}
            onClick={() => { setSelectedType(r.type); setGenerated(false); }}
            className={`text-left p-5 rounded-2xl border-2 transition-all ${
              selectedType === r.type
                ? 'border-cyan-400 bg-cyan-50'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <p className={`font-semibold text-sm ${selectedType === r.type ? 'text-cyan-700' : 'text-slate-800'}`}>{r.label}</p>
            <p className="text-xs text-slate-500 mt-1">{r.description}</p>
          </button>
        ))}
      </div>

      {/* Generate button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors"
        >
          <Filter size={15} /> Generate Preview
        </button>
        {generated && (
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        )}
        <span className="text-xs text-slate-400">
          Generated: {format(NOW, 'dd MMM yyyy, HH:mm')}
        </span>
      </div>

      {/* Preview table */}
      {generated && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="font-semibold text-slate-700 text-sm">{reportDef.label} — Preview (first 10 rows)</p>
          </div>
          <div className="overflow-x-auto">
            {selectedType === 'alert_summary' && (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Site', 'Alert', 'Risk', 'Status', 'Outcome', 'Created'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alertRows.map((r, i) => (
                    <tr key={i} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className="px-4 py-2.5 text-slate-700">{r.site}</td>
                      <td className="px-4 py-2.5 text-slate-600 text-xs">{r.title}</td>
                      <td className="px-4 py-2.5"><span className={`text-xs font-medium ${r.risk === 'High' ? 'text-red-600' : r.risk === 'Watch' ? 'text-amber-600' : 'text-emerald-600'}`}>{r.risk}</span></td>
                      <td className="px-4 py-2.5 text-slate-500 capitalize">{r.status}</td>
                      <td className="px-4 py-2.5 text-slate-500 capitalize">{r.outcome}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{r.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {selectedType === 'site_status' && (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Site', 'Area', 'Risk', 'Population', 'Last Updated'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {siteRows.map((r, i) => (
                    <tr key={i} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className="px-4 py-2.5 font-medium text-slate-700">{r.name}</td>
                      <td className="px-4 py-2.5 text-slate-500 capitalize">{r.area}</td>
                      <td className="px-4 py-2.5"><span className={`text-xs font-medium ${r.risk === 'High' ? 'text-red-600' : r.risk === 'Watch' ? 'text-amber-600' : 'text-emerald-600'}`}>{r.risk}</span></td>
                      <td className="px-4 py-2.5 text-slate-500">{r.pop}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{r.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {selectedType === 'maintenance' && (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Title', 'Site', 'Type', 'Status', 'Scheduled', 'Cost'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {maintRows.map((r, i) => (
                    <tr key={i} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className="px-4 py-2.5 font-medium text-slate-700">{r.title}</td>
                      <td className="px-4 py-2.5 text-slate-500">{r.site}</td>
                      <td className="px-4 py-2.5 text-slate-500 capitalize">{r.type}</td>
                      <td className="px-4 py-2.5 text-slate-500 capitalize">{r.status.replace('_', ' ')}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{r.scheduled}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">{r.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {selectedType === 'data_quality' && (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Quality Flag', 'Count', '% of Total'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qualityRows.map((r, i) => (
                    <tr key={i} className={`border-b border-slate-50 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className="px-4 py-2.5 font-medium text-slate-700 capitalize">{r.flag}</td>
                      <td className="px-4 py-2.5 text-slate-500">{r.count}</td>
                      <td className="px-4 py-2.5 text-slate-500">{r.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
