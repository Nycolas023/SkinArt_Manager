import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes
import Login from '../src/Login';
import Dashboard from '../src/Dashboard';
import ClientManagement from '../src/ClientManagement';
import Scheduling from '../src/Scheduling';
import Financial from '../src/Financial';
import Portfolio from '../src/Portfolio';
import Inventory from '../src/Inventory';
import ServiceOrders from '../src/ServiceOrders';
import UserManagement from '../src/UserManagement';
import Sidebar from '../src/Sidebar';
import Header from '../src/Header';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleLogin = (role) => {
    setAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUserRole('');
  };

  return (
    <Router>
      <div className="app">
        {authenticated && <Sidebar userRole={userRole} onLogout={handleLogout} />}
        <div className="main-content">
          {authenticated && <Header />}
          <Routes>
            <Route 
              path="/" 
              element={authenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={authenticated ? <Dashboard userRole={userRole} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/clientes" 
              element={authenticated ? <ClientManagement userRole={userRole} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/agendamentos" 
              element={authenticated ? <Scheduling userRole={userRole} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/financeiro" 
              element={authenticated && (userRole === 'admin' || userRole === 'recepcao') ? 
                <Financial userRole={userRole} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/portfolio" 
              element={authenticated ? <Portfolio /> : <Navigate to="/" />} 
            />
            <Route 
              path="/estoque" 
              element={authenticated && (userRole === 'admin' || userRole === 'recepcao') ? 
                <Inventory /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/ordens-servico" 
              element={authenticated ? <ServiceOrders userRole={userRole} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/usuarios" 
              element={authenticated && userRole === 'admin' ? 
                <UserManagement /> : <Navigate to="/dashboard" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;