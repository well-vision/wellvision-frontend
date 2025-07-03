// SalesDashboard.js
import React, { useState } from 'react';
import './SalesDashboard.css';

export default function SalesDashboard({ onNavigate }) {
  const [salesData] = useState([
    { 
      id: 1, 
      item: 'Pending glasses', 
      date: 'Aug 2024 12:04', 
      status: 'Pending', 
      amount: 5000,
      category: 'glasses'
    },
    { 
      id: 2, 
      item: 'Lens cleaning kits', 
      date: 'Jul 2024 07:45', 
      status: 'Pending', 
      amount: 2500,
      category: 'accessories'
    },
    { 
      id: 3, 
      item: 'Blue light blocking glasses', 
      date: 'Jul 2024 15:30', 
      status: 'Pending', 
      amount: 8000,
      category: 'glasses'
    },
    { 
      id: 4, 
      item: 'Lens cleaning kits', 
      date: 'Jul 2024 09:15', 
      status: 'Completed', 
      amount: 2500,
      category: 'accessories'
    },
    { 
      id: 5, 
      item: 'Reading glasses', 
      date: 'Jun 2024 14:22', 
      status: 'Completed', 
      amount: 3500,
      category: 'glasses'
    },
    { 
      id: 6, 
      item: 'Lens cleaning kits', 
      date: 'Jun 2024 11:08', 
      status: 'Pending', 
      amount: 2500,
      category: 'accessories'
    },
    { 
      id: 7, 
      item: 'Reading glasses', 
      date: 'May 2024 16:45', 
      status: 'Completed', 
      amount: 3500,
      category: 'glasses'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate metrics
  const completedSales = salesData.filter(sale => sale.status === 'Completed');
  const pendingSales = salesData.filter(sale => sale.status === 'Pending');
  
  const salesAmount = completedSales.reduce((sum, sale) => sum + sale.amount, 0);
  const salesAccount = pendingSales.reduce((sum, sale) => sum + sale.amount, 0);

  // Filter sales data
  const filteredSales = salesData.filter(sale => {
    const matchesFilter = filter === 'all' || sale.status.toLowerCase() === filter;
    const matchesSearch = sale.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.date.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getItemIcon = (category) => {
    switch(category) {
      case 'glasses': return '👓';
      case 'accessories': return '🧽';
      default: return '📦';
    }
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
      <div className="main-content">
        <div className="header">
          <div className="header-content">
            <div className="header-title">
              <h2>My Sales</h2>
              <span className="dropdown-icon">▼</span>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search sales..." 
                  className="search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <span className="search-icon">🔍</span>
              </div>
              <button className="header-btn">⬇️</button>
              <button className="add-new-btn">Add new</button>
            </div>
          </div>
        </div>

        <div className="content-area">
          {/* Sales Metrics */}
          <div className="sales-metrics">
            <div className="metric-card sales-amount">
              <div className="metric-value">{formatCurrency(salesAmount)}</div>
              <div className="metric-label">Sales Amount</div>
              <div className="metric-change positive">↑ +5% from last Today</div>
            </div>
            <div className="metric-card sales-account">
              <div className="metric-value">{formatCurrency(salesAccount)}</div>
              <div className="metric-label">Sales Account</div>
              <div className="metric-change negative">↓ -3% from last month</div>
            </div>
          </div>

          {/* Sales Table Section */}
          <div className="sales-section">
            <div className="sales-header">
              <h3 className="sales-title">Sales</h3>
              <div className="sales-filters">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Sales
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('pending')}
                >
                  Pending
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <div className="sales-item">
                          <div className="item-icon">
                            {getItemIcon(sale.category)}
                          </div>
                          <div className="item-details">
                            <div className="item-name">{sale.item}</div>
                            <div className="item-date">{sale.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="sales-date">{sale.date}</td>
                      <td className="sales-amount">{formatCurrency(sale.amount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn">
                          <span className="dots">⋯</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSales.length === 0 && (
                <div className="no-results">
                  <p>No sales found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}