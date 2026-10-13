import { addDays, subDays, subHours } from 'date-fns';
import type {
  WaterSite, DailyReading, FaultEvent, Alert, AppUser, Institution,
  MaintenanceRecord, LabResult, AlternativeSupply, RuleThreshold,
  PilotStage, GlobalAuditLog, SMSAlert, AppSettings, Area, AuditEntry
} from '../types';

const NOW = new Date('2026-10-13T17:00:00Z');

// ─── Areas ───────────────────────────────────────────────────────────────────
export const AREAS: Area[] = [
  { id: 'kanyama', name: 'Kanyama', region: 'Lusaka West', population: 185000, description: 'High-density peri-urban township' },
  { id: 'chawama', name: 'Chawama', region: 'Lusaka South', population: 130000, description: 'Densely populated compound' },
  { id: 'matero', name: 'Matero', region: 'Lusaka Central-West', population: 155000, description: 'Large residential township' },
  { id: 'chilanga', name: 'Chilanga', region: 'Lusaka South', population: 48000, description: 'Peri-urban mixed area' },
  { id: 'chelston', name: 'Chelston', region: 'Lusaka East', population: 62000, description: 'Residential east suburb' },
  { id: 'ngombe', name: "Ng'ombe", region: 'Lusaka North', population: 98000, description: 'North peri-urban settlement' },
  { id: 'kalingalinga', name: 'Kalingalinga', region: 'Lusaka Central', population: 72000, description: 'Central informal settlement' },
  { id: 'misisi', name: 'Misisi', region: 'Lusaka South', population: 55000, description: 'Southern compound area' },
];

