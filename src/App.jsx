import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { GlobalThemeProvider } from './contexts/GlobalThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import IncidentDetails from './pages/IncidentDetails';
import Users from './pages/Users';
import Companies from './pages/Companies';
import Archives from './pages/Archives';
import Reports from './pages/Reports';
import MyTasks from './pages/MyTasks';
import Settings from './pages/Settings';
import Interventions from './pages/Interventions';
import NotificationsPanel from './components/NotificationsPanel';
import './i18n';
import './styles/global.css';
import NewIncident from './pages/NewIncident';

function App() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <GlobalThemeProvider>
            <Toaster 
              position="top-center" 
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontFamily: 'Cairo, sans-serif',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: 'white',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><MainLayout setShowNotifications={setShowNotifications} /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="incidents" element={<Incidents />} />
                <Route path="incidents/:id" element={<IncidentDetails />} />
                <Route path="users" element={<Users />} />
                <Route path="companies" element={<Companies />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="interventions" element={<Interventions />} />
                <Route path="reports" element={<Reports />} />
                <Route path="archives" element={<Archives />} />
                <Route path="settings" element={<Settings />} />
                <Route path="incidents/new" element={<NewIncident />} />
              </Route>
            </Routes>
            {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
          </GlobalThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;