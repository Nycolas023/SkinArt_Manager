import React from 'react';
import './App.css';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard'; // ajuste o caminho se necess�rio
import ClientManagement from './pages/Clients/ClientManagement'; // ajuste o caminho se necess�rio
import ProtectedLayout from './components/Layout/ProtectedLayout'; // ajuste o caminho se necess�rio

// Componente principal da aplica��o
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
            <Login onLogin={(data) => {
              login(data.Token, data.Usuario); // Note o "T" mai�sculo em Token
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