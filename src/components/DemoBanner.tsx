import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DemoBanner: React.FC = () => (
  <div className="sticky top-0 z-50 h-8 bg-amber-400 flex items-center justify-center gap-2 text-amber-900 text-xs font-semibold px-4 shrink-0">
    <AlertTriangle size={13} />
    <span>Synthetic demo data — proposed and to be validated. Not for operational use.</span>
  </div>
);
