import type { RiskAssessment, DailyReading, FaultEvent, RuleThreshold } from '../types';
import { subDays } from 'date-fns';

const NOW = new Date('2026-10-13T17:00:00Z');

// ─── Rule Engine ─────────────────────────────────────────────────────────────
// Transparent, no ML. Returns risk level, confidence and reasons per site.
// Missing/stale/implausible data LOWERS confidence and shows a warning.

export function computeRisk(
  siteId: string,
  readings: DailyReading[],
  faults: FaultEvent[],
  thresholds: RuleThreshold[],
  lastUpdated: Date,
): RiskAssessment {
  const siteReadings = readings
    .filter(r => r.siteId === siteId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const reasons: string[] = [];
  const warnings: string[] = [];
  let riskScore = 0; // 0 = Low, 1 = Watch, 2 = High
  let confidence = 100;

  // ─── Threshold helpers ────────────────────────────────────────────────────
  const getThreshold = (id: string) =>
    thresholds.find(t => t.id === id)?.value ?? 0;

  const flowDropWatch = getThreshold('rule-01');
  const flowDropHigh = getThreshold('rule-02');
  const sustainedDays = getThreshold('rule-03');
  const faultWatch = getThreshold('rule-04');
  const faultHigh = getThreshold('rule-05');
  const demandRise = getThreshold('rule-06');
  const staleHours = getThreshold('rule-07');
  const missingPct = getThreshold('rule-08');

  // ─── Data freshness check ─────────────────────────────────────────────────
  const hoursOld = (NOW.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
  if (hoursOld > staleHours) {
    warnings.push(`Data stale: last reading ${Math.round(hoursOld)}h ago (threshold: ${staleHours}h). Confidence reduced.`);
    confidence -= 30;
  } else if (hoursOld > staleHours * 0.6) {
    warnings.push(`Data approaching stale: last reading ${Math.round(hoursOld)}h ago.`);
    confidence -= 10;
  }

  // ─── Missing data check ───────────────────────────────────────────────────
  const last30 = siteReadings.slice(0, 30);
  const missingCount = last30.filter(r => r.qualityFlag === 'missing').length;
  const missingRate = last30.length > 0 ? (missingCount / last30.length) * 100 : 0;
  if (missingRate > missingPct) {
    warnings.push(`${Math.round(missingRate)}% of readings in last 30 days are missing (threshold: ${missingPct}%). Risk assessment is uncertain.`);
    confidence -= 25;
    if (missingRate > 20) {
      riskScore = Math.max(riskScore, 1);
      reasons.push(`High missing-data rate (${Math.round(missingRate)}%) – cannot confirm site status`);
    }
  }

  // ─── Implausible data ─────────────────────────────────────────────────────
  const implausibleCount = last30.filter(r => r.qualityFlag === 'implausible').length;
  if (implausibleCount > 2) {
    warnings.push(`${implausibleCount} implausible readings in last 30 days. Sensor accuracy uncertain.`);
    confidence -= 15;
  }

  // ─── Rule 1: Sustained flow drop vs 14-day baseline ─────────────────────
  const validFlow = siteReadings.filter(r => r.flowLPH !== null && r.qualityFlag === 'ok');
  if (validFlow.length >= 14) {
    const baseline14 = validFlow
      .slice(14, 28)
      .reduce((sum, r) => sum + (r.flowLPH ?? 0), 0) / Math.max(validFlow.slice(14, 28).length, 1);

    if (baseline14 > 0) {
      // Check if recent days show sustained drop
      const recentFlows = validFlow.slice(0, sustainedDays);
      const sustainedDropDays = recentFlows.filter(
        r => ((baseline14 - (r.flowLPH ?? 0)) / baseline14) * 100 >= flowDropWatch
      ).length;

      if (sustainedDropDays >= sustainedDays) {
        const recentAvg = recentFlows.reduce((s, r) => s + (r.flowLPH ?? 0), 0) / recentFlows.length;
        const dropPct = Math.round(((baseline14 - recentAvg) / baseline14) * 100);

        if (dropPct >= flowDropHigh) {
          riskScore = Math.max(riskScore, 2);
          reasons.push(`Flow ${dropPct}% below 14-day baseline for ≥${sustainedDays} consecutive days (High threshold: ${flowDropHigh}%)`);
        } else {
          riskScore = Math.max(riskScore, 1);
          reasons.push(`Flow ${dropPct}% below 14-day baseline for ≥${sustainedDays} days (Watch threshold: ${flowDropWatch}%)`);
        }
      }
    }
  } else {
    warnings.push('Insufficient valid flow readings for baseline comparison (<14 valid readings).');
    confidence -= 20;
  }

  // ─── Rule 2: Repeated fault events in 30 days ────────────────────────────
  const faultCutoff = subDays(NOW, 30);
  const recentFaults = faults.filter(
    f => f.siteId === siteId && f.date >= faultCutoff
  );
  if (recentFaults.length >= faultHigh) {
    riskScore = Math.max(riskScore, 2);
    reasons.push(`${recentFaults.length} fault events in past 30 days (High threshold: ${faultHigh})`);
  } else if (recentFaults.length >= faultWatch) {
    riskScore = Math.max(riskScore, 1);
    reasons.push(`${recentFaults.length} fault event(s) in past 30 days (Watch threshold: ${faultWatch})`);
  }

  // ─── Rule 3: Demand rising while supply falls ─────────────────────────────
  const validUsage = siteReadings.filter(r => r.usageLPH !== null && r.flowLPH !== null && r.qualityFlag === 'ok');
  if (validUsage.length >= 30) {
    const baseline30Usage = validUsage.slice(30, 60).reduce((s, r) => s + (r.usageLPH ?? 0), 0) / Math.max(validUsage.slice(30, 60).length, 1);
    const recentUsage = validUsage.slice(0, 14).reduce((s, r) => s + (r.usageLPH ?? 0), 0) / Math.max(validUsage.slice(0, 14).length, 1);

    if (baseline30Usage > 0) {
      const usageRise = ((recentUsage - baseline30Usage) / baseline30Usage) * 100;
      if (usageRise >= demandRise) {
        riskScore = Math.max(riskScore, 1);
        reasons.push(`Demand rising ${Math.round(usageRise)}% above 30-day baseline (Watch threshold: ${demandRise}%)`);
      }
    }
  }

  // ─── Clamp confidence ─────────────────────────────────────────────────────
  confidence = Math.max(10, Math.min(100, confidence));

  // ─── Map score to risk ─────────────────────────────────────────────────────
  const risk = riskScore === 2 ? 'High' : riskScore === 1 ? 'Watch' : 'Low';

  if (reasons.length === 0) {
    reasons.push('No threshold breaches detected in current data window');
  }

  return {
    siteId,
    risk,
    confidence,
    reasons,
    warnings,
    computedAt: NOW,
  };
}

// ─── Batch compute all sites ──────────────────────────────────────────────────
export function computeAllRisks(
  sites: { id: string; lastUpdated: Date }[],
  readings: DailyReading[],
  faults: FaultEvent[],
  thresholds: RuleThreshold[],
): Record<string, RiskAssessment> {
  const result: Record<string, RiskAssessment> = {};
  sites.forEach(site => {
    result[site.id] = computeRisk(site.id, readings, faults, thresholds, site.lastUpdated);
  });
  return result;
}
