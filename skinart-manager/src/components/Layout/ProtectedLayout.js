import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

function ProtectedLayout({ children }) {
  return (
    <div className="protected-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default ProtectedLayout;