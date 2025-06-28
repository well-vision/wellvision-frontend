import React, { useState } from 'react';
import './App.css';
import CustomerDashboard from './components/CustomerDashboard';
import SalesDashboard from './components/SalesDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // Default to home (SalesDashboard)

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <SalesDashboard onNavigate={handleNavigate} />;
      case 'customers':
        return <CustomerDashboard onNavigate={handleNavigate} />;
      case 'daily-reports':
        return <SalesDashboard onNavigate={handleNavigate} />; // You can create a separate component later
      case 'products':
        return <SalesDashboard onNavigate={handleNavigate} />; // You can create a separate component later
      case 'invoice':
        return <SalesDashboard onNavigate={handleNavigate} />; // You can create a separate component later
      case 'bills':
        return <SalesDashboard onNavigate={handleNavigate} />; // You can create a separate component later
      case 'settings':
        return <SalesDashboard onNavigate={handleNavigate} />; // You can create a separate component later
      case 'profile':
        return <SalesDashboard onNavigate={handleNavigate} />; // You can create a separate component later
      default:
        return <SalesDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;