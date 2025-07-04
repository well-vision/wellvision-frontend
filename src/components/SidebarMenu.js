// SidebarMenu.js
import React, { useState } from 'react';
import './SidebarMenu.css';
import {
  Home,
  BarChart3,
  Users,
  Package,
  FileText,
  CreditCard,
  Settings,
  User
} from 'lucide-react';

export default function SidebarMenu({ active = 'home', onNavigate }) {
  const [isOpen, setIsOpen] = useState(true); // for mobile toggle

  const menuItems = [
    { label: 'Home', icon: <Home />, key: 'home' },
    { label: 'Daily reports', icon: <BarChart3 />, key: 'daily-reports' },
    { label: 'Customers', icon: <Users />, key: 'customers' },
    { label: 'Product', icon: <Package />, key: 'products' },
    { label: 'Invoice', icon: <FileText />, key: 'invoice' },
    { label: 'Bills', icon: <CreditCard />, key: 'bills' }
  ];

  const generalItems = [
    { label: 'Settings', icon: <Settings />, key: 'settings' },
    { label: 'Profile', icon: <User />, key: 'profile' }
  ];

  const renderNavItems = (items) =>
    items.map((item) => (
      <div
        key={item.key}
        className={`menu-item ${active === item.key ? 'active' : ''}`}
        onClick={() => {
          onNavigate(item.key);
          setIsOpen(false); // auto-close on mobile
        }}
      >
        <span className="menu-icon">{item.icon}</span>
        {item.label}
      </div>
    ));

  return (
    <>
      {/* Hamburger for mobile */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">
          <h1>Well Vision</h1>
          <p>Logo</p>
        </div>

        <div className="sidebar-menu">
          <p className="menu-label">MENU</p>
          <div className="menu-nav">
            {renderNavItems(menuItems)}
          </div>

          <br />
          <p className="menu-label">GENERAL</p>
          <div className="menu-nav">
            {renderNavItems(generalItems)}
          </div>
        </div>

        <div className="user-profile">
          <div className="user-profile-content">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <p className="user-name">Jane Dolle</p>
              <p className="user-email">janeadmin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
