import React from 'react';
import type { RiskLevel } from '../types';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const config: Record<RiskLevel, { bg: string; text: string; dot: string; label: string }> = {
  High:  { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    label: 'HIGH' },
  Watch: { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'WATCH' },
  Low:   { bg: 'bg-emerald-100',text: 'text-emerald-700',dot: 'bg-emerald-500',label: 'LOW' },
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, size = 'md', pulse = false }) => {
  const c = config[risk];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${c.bg} ${c.text} ${sizes[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${pulse && risk === 'High' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
};
