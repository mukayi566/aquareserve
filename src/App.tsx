import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';

// Public pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';

// Monitoring
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { SitesPage } from './pages/SitesPage';
import { SiteDetailPage } from './pages/SiteDetailPage';
import { SiteReadingsPage } from './pages/SiteReadingsPage';
import { AreasPage } from './pages/AreasPage';
import { InstitutionsPage } from './pages/InstitutionsPage';

// Alerts & Actions
import { AlertsPage } from './pages/AlertsPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AltSupplyPage } from './pages/AltSupplyPage';

// Data
import { DataEntryPage } from './pages/DataEntryPage';
import { DataImportPage } from './pages/DataImportPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { LabResultsPage } from './pages/LabResultsPage';

// Analysis
import { RulesPage } from './pages/RulesPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { ReportsPage } from './pages/ReportsPage';
import { SMSPreviewPage } from './pages/SMSPreviewPage';
import { PilotPlanPage } from './pages/PilotPlanPage';

// Governance
import { UsersPage } from './pages/UsersPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Monitoring */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/sites/:id" element={<SiteDetailPage />} />
          <Route path="/sites/:id/readings" element={<SiteReadingsPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/institutions" element={<InstitutionsPage />} />

          {/* Alerts & Actions */}
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:id" element={<AlertDetailPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/alternative-supply" element={<AltSupplyPage />} />

          {/* Data */}
          <Route path="/data/entry" element={<DataEntryPage />} />
          <Route path="/data/import" element={<DataImportPage />} />
          <Route path="/data/quality" element={<DataQualityPage />} />
          <Route path="/data/lab-results" element={<LabResultsPage />} />

          {/* Analysis */}
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/sms-preview" element={<SMSPreviewPage />} />
          <Route path="/pilot-plan" element={<PilotPlanPage />} />

          {/* Governance */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/audit-log" element={<AuditLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
