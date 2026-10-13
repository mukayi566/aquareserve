import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { MapPin, Droplets, AlertTriangle } from 'lucide-react';

export const AreasPage: React.FC = () => {
  const { areas, sites, riskMap } = useStore();

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Areas</h1>
      <p className="text-slate-500 text-sm mb-8">Water security summary by area, based on current site risk assessments.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {areas.map(area => {
          const areaSites = sites.filter(s => s.area === area.id);
          const highSites = areaSites.filter(s => riskMap[s.id]?.risk === 'High').length;
          const watchSites = areaSites.filter(s => riskMap[s.id]?.risk === 'Watch').length;
          const totalPop = areaSites.reduce((sum, s) => sum + s.servedPopulation, 0);
          const areaRisk = highSites > 0 ? 'High' : watchSites > 0 ? 'Watch' : 'Low';

          return (
            <div key={area.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={15} className="text-cyan-500" />
                    <h2 className="text-lg font-bold text-slate-800">{area.name}</h2>
                  </div>
                  <p className="text-sm text-slate-500">{area.region}</p>
                  <p className="text-xs text-slate-400 mt-1">{area.description}</p>
                </div>
                <RiskBadge risk={areaRisk} size="md" pulse={areaRisk === 'High'} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-slate-50 rounded-xl py-2">
                  <div className="text-xl font-bold text-slate-800">{areaSites.length}</div>
                  <div className="text-xs text-slate-500">Sites</div>
                </div>
                <div className="text-center bg-slate-50 rounded-xl py-2">
                  <div className="text-xl font-bold text-slate-800">{(totalPop / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-slate-500">Population</div>
                </div>
                <div className="text-center bg-slate-50 rounded-xl py-2">
                  <div className={`text-xl font-bold ${highSites > 0 ? 'text-red-600' : watchSites > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {highSites + watchSites}
                  </div>
                  <div className="text-xs text-slate-500">Flagged</div>
                </div>
              </div>

              {/* Risk distribution */}
              {areaSites.length > 0 && (
                <div className="flex gap-1 rounded-full overflow-hidden h-2 mb-4">
                  {highSites > 0 && <div className="bg-red-400" style={{ flex: highSites }} />}
                  {watchSites > 0 && <div className="bg-amber-400" style={{ flex: watchSites }} />}
                  <div className="bg-emerald-400" style={{ flex: Math.max(areaSites.length - highSites - watchSites, 0) }} />
                </div>
              )}

              {/* Sites list */}
              <div className="space-y-1.5">
                {areaSites.map(s => (
                  <Link
                    key={s.id}
                    to={`/sites/${s.id}`}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <Droplets size={12} className="text-cyan-400" />
                    <span className="text-sm text-slate-700 group-hover:text-cyan-700 flex-1 truncate">{s.name}</span>
                    <RiskBadge risk={riskMap[s.id]?.risk ?? 'Low'} size="sm" />
                  </Link>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/sites?area=${area.id}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Droplets size={12} />
                  All Sites
                </Link>
                {(highSites > 0 || watchSites > 0) && (
                  <Link
                    to={`/alerts?area=${area.id}`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <AlertTriangle size={12} />
                    {highSites + watchSites} Alerts
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
