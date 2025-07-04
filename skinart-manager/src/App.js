import React, { useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientManagement from './pages/Clients/ClientManagement';
import ProtectedLayout from './components/Layout/ProtectedLayout';
import Scheduling from './pages/Scheduling/Scheduling';
import UserManagement from './pages/Users/UserManagement';

function AppContent() {
  const { user, login } = useAuth();

  useEffect(() => {
    console.log("Estado de autenticação:", !!user);
  }, [user]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={(token, usuario) => {
              login(token, usuario);
            }} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/clientes"
        element={
          user ? (
            <ProtectedLayout>
              <ClientManagement />
            </ProtectedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/agendamentos"
        element={
          user ? (
            <ProtectedLayout>
              <Scheduling userRole={user?.papel || user?.role} />
            </ProtectedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/usuarios"
        element={
          user ? (
            <ProtectedLayout>
              <UserManagement />
            </ProtectedLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;