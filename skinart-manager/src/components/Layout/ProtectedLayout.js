import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './ProtectedLayout.css';

function ProtectedLayout({ children }) {
  return (
    <div className="protected-layout">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default ProtectedLayout;