// ─── Water Sites ─────────────────────────────────────────────────────────────
export const WATER_SITES: WaterSite[] = [
  // Kanyama
  { id: 'site-01', name: 'Kanyama Borehole A', area: 'kanyama', type: 'borehole', coordinates: { lat: -15.4312, lng: 28.2698 }, capacityM3: 120, servedPopulation: 8500, lastUpdated: subHours(NOW, 3), institutionIds: ['inst-01'], operatorId: 'user-03' },
  { id: 'site-02', name: 'Kanyama Market Kiosk', area: 'kanyama', type: 'kiosk', coordinates: { lat: -15.4289, lng: 28.2721 }, capacityM3: 40, servedPopulation: 3200, lastUpdated: subHours(NOW, 28), institutionIds: [], operatorId: 'user-03' },
  { id: 'site-03', name: 'Kanyama Clinic Supply', area: 'kanyama', type: 'clinic_supply', coordinates: { lat: -15.4335, lng: 28.2657 }, capacityM3: 30, servedPopulation: 1200, lastUpdated: subHours(NOW, 6), institutionIds: ['inst-02'], operatorId: 'user-03' },
  // Chawama
  { id: 'site-04', name: 'Chawama Borehole B', area: 'chawama', type: 'borehole', coordinates: { lat: -15.4478, lng: 28.3012 }, capacityM3: 90, servedPopulation: 6700, lastUpdated: subHours(NOW, 1), institutionIds: [], operatorId: 'user-04' },
  { id: 'site-05', name: 'Chawama School Tap 1', area: 'chawama', type: 'school_tap', coordinates: { lat: -15.4501, lng: 28.2998 }, capacityM3: 15, servedPopulation: 850, lastUpdated: subHours(NOW, 52), institutionIds: ['inst-03'], operatorId: 'user-04' },
  { id: 'site-06', name: 'Chawama Kiosk Central', area: 'chawama', type: 'kiosk', coordinates: { lat: -15.4462, lng: 28.3045 }, capacityM3: 50, servedPopulation: 4100, lastUpdated: subHours(NOW, 2), institutionIds: [], operatorId: 'user-04' },
  // Matero
  { id: 'site-07', name: 'Matero Reservoir', area: 'matero', type: 'reservoir', coordinates: { lat: -15.3987, lng: 28.2891 }, capacityM3: 500, servedPopulation: 22000, lastUpdated: subHours(NOW, 4), institutionIds: ['inst-04', 'inst-05'], operatorId: 'user-05' },
  { id: 'site-08', name: 'Matero Borehole C', area: 'matero', type: 'borehole', coordinates: { lat: -15.4012, lng: 28.2934 }, capacityM3: 100, servedPopulation: 7200, lastUpdated: subHours(NOW, 8), institutionIds: [], operatorId: 'user-05' },
  { id: 'site-09', name: 'Matero School Tap 2', area: 'matero', type: 'school_tap', coordinates: { lat: -15.3965, lng: 28.2867 }, capacityM3: 20, servedPopulation: 1100, lastUpdated: subHours(NOW, 72), institutionIds: ['inst-04'], operatorId: 'user-05' },
  { id: 'site-10', name: 'Matero Clinic Supply 2', area: 'matero', type: 'clinic_supply', coordinates: { lat: -15.3942, lng: 28.2912 }, capacityM3: 35, servedPopulation: 2100, lastUpdated: subHours(NOW, 5), institutionIds: ['inst-05'], operatorId: 'user-05' },
  // Chilanga
  { id: 'site-11', name: 'Chilanga Borehole D', area: 'chilanga', type: 'borehole', coordinates: { lat: -15.5523, lng: 28.2671 }, capacityM3: 80, servedPopulation: 4500, lastUpdated: subHours(NOW, 10), institutionIds: [], operatorId: 'user-06' },
  { id: 'site-12', name: 'Chilanga School Tap', area: 'chilanga', type: 'school_tap', coordinates: { lat: -15.5544, lng: 28.2698 }, capacityM3: 12, servedPopulation: 650, lastUpdated: subHours(NOW, 2), institutionIds: ['inst-06'], operatorId: 'user-06' },
  // Chelston
  { id: 'site-13', name: 'Chelston Borehole E', area: 'chelston', type: 'borehole', coordinates: { lat: -15.3812, lng: 28.3421 }, capacityM3: 95, servedPopulation: 5800, lastUpdated: subHours(NOW, 6), institutionIds: [], operatorId: 'user-07' },
  { id: 'site-14', name: 'Chelston Kiosk East', area: 'chelston', type: 'kiosk', coordinates: { lat: -15.3789, lng: 28.3456 }, capacityM3: 45, servedPopulation: 3600, lastUpdated: subHours(NOW, 14), institutionIds: [], operatorId: 'user-07' },
  { id: 'site-15', name: 'Chelston Clinic Supply', area: 'chelston', type: 'clinic_supply', coordinates: { lat: -15.3834, lng: 28.3398 }, capacityM3: 28, servedPopulation: 1400, lastUpdated: subHours(NOW, 3), institutionIds: ['inst-07'], operatorId: 'user-07' },
  // Ng'ombe
  { id: 'site-16', name: "Ng'ombe Borehole F", area: 'ngombe', type: 'borehole', coordinates: { lat: -15.3601, lng: 28.3112 }, capacityM3: 110, servedPopulation: 7800, lastUpdated: subHours(NOW, 49), institutionIds: [], operatorId: 'user-08' },
  { id: 'site-17', name: "Ng'ombe Kiosk North", area: 'ngombe', type: 'kiosk', coordinates: { lat: -15.3578, lng: 28.3145 }, capacityM3: 55, servedPopulation: 4300, lastUpdated: subHours(NOW, 7), institutionIds: [], operatorId: 'user-08' },
  { id: 'site-18', name: "Ng'ombe School Tap", area: 'ngombe', type: 'school_tap', coordinates: { lat: -15.3623, lng: 28.3089 }, capacityM3: 18, servedPopulation: 920, lastUpdated: subHours(NOW, 2), institutionIds: ['inst-08'], operatorId: 'user-08' },
  // Kalingalinga
  { id: 'site-19', name: 'Kalingalinga Borehole G', area: 'kalingalinga', type: 'borehole', coordinates: { lat: -15.4123, lng: 28.3267 }, capacityM3: 75, servedPopulation: 5100, lastUpdated: subHours(NOW, 18), institutionIds: [], operatorId: 'user-04' },
  { id: 'site-20', name: 'Kalingalinga Kiosk', area: 'kalingalinga', type: 'kiosk', coordinates: { lat: -15.4098, lng: 28.3301 }, capacityM3: 38, servedPopulation: 2800, lastUpdated: subHours(NOW, 4), institutionIds: [], operatorId: 'user-04' },
  // Misisi
  { id: 'site-21', name: 'Misisi Borehole H', area: 'misisi', type: 'borehole', coordinates: { lat: -15.4567, lng: 28.3178 }, capacityM3: 70, servedPopulation: 4800, lastUpdated: subHours(NOW, 8), institutionIds: [], operatorId: 'user-06' },
  { id: 'site-22', name: 'Misisi Kiosk South', area: 'misisi', type: 'kiosk', coordinates: { lat: -15.4589, lng: 28.3201 }, capacityM3: 42, servedPopulation: 3300, lastUpdated: subHours(NOW, 6), institutionIds: [], operatorId: 'user-06' },
  { id: 'site-23', name: 'Misisi Clinic Supply', area: 'misisi', type: 'clinic_supply', coordinates: { lat: -15.4545, lng: 28.3156 }, capacityM3: 25, servedPopulation: 1100, lastUpdated: subHours(NOW, 3), institutionIds: ['inst-09'], operatorId: 'user-06' },
  // Extra sites
  { id: 'site-24', name: 'Lusaka Central Borehole', area: 'kalingalinga', type: 'borehole', coordinates: { lat: -15.4167, lng: 28.2833 }, capacityM3: 150, servedPopulation: 12000, lastUpdated: subHours(NOW, 1), institutionIds: [], operatorId: 'user-03' },
  { id: 'site-25', name: 'Kanyama Borehole B', area: 'kanyama', type: 'borehole', coordinates: { lat: -15.4356, lng: 28.2712 }, capacityM3: 85, servedPopulation: 6200, lastUpdated: subHours(NOW, 5), institutionIds: [], operatorId: 'user-03' },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export const USERS: AppUser[] = [
  { id: 'user-01', name: 'Mwila Banda', email: 'mwila.banda@nwasco.zm', role: 'Admin', active: true },
  { id: 'user-02', name: 'Chanda Mwale', email: 'chanda.mwale@nwasco.zm', role: 'Admin', active: true },
  { id: 'user-03', name: 'Esther Phiri', email: 'esther.phiri@lwsc.zm', role: 'Operator', area: 'kanyama', active: true },
  { id: 'user-04', name: 'Joseph Mbewe', email: 'joseph.mbewe@lwsc.zm', role: 'Operator', area: 'chawama', active: true },
  { id: 'user-05', name: 'Grace Lungu', email: 'grace.lungu@lwsc.zm', role: 'Operator', area: 'matero', active: true },
  { id: 'user-06', name: 'Patrick Zulu', email: 'patrick.zulu@lwsc.zm', role: 'Operator', area: 'chilanga', active: true },
  { id: 'user-07', name: 'Miriam Tembo', email: 'miriam.tembo@lwsc.zm', role: 'Operator', area: 'chelston', active: true },
  { id: 'user-08', name: 'Daniel Mutale', email: 'daniel.mutale@lwsc.zm', role: 'Viewer', area: 'ngombe', active: false },
];

// ─── Institutions ─────────────────────────────────────────────────────────────
export const INSTITUTIONS: Institution[] = [
  { id: 'inst-01', name: 'Kanyama Primary School', type: 'school', area: 'kanyama', primarySiteId: 'site-01', population: 1200, coordinates: { lat: -15.4318, lng: 28.2701 } },
  { id: 'inst-02', name: 'Kanyama Health Centre', type: 'clinic', area: 'kanyama', primarySiteId: 'site-03', backupSiteId: 'site-01', population: 450, coordinates: { lat: -15.4338, lng: 28.2661 } },
  { id: 'inst-03', name: 'Chawama Basic School', type: 'school', area: 'chawama', primarySiteId: 'site-05', backupSiteId: 'site-04', population: 850, coordinates: { lat: -15.4505, lng: 28.3001 } },
  { id: 'inst-04', name: 'Matero Boys Secondary', type: 'school', area: 'matero', primarySiteId: 'site-09', backupSiteId: 'site-07', population: 1100, coordinates: { lat: -15.3968, lng: 28.2870 } },
  { id: 'inst-05', name: 'Matero Level 1 Hospital', type: 'clinic', area: 'matero', primarySiteId: 'site-10', backupSiteId: 'site-07', population: 380, coordinates: { lat: -15.3945, lng: 28.2915 } },
  { id: 'inst-06', name: 'Chilanga Primary School', type: 'school', area: 'chilanga', primarySiteId: 'site-12', backupSiteId: 'site-11', population: 650, coordinates: { lat: -15.5547, lng: 28.2701 } },
  { id: 'inst-07', name: 'Chelston Clinic', type: 'clinic', area: 'chelston', primarySiteId: 'site-15', population: 280, coordinates: { lat: -15.3837, lng: 28.3401 } },
  { id: 'inst-08', name: "Ng'ombe Community School", type: 'school', area: 'ngombe', primarySiteId: 'site-18', backupSiteId: 'site-16', population: 920, coordinates: { lat: -15.3626, lng: 28.3092 } },
  { id: 'inst-09', name: 'Misisi Health Post', type: 'clinic', area: 'misisi', primarySiteId: 'site-23', backupSiteId: 'site-21', population: 210, coordinates: { lat: -15.4548, lng: 28.3159 } },
];

// ─── Reading Generation ───────────────────────────────────────────────────────
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateReadings(): DailyReading[] {
  const readings: DailyReading[] = [];
  let readingId = 1;

  WATER_SITES.forEach((site, siteIdx) => {
    const baseFlow = site.capacityM3 * 8 + seededRandom(siteIdx * 1000) * 20;
    const baseLevel = 0.6 + seededRandom(siteIdx * 2000) * 0.3;

    // Inject faults for specific sites
    const hasSustainedDrop = ['site-01', 'site-07', 'site-16'].includes(site.id);
    const hasRepeatedFaults = ['site-05', 'site-09', 'site-16'].includes(site.id);
    const hasDemandRise = ['site-02', 'site-06', 'site-19'].includes(site.id);
    const hasMissingData = ['site-09', 'site-16'].includes(site.id);
    const hasStaleData = ['site-02', 'site-14'].includes(site.id);

    for (let d = 89; d >= 0; d--) {
      const date = subDays(NOW, d);
      const dayIdx = 89 - d;
      const seed = siteIdx * 10000 + dayIdx;

      let flow: number | null = baseFlow * (0.85 + seededRandom(seed) * 0.3);
      let level: number | null = baseLevel * (0.9 + seededRandom(seed + 1) * 0.2);
      let usage: number | null = flow * (0.7 + seededRandom(seed + 2) * 0.25);
      let flag: DailyReading['qualityFlag'] = 'ok';
      let note: string | undefined;

      // Apply fault injections
      if (hasSustainedDrop && dayIdx > 60) {
        const dropFactor = 1 - ((dayIdx - 60) / 29) * 0.55;
        flow = flow * dropFactor;
        level = level * (0.95 + (dropFactor - 0.5) * 0.2);
      }
      if (hasDemandRise && dayIdx > 50) {
        usage = (usage ?? 0) * (1 + ((dayIdx - 50) / 39) * 0.45);
      }
      if (hasRepeatedFaults && (dayIdx % 12 === 0 || dayIdx % 17 === 0)) {
        flow = flow * 0.3;
        flag = 'implausible';
        note = 'Sudden flow drop – possible pump fault';
      }
      if (hasMissingData && seededRandom(seed + 5) < 0.15) {
        flow = null; level = null; usage = null;
        flag = 'missing';
        note = 'Reading not submitted';
      }
      if (hasStaleData && seededRandom(seed + 6) < 0.08) {
        flag = 'stale';
        note = 'Reading older than 48h detected';
      }
      if (flow !== null && (flow > baseFlow * 1.8 || flow < 0)) {
        flag = 'implausible';
        note = 'Value outside expected range';
      }

      readings.push({
        id: `rdg-${String(readingId++).padStart(5, '0')}`,
        siteId: site.id,
        date,
        flowLPH: flow !== null ? Math.round(flow) : null,
        levelM: level !== null ? Math.round(level * 100) / 100 : null,
        usageLPH: usage !== null ? Math.round(usage) : null,
        qualityFlag: flag,
        qualityNote: note,
        recordedBy: site.operatorId,
      });
    }
  });

  return readings;
}

// ─── Fault Events ──────────────────────────────────────────────────────────────
export const FAULT_EVENTS: FaultEvent[] = [
  { id: 'fault-01', siteId: 'site-01', date: subDays(NOW, 28), faultType: 'Pump failure', description: 'Primary pump stopped. Partial flow via backup.', resolvedDate: subDays(NOW, 25), resolvedBy: 'user-03' },
  { id: 'fault-02', siteId: 'site-01', date: subDays(NOW, 14), faultType: 'Pump failure', description: 'Backup pump also degraded. Flow at 45% capacity.' },
  { id: 'fault-03', siteId: 'site-01', date: subDays(NOW, 6), faultType: 'Pump failure', description: 'Third pump fault logged this month.' },
  { id: 'fault-04', siteId: 'site-05', date: subDays(NOW, 31), faultType: 'Pipe blockage', description: 'Sediment blockage reduced flow significantly.', resolvedDate: subDays(NOW, 29), resolvedBy: 'user-04' },
  { id: 'fault-05', siteId: 'site-05', date: subDays(NOW, 18), faultType: 'Meter fault', description: 'Flow meter reading implausible – may be faulty.' },
  { id: 'fault-06', siteId: 'site-05', date: subDays(NOW, 7), faultType: 'Pump failure', description: 'Repeated pump fault. Third event in 30 days.' },
  { id: 'fault-07', siteId: 'site-07', date: subDays(NOW, 22), faultType: 'Level sensor', description: 'Level sensor giving erratic readings.', resolvedDate: subDays(NOW, 20), resolvedBy: 'user-05' },
  { id: 'fault-08', siteId: 'site-07', date: subDays(NOW, 10), faultType: 'Supply reduction', description: 'Upstream reduction at main reservoir inlet.' },
  { id: 'fault-09', siteId: 'site-09', date: subDays(NOW, 45), faultType: 'Missing readings', description: 'No readings submitted for 3 consecutive days.' },
  { id: 'fault-10', siteId: 'site-16', date: subDays(NOW, 8), faultType: 'Pump failure', description: 'Submersible pump failure – site at risk.' },
  { id: 'fault-11', siteId: 'site-16', date: subDays(NOW, 20), faultType: 'Pump failure', description: 'Previous pump fault same month.' },
  { id: 'fault-12', siteId: 'site-16', date: subDays(NOW, 3), faultType: 'Missing readings', description: 'Data submission gap >48h.' },
];

// ─── Generate Alerts ──────────────────────────────────────────────────────────
function makeAudit(userId: string, action: string, details: string, daysAgo: number): AuditEntry {
  return { id: `audit-${Math.random().toString(36).slice(2, 8)}`, timestamp: subDays(NOW, daysAgo), userId, action, details };
}

export const ALERTS: Alert[] = [
  {
    id: 'alert-01', siteId: 'site-01', riskLevel: 'High', status: 'actioned', outcome: 'correct',
    title: 'Sustained flow drop – Kanyama Borehole A',
    description: 'Flow has dropped 52% below 14-day baseline over the past 29 days. Three pump faults logged.',
    reasons: ['Flow 52% below 14-day baseline (sustained ≥14 days)', '3 pump faults within 30 days', 'Demand relatively stable – not demand-side reduction'],
    confidence: 78, dataFreshnessNote: 'Last reading 3 hours ago.',
    recommendedStep: 'Dispatch technician to inspect pump. Check alternative supply options.',
    createdAt: subDays(NOW, 7), assignedTo: 'user-03', assignedAt: subDays(NOW, 6),
    verifiedAt: subDays(NOW, 5), verifiedBy: 'user-03',
    actionTaken: 'Technician dispatched. Backup pump order placed.', actionAt: subDays(NOW, 4),
    closedAt: subDays(NOW, 2), closedBy: 'user-01',
    auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine flagged sustained flow drop', 7),
      makeAudit('user-01', 'Assigned', 'Assigned to Esther Phiri (Operator, Kanyama)', 6),
      makeAudit('user-03', 'Verified', 'Site visited – pump confirmed degraded', 5),
      makeAudit('user-03', 'Action taken', 'Backup pump ordered, tanker arranged', 4),
      makeAudit('user-01', 'Closed', 'Outcome: Correct – shortage averted with intervention', 2),
    ],
  },
  {
    id: 'alert-02', siteId: 'site-07', riskLevel: 'High', status: 'assigned', outcome: 'pending',
    title: 'Flow drop + sensor issues – Matero Reservoir',
    description: 'Reservoir inflow has declined 38% over 22 days. Level sensor previously erratic.',
    reasons: ['Inflow 38% below 14-day baseline (sustained ≥14 days)', 'Level sensor fault history reduces confidence', 'Serving 22,000 people and 2 institutions'],
    confidence: 65, dataFreshnessNote: 'Last reading 4 hours ago.',
    recommendedStep: 'Verify sensor accuracy on-site. Cross-check inflow logs with upstream station.',
    createdAt: subDays(NOW, 4), assignedTo: 'user-05', assignedAt: subDays(NOW, 3),
    auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine flagged inflow decline', 4),
      makeAudit('user-01', 'Assigned', 'Assigned to Grace Lungu (Operator, Matero)', 3),
    ],
  },
  {
    id: 'alert-03', siteId: 'site-05', riskLevel: 'High', status: 'verified', outcome: 'pending',
    title: 'Repeated pump faults – Chawama School Tap',
    description: '3 pump faults in 30 days. School with 850 students. Current reading is stale (>48h).',
    reasons: ['3 fault events within 30 days', 'Stale data lowers confidence', 'School institution at risk'],
    confidence: 58, dataFreshnessNote: 'Last reading 52 hours ago – data stale.',
    recommendedStep: 'Contact school administration. Arrange alternative supply. Inspect pump.',
    createdAt: subDays(NOW, 5), assignedTo: 'user-04', assignedAt: subDays(NOW, 4),
    verifiedAt: subDays(NOW, 2), verifiedBy: 'user-04',
    auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine: repeated faults detected', 5),
      makeAudit('user-01', 'Assigned', 'Assigned to Joseph Mbewe', 4),
      makeAudit('user-04', 'Verified', 'Site visited – pump intermittently failing', 2),
    ],
  },
  {
    id: 'alert-04', siteId: 'site-16', riskLevel: 'High', status: 'open', outcome: 'pending',
    title: "Pump failure + stale data – Ng'ombe Borehole F",
    description: "Submersible pump failure logged. Data gap >49h. Serving 7,800 people.",
    reasons: ['Pump failure logged 8 days ago', 'Data gap >48h lowers confidence significantly', '2 faults in 30 days'],
    confidence: 45, dataFreshnessNote: 'Last reading 49 hours ago – STALE. Data quality warning active.',
    recommendedStep: 'Urgent: verify site status. Data gap may mask severity. Alert community water committee.',
    createdAt: subDays(NOW, 1), auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine: pump fault + stale data', 1),
    ],
  },
  {
    id: 'alert-05', siteId: 'site-02', riskLevel: 'Watch', status: 'open', outcome: 'pending',
    title: 'Demand rising, supply stable – Kanyama Market Kiosk',
    description: 'Usage has risen 38% over 39 days while supply is unchanged. Risk of gap widening.',
    reasons: ['Demand rising 38% over baseline', 'Supply unchanged – gap risk increasing', 'Stale reading detected'],
    confidence: 71, dataFreshnessNote: 'Last reading 28 hours ago.',
    recommendedStep: 'Monitor daily. Investigate if population increase or seasonal factor. No immediate action required.',
    createdAt: subDays(NOW, 3), auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine: demand-supply gap widening', 3),
    ],
  },
  {
    id: 'alert-06', siteId: 'site-09', riskLevel: 'Watch', status: 'open', outcome: 'pending',
    title: 'Missing data – Matero School Tap',
    description: 'Multiple missing readings over past 45 days. School of 1,100 students. Risk assessment uncertain.',
    reasons: ['15% of readings missing in 90 days', 'Cannot assess trend without complete data', 'School institution flagged'],
    confidence: 30, dataFreshnessNote: 'Last reading 72 hours ago – STALE.',
    recommendedStep: 'Re-establish regular data submission. Manually verify site status.',
    createdAt: subDays(NOW, 2), auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine: excessive missing data', 2),
    ],
  },
  {
    id: 'alert-07', siteId: 'site-19', riskLevel: 'Watch', status: 'assigned', outcome: 'pending',
    title: 'Demand rising – Kalingalinga Borehole G',
    description: 'Usage up 35% over 39 days. Borehole serving 5,100 people approaching capacity.',
    reasons: ['Demand rising 35% over baseline', 'Borehole near rated capacity', 'Continued rise may require additional supply'],
    confidence: 74, dataFreshnessNote: 'Last reading 18 hours ago.',
    recommendedStep: 'Plan for demand-management intervention. Evaluate supplementary sources.',
    createdAt: subDays(NOW, 6), assignedTo: 'user-04', assignedAt: subDays(NOW, 5),
    auditTrail: [
      makeAudit('system', 'Alert created', 'Rule engine: demand trend', 6),
      makeAudit('user-01', 'Assigned', 'Assigned to Joseph Mbewe', 5),
    ],
  },
  {
    id: 'alert-08', siteId: 'site-06', riskLevel: 'Watch', status: 'closed', outcome: 'false_alarm',
    title: 'Demand spike – Chawama Kiosk Central',
    description: 'Usage spike detected. Subsequent investigation found community event (not structural).',
    reasons: ['Usage 45% above baseline (single day)', 'Pattern returned to normal next day'],
    confidence: 82, dataFreshnessNote: 'Last reading 2 hours ago.',
    recommendedStep: 'Closed – false alarm confirmed.',
    createdAt: subDays(NOW, 14), assignedTo: 'user-04', assignedAt: subDays(NOW, 13),
    verifiedAt: subDays(NOW, 12), verifiedBy: 'user-04',
    actionTaken: 'Community event confirmed as cause. No structural issue.',
    actionAt: subDays(NOW, 12), closedAt: subDays(NOW, 11), closedBy: 'user-01',
    auditTrail: [
      makeAudit('system', 'Alert created', 'Single-day usage spike', 14),
      makeAudit('user-01', 'Assigned', 'Assigned for verification', 13),
      makeAudit('user-04', 'Verified', 'Community event – not a fault', 12),
      makeAudit('user-01', 'Closed', 'Outcome: False alarm', 11),
    ],
  },
  {
    id: 'alert-09', siteId: 'site-11', riskLevel: 'Low', status: 'closed', outcome: 'correct',
    title: 'Minor flow variation – Chilanga Borehole D',
    description: 'Brief 12% flow drop. Verified as seasonal – resolved.',
    reasons: ['Flow drop 12% below baseline (3 days only)', 'No fault events', 'Seasonal pattern confirmed'],
    confidence: 88, dataFreshnessNote: 'Last reading 10 hours ago.',
    recommendedStep: 'Closed – seasonal variation confirmed.',
    createdAt: subDays(NOW, 20), closedAt: subDays(NOW, 18), closedBy: 'user-01',
    auditTrail: [makeAudit('system', 'Alert created', 'Minor flow drop', 20), makeAudit('user-01', 'Closed', 'Seasonal variation – no action needed', 18)],
  },
  {
    id: 'alert-10', siteId: 'site-14', riskLevel: 'Watch', status: 'open', outcome: 'pending',
    title: 'Stale data – Chelston Kiosk East',
    description: 'Reading gap detected. Stale data flag active. Risk assessment has low confidence.',
    reasons: ['Stale reading (>14h gap)', 'Cannot confirm current status'],
    confidence: 40, dataFreshnessNote: 'Last reading 14 hours ago – approaching stale threshold.',
    recommendedStep: 'Prompt operator to submit current reading.',
    createdAt: subDays(NOW, 1), auditTrail: [makeAudit('system', 'Alert created', 'Stale data flag', 1)],
  },
];

