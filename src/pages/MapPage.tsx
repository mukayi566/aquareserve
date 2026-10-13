import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useStore } from '../store/useStore';
import type { RiskLevel, SiteType } from '../types';
import { format } from 'date-fns';
import { Filter, ArrowRight } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const riskColors: Record<RiskLevel, string> = {
  High:  '#ef4444',
  Watch: '#f59e0b',
  Low:   '#10b981',
};

const typeLabels: Record<SiteType, string> = {
  borehole: 'Borehole',
  kiosk: 'Kiosk',
  school_tap: 'School Tap',
  clinic_supply: 'Clinic Supply',
  reservoir: 'Reservoir',
};

const AREAS = ['All Areas', 'kanyama', 'chawama', 'matero', 'chilanga', 'chelston', 'ngombe', 'kalingalinga', 'misisi'];
const TYPES: Array<SiteType | 'all'> = ['all', 'borehole', 'kiosk', 'school_tap', 'clinic_supply', 'reservoir'];
const RISKS: Array<RiskLevel | 'all'> = ['all', 'High', 'Watch', 'Low'];

export const MapPage: React.FC = () => {
  const { sites, riskMap } = useStore();
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [typeFilter, setTypeFilter] = useState<SiteType | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = sites.filter(s => {
    if (areaFilter !== 'All Areas' && s.area !== areaFilter) return false;
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    if (riskFilter !== 'all' && riskMap[s.id]?.risk !== riskFilter) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Filters toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 flex-wrap z-10">
        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          <Filter size={14} />
          Filters
          {(areaFilter !== 'All Areas' || typeFilter !== 'all' || riskFilter !== 'all') && (
            <span className="w-4 h-4 bg-cyan-600 text-white rounded-full text-[10px] flex items-center justify-center">!</span>
          )}
        </button>

        {showFilters && (
          <>
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {AREAS.map(a => (
                <option key={a} value={a}>{a === 'All Areas' ? 'All Areas' : a.charAt(0).toUpperCase() + a.slice(1)}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as SiteType | 'all')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{t === 'all' ? 'All Types' : typeLabels[t as SiteType]}</option>
              ))}
            </select>

            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value as RiskLevel | 'all')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {RISKS.map(r => (
                <option key={r} value={r}>{r === 'all' ? 'All Risk Levels' : r}</option>
              ))}
            </select>

            <button
              onClick={() => { setAreaFilter('All Areas'); setTypeFilter('all'); setRiskFilter('all'); }}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear filters
            </button>
          </>
        )}

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-xs text-slate-600">
          {(['High', 'Watch', 'Low'] as RiskLevel[]).map(r => (
            <div key={r} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: riskColors[r] }} />
              {r}
            </div>
          ))}
          <span className="text-slate-400">· {filtered.length} sites</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-15.416, 28.283]}
          zoom={12}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map(site => {
            const risk = riskMap[site.id]?.risk ?? 'Low';
            const assessment = riskMap[site.id];
            return (
              <CircleMarker
                key={site.id}
                center={[site.coordinates.lat, site.coordinates.lng]}
                radius={risk === 'High' ? 14 : risk === 'Watch' ? 11 : 8}
                pathOptions={{
                  fillColor: riskColors[risk],
                  fillOpacity: 0.85,
                  color: 'white',
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="min-w-48">
                    <div className="font-bold text-slate-800 mb-1">{site.name}</div>
                    <div className="text-xs text-slate-500 mb-2 capitalize">{typeLabels[site.type]} · {site.area}</div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        risk === 'High' ? 'bg-red-100 text-red-700' :
                        risk === 'Watch' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {risk} Risk
                      </span>
                      <span className="text-xs text-slate-500">{assessment?.confidence ?? 0}% confidence</span>
                    </div>

                    {assessment?.warnings.length > 0 && (
                      <div className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mb-2">
                        ⚠ {assessment.warnings[0]}
                      </div>
                    )}

                    <div className="text-xs text-slate-500 mb-3">
                      Pop: {site.servedPopulation.toLocaleString()} · Last updated: {format(site.lastUpdated, 'dd MMM, HH:mm')}
                    </div>

                    <a
                      href={`/sites/${site.id}`}
                      className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      View site detail <ArrowRight size={11} />
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
