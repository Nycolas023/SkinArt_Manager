import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-secondary">
          <i className="fas fa-bars"></i>
        </button>
        <h4>Dashboard</h4>
      </div>
      
      <div className="header-right">
        <div className="notification">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </div>
        
        <div className="user-profile">
          <img 
            src="https://ui-avatars.com/api/?name=Usuario&background=random" 
            alt="Usuário" 
            className="avatar"
          />
          <span>Usuário</span>
        </div>
      </div>
    </header>
  );
}

export default Header;