// ─── Maintenance Records ───────────────────────────────────────────────────────
export const MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  { id: 'maint-01', siteId: 'site-01', type: 'reactive', status: 'in_progress', title: 'Pump replacement – Kanyama BH A', description: 'Replace degraded backup pump. Parts ordered.', scheduledDate: addDays(NOW, 2), assignedTo: 'user-03', linkedFaultId: 'fault-02', cost: 4500 },
  { id: 'maint-02', siteId: 'site-01', type: 'planned', status: 'scheduled', title: 'Quarterly service – Kanyama BH A', description: 'Routine quarterly pump and pipe inspection.', scheduledDate: addDays(NOW, 30), assignedTo: 'user-03', cost: 1200 },
  { id: 'maint-03', siteId: 'site-05', type: 'reactive', status: 'scheduled', title: 'Pump repair – Chawama School Tap', description: 'Repeated pump failures require full inspection.', scheduledDate: addDays(NOW, 1), assignedTo: 'user-04', linkedFaultId: 'fault-06', cost: 2800 },
  { id: 'maint-04', siteId: 'site-07', type: 'reactive', status: 'scheduled', title: 'Sensor calibration – Matero Reservoir', description: 'Level sensor to be re-calibrated.', scheduledDate: addDays(NOW, 5), assignedTo: 'user-05', linkedFaultId: 'fault-07', cost: 650 },
  { id: 'maint-05', siteId: 'site-07', type: 'planned', status: 'scheduled', title: 'Reservoir cleaning – Matero', description: 'Annual sediment removal and inspection.', scheduledDate: addDays(NOW, 45), assignedTo: 'user-05', cost: 8000 },
  { id: 'maint-06', siteId: 'site-16', type: 'reactive', status: 'overdue', title: 'Submersible pump – Ngombe BH F', description: 'Pump failed 8 days ago. Repair overdue.', scheduledDate: subDays(NOW, 3), assignedTo: 'user-08', linkedFaultId: 'fault-10', cost: 6200 },
  { id: 'maint-07', siteId: 'site-09', type: 'planned', status: 'overdue', title: 'Data logger service – Matero School Tap', description: 'Data logger causing missed readings.', scheduledDate: subDays(NOW, 10), assignedTo: 'user-05', cost: 320 },
  { id: 'maint-08', siteId: 'site-13', type: 'planned', status: 'completed', title: 'Annual service – Chelston BH E', description: 'Completed annual service successfully.', scheduledDate: subDays(NOW, 15), completedDate: subDays(NOW, 14), assignedTo: 'user-07', cost: 1800 },
];

