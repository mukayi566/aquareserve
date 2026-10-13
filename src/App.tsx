import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { SitesPage } from './pages/SitesPage';
import { SiteDetailPage } from './pages/SiteDetailPage';
import { SiteReadingsPage } from './pages/SiteReadingsPage';
import { AreasPage } from './pages/AreasPage';
import { InstitutionsPage } from './pages/InstitutionsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AltSupplyPage } from './pages/AltSupplyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes share the main app shell (sidebar + topbar + demo banner) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/sites/:id" element={<SiteDetailPage />} />
          <Route path="/sites/:id/readings" element={<SiteReadingsPage />} />
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/institutions" element={<InstitutionsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:id" element={<AlertDetailPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/alternative-supply" element={<AltSupplyPage />} />

          {/* Catch-all: redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
