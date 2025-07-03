import React, { useState } from 'react';
import './App.css';
import CustomerDashboard from './components/CustomerDashboard';
import SalesDashboard from './components/SalesDashboard';
import WellVisionInvoice from './components/WellVisionInvoice';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'customers':
        return <CustomerDashboard />;
      case 'invoice':
        return <WellVisionInvoice />;
      case 'home':
      case 'daily-reports':
      case 'products':
      case 'bills':
      case 'settings':
      case 'profile':
      default:
        return <SalesDashboard />;
    }
  };

  return (
    <DashboardLayout activePage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </DashboardLayout>
  );
}

export default App;