// ─── Lab Results ──────────────────────────────────────────────────────────────
export const LAB_RESULTS: LabResult[] = [
  { id: 'lab-01', siteId: 'site-01', collectedDate: subDays(NOW, 30), receivedDate: subDays(NOW, 28), parameter: 'Turbidity', value: 1.2, unit: 'NTU', testedBy: 'user-01', labName: 'NWASCO Reference Lab', notes: 'Sample collected per SOP-07. No safety verdict issued by this system.' },
  { id: 'lab-02', siteId: 'site-01', collectedDate: subDays(NOW, 30), receivedDate: subDays(NOW, 28), parameter: 'pH', value: 7.1, unit: 'pH', testedBy: 'user-01', labName: 'NWASCO Reference Lab', notes: 'Record only – interpretation by qualified laboratory.' },
  { id: 'lab-03', siteId: 'site-07', collectedDate: subDays(NOW, 21), receivedDate: subDays(NOW, 19), parameter: 'Turbidity', value: 2.8, unit: 'NTU', testedBy: 'user-02', labName: 'LWSC Lab Lusaka', notes: 'Elevated turbidity noted – refer to qualified laboratory for interpretation.' },
  { id: 'lab-04', siteId: 'site-07', collectedDate: subDays(NOW, 21), receivedDate: subDays(NOW, 19), parameter: 'pH', value: 6.8, unit: 'pH', testedBy: 'user-02', labName: 'LWSC Lab Lusaka', notes: 'Record only.' },
  { id: 'lab-05', siteId: 'site-16', collectedDate: subDays(NOW, 14), receivedDate: subDays(NOW, 12), parameter: 'Turbidity', value: 4.1, unit: 'NTU', testedBy: 'user-02', labName: 'NWASCO Reference Lab', notes: 'Record only – no verdict by AquaReserve.' },
];

