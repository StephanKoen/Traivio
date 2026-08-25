import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import WelcomePopup from './components/WelcomePopup';
import Overview from './pages/Overview';
import FareDiscrepancies from './pages/FareDiscrepancies';
import FraudCompliance from './pages/FraudCompliance';
import SavingsOpportunities from './pages/SavingsOpportunities';
import UnusedCredits from './pages/UnusedCredits';
import ContractOpportunities from './pages/ContractOpportunities';
import Reports from './pages/Reports';
import PredictiveInsights from './pages/PredictiveInsights';
import AIAnalyst from './pages/AIAnalyst';
import TMCPortal from './pages/TMCPortal';
import Login from './pages/Login';
import Demo from './pages/Demo';

function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/fare-discrepancies" element={<FareDiscrepancies />} />
          <Route path="/fraud-compliance" element={<FraudCompliance />} />
          <Route path="/savings" element={<SavingsOpportunities />} />
          <Route path="/unused-credits" element={<UnusedCredits />} />
          <Route path="/contracts" element={<ContractOpportunities />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/predictive" element={<PredictiveInsights />} />
          <Route path="/ai-analyst" element={<AIAnalyst />} />
          <Route path="/tmc-portal" element={<TMCPortal />} />
        </Routes>
      </main>
      <WelcomePopup />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}