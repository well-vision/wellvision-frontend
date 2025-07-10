import React, { useState, useEffect, useRef, useContext } from 'react';
import './SidebarMenu.css';
import {
  Home,
  BarChart3,
  Users,
  Package,
  FileText,
  CreditCard,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SidebarMenu({ active = 'home', onNavigate = () => {} }) {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

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

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const onKeyDown = (e, key) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(key);
      setIsOpen(false);
    }
  };

  const renderNavItems = (items) =>
    items.map((item) => (
      <div
        key={item.key}
        className={`menu-item ${active === item.key ? 'active' : ''}`}
        onClick={() => {
          onNavigate(item.key);
          setIsOpen(false);
        }}
        role="link"
        tabIndex={0}
        aria-current={active === item.key ? 'page' : undefined}
        onKeyDown={(e) => onKeyDown(e, item.key)}
      >
        <span className="menu-icon">{item.icon}</span>
        {item.label}
      </div>
    ));

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="sidebar-toggle"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <nav
        className={`sidebar ${isOpen ? 'open' : 'closed'}`}
        ref={sidebarRef}
        role="navigation"
        aria-label="Main sidebar navigation"
      >
        <div className="sidebar-logo">
          <h1>Well Vision</h1>
          <p>Logo</p>
        </div>

        <div className="sidebar-menu">
          <p className="menu-label">MENU</p>
          <div className="menu-nav">{renderNavItems(menuItems)}</div>

          <br />
          <p className="menu-label">GENERAL</p>
          <div className="menu-nav">{renderNavItems(generalItems)}</div>

          <br />
          <p className="menu-label">ACCOUNT</p>
          <div
            className="menu-item"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleLogout();
            }}
          >
            <span className="menu-icon"><LogOut /></span>
            Logout
          </div>
        </div>

        <div className="user-profile">
          <div className="user-profile-content">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-email">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