// ─── Alternative Supplies ──────────────────────────────────────────────────────
export const ALT_SUPPLIES: AlternativeSupply[] = [
  { id: 'alt-01', siteId: 'site-01', type: 'tanker', description: 'LWSC Emergency Tanker – 10,000L capacity', distanceKm: 12, capacityM3PerDay: 20, contactName: 'LWSC Emergency Line', contactPhone: '+260 211 226741', lastVerified: subDays(NOW, 5), active: true },
  { id: 'alt-02', siteId: 'site-01', type: 'borehole', description: 'Kanyama Borehole B (site-25) – 1.2km away', distanceKm: 1.2, capacityM3PerDay: 60, contactName: 'Esther Phiri', contactPhone: '+260 97 1234567', lastVerified: subDays(NOW, 2), active: true },
  { id: 'alt-03', siteId: 'site-05', type: 'kiosk', description: 'Chawama Kiosk Central – 0.8km from school', distanceKm: 0.8, capacityM3PerDay: 30, contactName: 'Joseph Mbewe', contactPhone: '+260 97 7654321', lastVerified: subDays(NOW, 10), active: true },
  { id: 'alt-04', siteId: 'site-07', type: 'tanker', description: 'Ministry of Water tanker (weekly)', distanceKm: 18, capacityM3PerDay: 25, contactName: 'MoWS Dispatch', contactPhone: '+260 211 254601', lastVerified: subDays(NOW, 14), active: false },
  { id: 'alt-05', siteId: 'site-16', type: 'borehole', description: "Ng'ombe Kiosk North – 0.5km", distanceKm: 0.5, capacityM3PerDay: 40, contactName: 'Daniel Mutale', contactPhone: '+260 96 1111222', lastVerified: subDays(NOW, 7), active: true },
];

