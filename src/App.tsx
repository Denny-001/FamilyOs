import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import FamilyDashboard from './pages/family/FamilyDashboard';
import FeedPage from './pages/feed/FeedPage';
import EventsPage from './pages/events/EventsPage';
import TasksPage from './pages/tasks/TasksPage';
import ContributionsPage from './pages/contributions/ContributionsPage';
import VaultPage from './pages/vault/VaultPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { useAuthStore } from './store/authStore';

const Protected = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((s) => s.accessToken);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<Protected><FamilyDashboard /></Protected>} />
          <Route path="/family/:familyId/feed" element={<Protected><FeedPage /></Protected>} />
          <Route path="/family/:familyId/events" element={<Protected><EventsPage /></Protected>} />
          <Route path="/family/:familyId/tasks" element={<Protected><TasksPage /></Protected>} />
          <Route path="/family/:familyId/contributions" element={<Protected><ContributionsPage /></Protected>} />
          <Route path="/family/:familyId/vault" element={<Protected><VaultPage /></Protected>} />
          <Route path="/notifications" element={<Protected><NotificationsPage /></Protected>} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}