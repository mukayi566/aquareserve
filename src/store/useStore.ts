import { create } from 'zustand';
import type {
  WaterSite, DailyReading, FaultEvent, Alert, AppUser, Institution,
  MaintenanceRecord, LabResult, AlternativeSupply, RuleThreshold,
  PilotStage, GlobalAuditLog, SMSAlert, AppSettings, RiskAssessment
} from '../types';
import type { UserRole } from '../types';
import {
  WATER_SITES, ALL_READINGS, FAULT_EVENTS, ALERTS, USERS, INSTITUTIONS,
  MAINTENANCE_RECORDS, LAB_RESULTS, ALT_SUPPLIES, DEFAULT_THRESHOLDS,
  PILOT_STAGES, GLOBAL_AUDIT_LOG, SMS_ALERTS, DEFAULT_SETTINGS, AREAS,
  NOTIFICATIONS, type Notification,
} from '../data/syntheticData';
import type { Area } from '../types';
import { computeAllRisks } from '../rules/ruleEngine';

// ─── Initial risk computations ────────────────────────────────────────────────
const initialRisks = computeAllRisks(
  WATER_SITES.map(s => ({ id: s.id, lastUpdated: s.lastUpdated })),
  ALL_READINGS,
  FAULT_EVENTS,
  DEFAULT_THRESHOLDS,
);

// ─── Store Interface ──────────────────────────────────────────────────────────
interface AppStore {
  // Data
  sites: WaterSite[];
  readings: DailyReading[];
  faults: FaultEvent[];
  alerts: Alert[];
  users: AppUser[];
  institutions: Institution[];
  maintenance: MaintenanceRecord[];
  labResults: LabResult[];
  altSupplies: AlternativeSupply[];
  thresholds: RuleThreshold[];
  pilotStages: PilotStage[];
  auditLog: GlobalAuditLog[];
  smsAlerts: SMSAlert[];
  settings: AppSettings;
  areas: Area[];
  riskMap: Record<string, RiskAssessment>;
  notifications: Notification[];

  // UI state
  currentRole: UserRole;
  currentUserId: string;
  sidebarCollapsed: boolean;
  demoTourActive: boolean;
  demoTourStep: number;

  // Actions
  setRole: (role: UserRole) => void;
  setCurrentUser: (userId: string) => void;
  setSidebarCollapsed: (v: boolean) => void;

  updateAlert: (id: string, patch: Partial<Alert>) => void;
  addAuditEntry: (alertId: string, entry: Alert['auditTrail'][0]) => void;
  addGlobalAuditEntry: (entry: Omit<GlobalAuditLog, 'id'>) => void;

  updateThreshold: (id: string, value: number) => void;
  recomputeRisks: () => void;

  addReading: (reading: DailyReading) => void;
  addMaintenance: (record: MaintenanceRecord) => void;
  updateMaintenance: (id: string, patch: Partial<MaintenanceRecord>) => void;
  addLabResult: (result: LabResult) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  startDemoTour: () => void;
  nextDemoStep: () => void;
  endDemoTour: () => void;

  resetDemoData: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useStore = create<AppStore>((set, get) => ({
  sites: WATER_SITES,
  readings: ALL_READINGS,
  faults: FAULT_EVENTS,
  alerts: ALERTS,
  users: USERS,
  institutions: INSTITUTIONS,
  maintenance: MAINTENANCE_RECORDS,
  labResults: LAB_RESULTS,
  altSupplies: ALT_SUPPLIES,
  thresholds: DEFAULT_THRESHOLDS,
  pilotStages: PILOT_STAGES,
  auditLog: GLOBAL_AUDIT_LOG,
  smsAlerts: SMS_ALERTS,
  settings: DEFAULT_SETTINGS,
  areas: AREAS,
  riskMap: initialRisks,
  notifications: NOTIFICATIONS,

  currentRole: 'Admin',
  currentUserId: 'user-01',
  sidebarCollapsed: false,
  demoTourActive: false,
  demoTourStep: 0,

  setRole: (role) => set({ currentRole: role }),
  setCurrentUser: (userId) => {
    const user = get().users.find(u => u.id === userId);
    if (user) set({ currentUserId: userId, currentRole: user.role });
  },
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  updateAlert: (id, patch) =>
    set(state => ({
      alerts: state.alerts.map(a => a.id === id ? { ...a, ...patch } : a),
    })),

  addAuditEntry: (alertId, entry) =>
    set(state => ({
      alerts: state.alerts.map(a =>
        a.id === alertId ? { ...a, auditTrail: [...a.auditTrail, entry] } : a
      ),
    })),

  addGlobalAuditEntry: (entry) =>
    set(state => ({
      auditLog: [
        { ...entry, id: `gal-${Date.now()}` },
        ...state.auditLog,
      ],
    })),

  updateThreshold: (id, value) => {
    set(state => ({
      thresholds: state.thresholds.map(t => t.id === id ? { ...t, value } : t),
    }));
    get().recomputeRisks();
  },

  recomputeRisks: () => {
    const { sites, readings, faults, thresholds } = get();
    const newRisks = computeAllRisks(
      sites.map(s => ({ id: s.id, lastUpdated: s.lastUpdated })),
      readings,
      faults,
      thresholds,
    );
    set({ riskMap: newRisks });
  },

  addReading: (reading) =>
    set(state => ({ readings: [reading, ...state.readings] })),

  addMaintenance: (record) =>
    set(state => ({ maintenance: [record, ...state.maintenance] })),

  updateMaintenance: (id, patch) =>
    set(state => ({
      maintenance: state.maintenance.map(m => m.id === id ? { ...m, ...patch } : m),
    })),

  addLabResult: (result) =>
    set(state => ({ labResults: [result, ...state.labResults] })),

  markNotificationRead: (id) =>
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    })),

  markAllNotificationsRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    })),

  startDemoTour: () => set({ demoTourActive: true, demoTourStep: 0 }),
  nextDemoStep: () => set(state => ({
    demoTourStep: state.demoTourStep + 1,
    demoTourActive: state.demoTourStep < 3,
  })),
  endDemoTour: () => set({ demoTourActive: false, demoTourStep: 0 }),

  resetDemoData: () => set({
    alerts: ALERTS,
    readings: ALL_READINGS,
    auditLog: GLOBAL_AUDIT_LOG,
    riskMap: initialRisks,
    notifications: NOTIFICATIONS,
  }),
}));

// ─── Convenience selectors ────────────────────────────────────────────────────
export const selectSiteRisk = (siteId: string) => (state: AppStore) =>
  state.riskMap[siteId];

export const selectSiteReadings = (siteId: string) => (state: AppStore) =>
  state.readings.filter(r => r.siteId === siteId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

export const selectOpenAlerts = (state: AppStore) =>
  state.alerts.filter(a => a.status !== 'closed');

export const selectMyAlerts = (userId: string) => (state: AppStore) =>
  state.alerts.filter(a => a.assignedTo === userId && a.status !== 'closed');

export const selectUnreadNotifications = (state: AppStore) =>
  state.notifications.filter(n => !n.read).length;