// ─── Rule Thresholds ──────────────────────────────────────────────────────────
export const DEFAULT_THRESHOLDS: RuleThreshold[] = [
  { id: 'rule-01', name: 'Flow drop threshold', description: 'Percentage drop below 14-day baseline that triggers a Watch flag', value: 20, min: 5, max: 50, unit: '%', category: 'flow' },
  { id: 'rule-02', name: 'Flow drop High threshold', description: 'Percentage drop below 14-day baseline that triggers a High flag', value: 40, min: 20, max: 70, unit: '%', category: 'flow' },
  { id: 'rule-03', name: 'Sustained drop duration', description: 'Number of consecutive days the flow drop must persist to count', value: 14, min: 3, max: 30, unit: 'days', category: 'flow' },
  { id: 'rule-04', name: 'Fault count (Watch)', description: 'Number of faults in 30 days triggering Watch', value: 2, min: 1, max: 5, unit: 'faults', category: 'fault' },
  { id: 'rule-05', name: 'Fault count (High)', description: 'Number of faults in 30 days triggering High', value: 3, min: 2, max: 8, unit: 'faults', category: 'fault' },
  { id: 'rule-06', name: 'Demand rise threshold', description: 'Percentage demand increase over baseline triggering Watch', value: 25, min: 10, max: 60, unit: '%', category: 'demand' },
  { id: 'rule-07', name: 'Stale data hours', description: 'Hours without a new reading before data is flagged as stale', value: 48, min: 12, max: 120, unit: 'hours', category: 'data' },
  { id: 'rule-08', name: 'Missing data % (Watch)', description: 'Percentage of missing readings in 30 days triggering a Watch', value: 10, min: 5, max: 30, unit: '%', category: 'data' },
];

