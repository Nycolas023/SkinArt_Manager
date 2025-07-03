import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Menus por papel
  const menuAdmin = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fas fa-home' },
    { label: 'Clientes', path: '/clientes', icon: 'fas fa-users' },
    { label: 'Agendamentos', path: '/agendamentos', icon: 'fas fa-calendar' },
    { label: 'Ordens de Serviço', path: '/ordensDeServico', icon: 'fas fa-file-alt' },
    { label: 'Financeiro', path: '/financeiro', icon: 'fas fa-dollar-sign' },
    { label: 'Portfólio', path: '/portfolio', icon: 'fas fa-image' },
    { label: 'Estoque', path: '/estoque', icon: 'fas fa-boxes' },
    { label: 'Usuários', path: '/usuarios', icon: 'fas fa-user-cog' },
  ];

  const menuTatuador = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fas fa-home' },
    { label: 'Agendamentos', path: '/agendamentos', icon: 'fas fa-calendar' },
    { label: 'Portfólio', path: '/portfolio', icon: 'fas fa-image' },
  ];

  let papel = (user?.papel || user?.NOME_PAPEL || user?.role || '').toLowerCase();
  let menu = menuTatuador;
  if (papel === 'admin') menu = menuAdmin;

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h3>SkinArt</h3>
      </div>
      <div className="sidebar-menu">
        <ul>
          {menu.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <i className={item.icon}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-secondary btn-block">
          <i className="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;