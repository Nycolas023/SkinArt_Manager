import React from 'react';
import './Header.css';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { logout, user } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-secondary">
          <i className="fas fa-bars"></i>
        </button>
        <h4>SkinArt no Header</h4>
      </div>
      
      <div className="header-right">
        
        
        <div className="user-profile">
          <img 
            src="https://ui-avatars.com/api/?name=Usuario&background=random" 
            alt="Usuário" 
            className="avatar"
          />
          <span>Usuário</span>
        </div>
        <button onClick={logout} className="btn btn-primary">Sair</button>
      </div>
    </header>
  );
}

export default Header;