// ─── Pilot Plan ────────────────────────────────────────────────────────────────
export const PILOT_STAGES: PilotStage[] = [
  { id: 'pilot-01', order: 1, name: 'Discovery & Stakeholder Alignment', description: 'Engage NWASCO, LWSC and community water committees. Define scope and success criteria.', status: 'completed', startDate: new Date('2026-01-15'), endDate: new Date('2026-02-28'), deliverables: ['Stakeholder register', 'Scope document', 'Data inventory'] },
  { id: 'pilot-02', order: 2, name: 'Data Audit', description: 'Review existing monitoring data. Identify gaps, quality issues, and coverage.', status: 'completed', startDate: new Date('2026-03-01'), endDate: new Date('2026-04-15'), deliverables: ['Data quality report', 'Gap analysis', 'Coverage map'] },
  { id: 'pilot-03', order: 3, name: 'Prototype Development', description: 'Build AquaReserve prototype with rule engine and synthetic data. Validate with operators.', status: 'active', startDate: new Date('2026-04-16'), endDate: new Date('2026-07-31'), deliverables: ['Working prototype', 'Rule documentation', 'Operator feedback'] },
  { id: 'pilot-04', order: 4, name: 'Field Pilot', description: 'Deploy with real data from 5 sites in Kanyama. Operators use system alongside normal workflow.', status: 'planned', startDate: new Date('2026-08-01'), endDate: new Date('2026-10-31'), deliverables: ['Live deployment', 'Operator logs', 'Alert verification records'] },
  { id: 'pilot-05', order: 5, name: 'Evaluation', description: 'Analyse alert accuracy, response times, operator adoption and system limitations.', status: 'planned', startDate: new Date('2026-11-01'), endDate: new Date('2026-12-15'), deliverables: ['Evaluation report', 'Lessons learned', 'Recommendation'] },
  { id: 'pilot-06', order: 6, name: 'Decision Gate', description: 'NWASCO and LWSC leadership review pilot results. Decision: scale, modify, or discontinue.', status: 'planned', startDate: new Date('2026-12-16'), endDate: new Date('2026-12-31'), deliverables: ['Decision document', 'Scale-up plan (if approved)'] },
];

