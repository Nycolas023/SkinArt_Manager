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
        <h4>SkinArt Manager</h4>
      </div>
      
      
    </header>
  );
}

export default Header;