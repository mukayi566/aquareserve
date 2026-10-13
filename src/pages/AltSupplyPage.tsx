import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Truck, Droplets, Phone, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

const typeColors = {
  tanker:     'bg-blue-100 text-blue-700',
  borehole:   'bg-cyan-100 text-cyan-700',
  kiosk:      'bg-teal-100 text-teal-700',
  rainwater:  'bg-emerald-100 text-emerald-700',
};

const typeIcons = {
  tanker: Truck,
  borehole: Droplets,
  kiosk: MapPin,
  rainwater: Droplets,
};

export const AltSupplyPage: React.FC = () => {
  const { altSupplies, sites, riskMap } = useStore();

  // Group by site
  const siteIds = Array.from(new Set(altSupplies.map(a => a.siteId)));

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Alternative Supply Options</h1>
      <p className="text-slate-500 text-sm mb-8">
        Emergency and backup supply sources logged for at-risk water points.
      </p>

      <div className="space-y-6">
        {siteIds.map(siteId => {
          const site = sites.find(s => s.id === siteId);
          const risk = riskMap[siteId];
          const options = altSupplies.filter(a => a.siteId === siteId);

          return (
            <div key={siteId} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-slate-800">{site?.name ?? siteId}</h2>
                  <p className="text-xs text-slate-400 capitalize">{site?.area} · {site?.type?.replace('_', ' ')}</p>
                </div>
                {risk && <RiskBadge risk={risk.risk} size="md" pulse={risk.risk === 'High'} />}
              </div>

              <div className="space-y-3">
                {options.map(opt => {
                  const Icon = typeIcons[opt.type];
                  return (
                    <div key={opt.id} className={`flex items-start gap-4 p-4 rounded-xl ${opt.active ? 'bg-slate-50' : 'bg-red-50/50 opacity-70'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[opt.type]}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[opt.type]}`}>
                            {opt.type.charAt(0).toUpperCase() + opt.type.slice(1)}
                          </span>
                          {opt.active ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle size={11} />Active</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-red-500"><XCircle size={11} />Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700">{opt.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 flex-wrap">
                          <span>{opt.distanceKm} km away</span>
                          <span>{opt.capacityM3PerDay} m³/day capacity</span>
                          <span className="flex items-center gap-1"><Clock size={11} />Verified: {format(opt.lastVerified, 'dd MMM yyyy')}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Phone size={11} />
                          {opt.contactName}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.contactPhone}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-700">
        <strong>Note:</strong> Alternative supply options require verification before activation. Contact details may change — verify before emergency use.
      </div>
    </div>
  );
};
