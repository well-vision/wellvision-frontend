import React from 'react';
import SidebarMenu from './SidebarMenu';

const DashboardLayout = ({ activePage, onNavigate, children }) => {
  return (
    <div className="dashboard-container" style={{ display: 'flex' }}>
      <SidebarMenu active={activePage} onNavigate={onNavigate} />
      <div className="main-content" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
