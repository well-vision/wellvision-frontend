import React from 'react';
import './App.css';
import CustomerDashboard from './components/CustomerDashboard';
import SalesDashboard from './components/SalesDashboard';
import WellVisionInvoice from './components/WellVisionInvoice';
import DashboardLayout from './components/DashboardLayout';
import CustomerProfile from './components/CustomerProfile';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';

// Wrapper to include layout only for dashboard routes
function AppWithLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActivePage = () => {
    if (location.pathname.startsWith('/customers')) return 'customers';
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
      default:
        navigate('/');
    }
  };

  return (
    <DashboardLayout activePage={getActivePage()} onNavigate={handleNavigate}>
      <Routes>
        <Route path="/" element={<SalesDashboard />} />
        <Route path="/customers" element={<CustomerDashboard />} />
        <Route path="/customer/:id" element={<CustomerProfile />} />
        <Route path="/invoice" element={<WellVisionInvoice />} />
        <Route path="/profile" element={<SalesDashboard />} />
        {/* Add more routes if needed */}
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Router>
      <AppWithLayout />
    </Router>
  );
}
