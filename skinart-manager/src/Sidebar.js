import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ userRole, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h3>Studio Tattoo</h3>
      </div>
      
      <div className="sidebar-menu">
        <ul>
          <li>
            <Link to="/dashboard">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link to="/clientes">
              <i className="fas fa-users"></i>
              <span>Clientes</span>
            </Link>
          </li>
          
          <li>
            <Link to="/agendamentos">
              <i className="fas fa-calendar-alt"></i>
              <span>Agendamentos</span>
            </Link>
          </li>
          
          <li>
            <Link to="/ordens-servico">
              <i className="fas fa-file-alt"></i>
              <span>Ordens de Serviço</span>
            </Link>
          </li>
          
          {(userRole === 'admin' || userRole === 'recepcao') && (
            <li>
              <Link to="/financeiro">
                <i className="fas fa-money-bill-wave"></i>
                <span>Financeiro</span>
              </Link>
            </li>
          )}
          
          <li>
            <Link to="/portfolio">
              <i className="fas fa-images"></i>
              <span>Portfólio</span>
            </Link>
          </li>
          
          {(userRole === 'admin' || userRole === 'recepcao') && (
            <li>
              <Link to="/estoque">
                <i className="fas fa-boxes"></i>
                <span>Estoque</span>
              </Link>
            </li>
          )}
          
          {userRole === 'admin' && (
            <li>
              <Link to="/usuarios">
                <i className="fas fa-user-cog"></i>
                <span>Usuários</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-secondary btn-block">
          <i className="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </div>
  );
}

export default Sidebar;