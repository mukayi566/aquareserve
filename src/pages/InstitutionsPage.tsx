import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { RiskBadge } from '../components/RiskBadge';
import { useStore } from '../store/useStore';
import { School, Heart, Users, MapPin, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

export const InstitutionsPage: React.FC = () => {
  const { institutions, sites, riskMap } = useStore();

  const schools = institutions.filter(i => i.type === 'school');
  const clinics = institutions.filter(i => i.type === 'clinic');

  const getInstitutionRisk = (inst: typeof institutions[0]) => {
    const primaryRisk = riskMap[inst.primarySiteId]?.risk ?? 'Low';
    const backupRisk = inst.backupSiteId ? riskMap[inst.backupSiteId]?.risk ?? 'Low' : null;
    return { primaryRisk, backupRisk };
  };

  const InstitutionCard = ({ inst }: { inst: typeof institutions[0] }) => {
    const primarySite = sites.find(s => s.id === inst.primarySiteId);
    const backupSite = inst.backupSiteId ? sites.find(s => s.id === inst.backupSiteId) : null;
    const { primaryRisk, backupRisk } = getInstitutionRisk(inst);
    const overallRisk = primaryRisk === 'High' ? 'High' : backupRisk === 'High' || primaryRisk === 'Watch' ? 'Watch' : 'Low';

    const Icon = inst.type === 'school' ? School : Heart;

    return (
      <div className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${
        overallRisk === 'High' ? 'border-red-200' : overallRisk === 'Watch' ? 'border-amber-200' : 'border-slate-100'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              inst.type === 'school' ? 'bg-blue-50' : 'bg-pink-50'
            }`}>
              <Icon size={18} className={inst.type === 'school' ? 'text-blue-600' : 'text-pink-600'} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{inst.name}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <MapPin size={11} />
                {inst.area}
                <span>·</span>
                <Users size={11} />
                {inst.population.toLocaleString()} people
              </div>
            </div>
          </div>
          <RiskBadge risk={overallRisk} size="sm" pulse={overallRisk === 'High'} />
        </div>

        {/* Water supply chain */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <CheckCircle size={12} className="text-cyan-500 shrink-0" />
            <span className="text-xs text-slate-600 flex-1">Primary: {primarySite?.name ?? inst.primarySiteId}</span>
            <RiskBadge risk={primaryRisk} size="sm" />
          </div>
          {backupSite && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
              <CheckCircle size={12} className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500 flex-1">Backup: {backupSite.name}</span>
              <RiskBadge risk={backupRisk ?? 'Low'} size="sm" />
            </div>
          )}
          {!backupSite && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/60">
              <AlertTriangle size={12} className="text-amber-500 shrink-0" />
              <span className="text-xs text-amber-700">No backup supply recorded</span>
            </div>
          )}
        </div>

        <Link
          to={`/sites/${inst.primarySiteId}`}
          className="mt-3 flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
        >
          View primary water point <ArrowRight size={11} />
        </Link>
      </div>
    );
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Institutions</h1>
      <p className="text-slate-500 text-sm mb-8">
        Schools and clinics dependent on monitored water points, with their supply risk exposure.
      </p>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <School size={18} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-800">Schools ({schools.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schools.map(inst => <InstitutionCard key={inst.id} inst={inst} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart size={18} className="text-pink-600" />
          <h2 className="text-lg font-semibold text-slate-800">Health Facilities ({clinics.length})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinics.map(inst => <InstitutionCard key={inst.id} inst={inst} />)}
        </div>
      </section>
    </div>
  );
};
