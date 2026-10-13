// ─── Core Types ────────────────────────────────────────────────────────────────

export type RiskLevel = 'Low' | 'Watch' | 'High';
export type SiteType = 'borehole' | 'kiosk' | 'school_tap' | 'clinic_supply' | 'reservoir';
export type AlertStatus = 'open' | 'assigned' | 'verified' | 'actioned' | 'closed';
export type AlertOutcome = 'pending' | 'correct' | 'false_alarm' | 'missed';
export type UserRole = 'Admin' | 'Operator' | 'Viewer';
export type DataQualityFlag = 'ok' | 'missing' | 'stale' | 'implausible';
export type MaintenanceType = 'planned' | 'reactive';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export interface LatLng { lat: number; lng: number; }

export interface WaterSite {
  id: string;
  name: string;
  area: string;
  type: SiteType;
  coordinates: LatLng;
  capacityM3: number;
  servedPopulation: number;
  lastUpdated: Date;
  institutionIds: string[];
  operatorId: string;
}

export interface DailyReading {
  id: string;
  siteId: string;
  date: Date;
  flowLPH: number | null;       // litres per hour
  levelM: number | null;        // water level in metres
  usageLPH: number | null;      // usage litres per hour
  qualityFlag: DataQualityFlag;
  qualityNote?: string;
  recordedBy: string;
}

export interface FaultEvent {
  id: string;
  siteId: string;
  date: Date;
  faultType: string;
  description: string;
  resolvedDate?: Date;
  resolvedBy?: string;
}

export interface RiskAssessment {
  siteId: string;
  risk: RiskLevel;
  confidence: number;  // 0-100
  reasons: string[];
  warnings: string[];
  computedAt: Date;
}

export interface Alert {
  id: string;
  siteId: string;
  riskLevel: RiskLevel;
  status: AlertStatus;
  outcome: AlertOutcome;
  title: string;
  description: string;
  reasons: string[];
  confidence: number;
  createdAt: Date;
  assignedTo?: string;
  assignedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  actionTaken?: string;
  actionAt?: Date;
  closedAt?: Date;
  closedBy?: string;
  auditTrail: AuditEntry[];
  dataFreshnessNote: string;
  recommendedStep: string;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  details: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  area?: string;
  institution?: string;
  active: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: 'school' | 'clinic';
  area: string;
  primarySiteId: string;
  backupSiteId?: string;
  population: number;
  coordinates: LatLng;
}

export interface MaintenanceRecord {
  id: string;
  siteId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  assignedTo: string;
  linkedFaultId?: string;
  cost?: number;
}

export interface LabResult {
  id: string;
  siteId: string;
  collectedDate: Date;
  receivedDate: Date;
  parameter: string;
  value: number;
  unit: string;
  testedBy: string;
  labName: string;
  notes: string;
}

export interface AlternativeSupply {
  id: string;
  siteId: string;
  type: 'tanker' | 'borehole' | 'kiosk' | 'rainwater';
  description: string;
  distanceKm: number;
  capacityM3PerDay: number;
  contactName: string;
  contactPhone: string;
  lastVerified: Date;
  active: boolean;
}

export interface RuleThreshold {
  id: string;
  name: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  category: 'flow' | 'level' | 'fault' | 'demand' | 'data';
}

export interface PilotStage {
  id: string;
  order: number;
  name: string;
  description: string;
  status: 'planned' | 'active' | 'completed' | 'on_hold';
  startDate: Date;
  endDate: Date;
  deliverables: string[];
}

export interface GlobalAuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface SMSAlert {
  id: string;
  alertId: string;
  recipient: string;
  message: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed';
}

export interface AppSettings {
  notificationEmail: boolean;
  notificationSMS: boolean;
  units: 'metric' | 'imperial';
  alertThrottleHours: number;
  dataStaleHours: number;
}

export interface Area {
  id: string;
  name: string;
  region: string;
  population: number;
  description: string;
}
