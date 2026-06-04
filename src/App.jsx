import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import NewModal from './components/NewModal';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BlueprintPage from './pages/BlueprintPage';
import AgentsPage from './pages/AgentsPage';
import ClawPage from './pages/ClawPage';
import WorkflowsPage from './pages/WorkflowsPage';
import TeamsPage from './pages/TeamsPage';
import DrivePage from './pages/DrivePage';
import MorePage from './pages/MorePage';

const routeToView = {
  '/': 'home',
  '/blueprint': 'blueprint',
  '/agents': 'agents',
  '/claw': 'claw',
  '/workflows': 'workflows',
  '/teams': 'teams',
  '/drive': 'drive',
  '/more': 'more',
};

const viewToRoute = {
  home: '/',
  blueprint: '/blueprint',
  agents: '/agents',
  claw: '/claw',
  workflows: '/workflows',
  teams: '/teams',
  drive: '/drive',
  more: '/more',
};

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showTopBar, setShowTopBar] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const activeView = routeToView[location.pathname] || 'home';

  const handleNavigate = (id) => {
    if (id === 'new') {
      setShowModal(true);
      return;
    }
    const path = viewToRoute[id];
    if (path) navigate(path);
  };

  const handleModalSelect = (templateId) => {
    if (templateId === 'chat') navigate('/');
    else if (templateId === 'agent') navigate('/agents');
    else if (templateId === 'workflow') navigate('/workflows');
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Layout activeView={activeView} onNavigate={handleNavigate} showTopBar={showTopBar} onDismissTopBar={() => setShowTopBar(false)}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blueprint" element={<BlueprintPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/claw" element={<ClawPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/drive" element={<DrivePage />} />
          <Route path="/more" element={<MorePage logout={logout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <NewModal isOpen={showModal} onClose={() => setShowModal(false)} onSelect={handleModalSelect} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