// ─── Global Audit Log ─────────────────────────────────────────────────────────
export const GLOBAL_AUDIT_LOG: GlobalAuditLog[] = [
  { id: 'gal-001', timestamp: subDays(NOW, 7), userId: 'system', entityType: 'Alert', entityId: 'alert-01', action: 'CREATED', details: 'Rule engine generated High alert for site-01' },
  { id: 'gal-002', timestamp: subDays(NOW, 6), userId: 'user-01', entityType: 'Alert', entityId: 'alert-01', action: 'ASSIGNED', details: 'Alert assigned to user-03 (Esther Phiri)' },
  { id: 'gal-003', timestamp: subDays(NOW, 5), userId: 'user-03', entityType: 'Alert', entityId: 'alert-01', action: 'VERIFIED', details: 'On-site verification completed' },
  { id: 'gal-004', timestamp: subDays(NOW, 4), userId: 'user-03', entityType: 'Alert', entityId: 'alert-01', action: 'ACTION_TAKEN', details: 'Backup pump ordered, tanker arranged' },
  { id: 'gal-005', timestamp: subDays(NOW, 2), userId: 'user-01', entityType: 'Alert', entityId: 'alert-01', action: 'CLOSED', details: 'Outcome recorded: Correct' },
  { id: 'gal-006', timestamp: subDays(NOW, 4), userId: 'system', entityType: 'Alert', entityId: 'alert-02', action: 'CREATED', details: 'Rule engine generated High alert for site-07' },
  { id: 'gal-007', timestamp: subDays(NOW, 3), userId: 'user-01', entityType: 'Alert', entityId: 'alert-02', action: 'ASSIGNED', details: 'Assigned to user-05 (Grace Lungu)' },
  { id: 'gal-008', timestamp: subDays(NOW, 14), userId: 'system', entityType: 'Alert', entityId: 'alert-08', action: 'CREATED', details: 'Usage spike detected at site-06' },
  { id: 'gal-009', timestamp: subDays(NOW, 11), userId: 'user-01', entityType: 'Alert', entityId: 'alert-08', action: 'CLOSED', details: 'Outcome: False alarm – community event' },
  { id: 'gal-010', timestamp: subDays(NOW, 1), userId: 'system', entityType: 'Alert', entityId: 'alert-04', action: 'CREATED', details: 'Pump failure + stale data at site-16' },
  { id: 'gal-011', timestamp: subDays(NOW, 20), userId: 'user-01', entityType: 'RuleThreshold', entityId: 'rule-01', action: 'UPDATED', details: 'Flow drop Watch threshold changed from 15% to 20%' },
  { id: 'gal-012', timestamp: subDays(NOW, 3), userId: 'user-03', entityType: 'Reading', entityId: 'rdg-01234', action: 'CREATED', details: 'Manual reading submitted for site-01' },
  { id: 'gal-013', timestamp: subDays(NOW, 1), userId: 'user-04', entityType: 'MaintenanceRecord', entityId: 'maint-03', action: 'UPDATED', details: 'Maintenance status updated to scheduled' },
  { id: 'gal-014', timestamp: subDays(NOW, 0), userId: 'user-01', entityType: 'User', entityId: 'user-08', action: 'DEACTIVATED', details: 'User account deactivated – pending reassignment' },
];

// ─── SMS Alerts ────────────────────────────────────────────────────────────────
export const SMS_ALERTS: SMSAlert[] = [
  { id: 'sms-01', alertId: 'alert-01', recipient: '+260 97 1234567', message: 'AQUARESERVE: HIGH risk – Kanyama BH A. Flow drop 52%. Action required. Call: 211-226741', sentAt: subDays(NOW, 7), status: 'delivered' },
  { id: 'sms-02', alertId: 'alert-02', recipient: '+260 96 9876543', message: 'AQUARESERVE: HIGH risk – Matero Reservoir. Inflow decline 38%. Verify sensor. Call: 211-226741', sentAt: subDays(NOW, 4), status: 'delivered' },
  { id: 'sms-03', alertId: 'alert-03', recipient: '+260 97 7654321', message: 'AQUARESERVE: HIGH risk – Chawama School Tap. 3 pump faults. School at risk. Action needed.', sentAt: subDays(NOW, 5), status: 'delivered' },
  { id: 'sms-04', alertId: 'alert-04', recipient: '+260 96 1111222', message: 'AQUARESERVE: HIGH risk – Ngombe BH F. Pump failure + data gap. Urgent verification needed.', sentAt: subDays(NOW, 1), status: 'sent' },
];

// ─── App Settings ─────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: AppSettings = {
  notificationEmail: true,
  notificationSMS: false,
  units: 'metric',
  alertThrottleHours: 6,
  dataStaleHours: 48,
};

// ─── Export all readings ───────────────────────────────────────────────────────
export const ALL_READINGS: DailyReading[] = generateReadings();

// ─── Notifications ─────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'alert' | 'maintenance' | 'data' | 'system';
  linkTo?: string;
}

export const NOTIFICATIONS: Notification[] = [
  { id: 'notif-01', title: 'New High Risk Alert', message: "Ng'ombe Borehole F – pump failure with data gap", timestamp: subDays(NOW, 1), read: false, type: 'alert', linkTo: '/alerts/alert-04' },
  { id: 'notif-02', title: 'Maintenance Overdue', message: "Ng'ombe BH F pump repair is 3 days overdue", timestamp: subDays(NOW, 1), read: false, type: 'maintenance', linkTo: '/maintenance' },
  { id: 'notif-03', title: 'Stale Data Detected', message: 'Matero School Tap last reading 72h ago', timestamp: subDays(NOW, 1), read: true, type: 'data', linkTo: '/data/quality' },
  { id: 'notif-04', title: 'Alert Assigned to You', message: 'Matero Reservoir – action required', timestamp: subDays(NOW, 3), read: true, type: 'alert', linkTo: '/alerts/alert-02' },
];
