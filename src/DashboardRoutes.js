import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import SalesDashboard from './components/SalesDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerProfile from './components/CustomerProfile';
import WellVisionInvoice from './components/WellVisionInvoice';
import ProfilePage from './components/ProfilePage';

export default function DashboardRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActivePage = () => {
    if (location.pathname.startsWith('/customers')) return 'customers';
    if (location.pathname.startsWith('/customer/')) return 'customers';
    if (location.pathname.startsWith('/invoice')) return 'invoice';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const handleNavigate = (page) => {
    switch (page) {
      case 'customers':
        navigate('/customers');
        break;
      case 'invoice':
        navigate('/invoice');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'home':
      default:
        navigate('/dashboard');
    }
  };

  return (
    <DashboardLayout activePage={getActivePage()} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/dashboard" element={<PrivateRoute><SalesDashboard /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
        <Route path="/customer/:customerId" element={<PrivateRoute><CustomerProfile /></PrivateRoute>} />
        <Route path="/invoice" element={<PrivateRoute><WellVisionInvoice /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
