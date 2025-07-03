import React from 'react';
import './App.css';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // ajuste o caminho se necessário
import ClientManagement from './pages/Clients/ClientManagement'; // ajuste o caminho se necessário
import ProtectedLayout from './components/Layout/ProtectedLayout'; // ajuste o caminho se necessário
import Scheduling from './pages/Scheduling/Scheduling';
import UserManagement from './pages/Users/UserManagement';

// Componente principal da aplicação
function AppContent() {
  const { user, login } = useAuth();
  
  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" />
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
            <Navigate to="/" />
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
            <Navigate to="/" />
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
            <Navigate to="/" />
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
            <Navigate to="/" />
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