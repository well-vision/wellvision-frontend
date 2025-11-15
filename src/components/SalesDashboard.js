// SalesDashboard.js
import React, { useState, useMemo, useEffect } from 'react';
import './SalesDashboard.css';

const filters = [
  { key: 'all', label: 'All Sales' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
];

// Currency formatter for Sri Lankan Rupees
const currencyFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
});

export default function SalesDashboard({ onNavigate }) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/orders', {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          // Transform orders to sales data format
          const transformedSales = data.data.map((order, index) => ({
            id: order._id,
            item: order.items.length > 0 ? order.items[0].description || `Order ${order.orderNumber}` : `Order ${order.orderNumber}`,
            date: new Date(order.placedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: order.status === 'Ready for customer' ? 'Completed' : 'Pending',
            amount: order.total,
            category: order.items.length > 0 ? (order.items[0].sku.includes('glass') ? 'glasses' : 'accessories') : 'accessories'
          }));
          setSalesData(transformedSales);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized filtered sales list
  const filteredSales = useMemo(() => {
    return salesData.filter(sale => {
      const matchesFilter = filter === 'all' || sale.status.toLowerCase() === filter;
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        sale.item.toLowerCase().includes(lowerSearch) ||
        sale.date.toLowerCase().includes(lowerSearch);
      return matchesFilter && matchesSearch;
    });
  }, [salesData, filter, searchTerm]);

  // Calculate metrics using memo for efficiency
  const completedSales = useMemo(() => filteredSales.filter(sale => sale.status === 'Completed'), [filteredSales]);
  const pendingSales = useMemo(() => filteredSales.filter(sale => sale.status === 'Pending'), [filteredSales]);

  const salesAmount = useMemo(() => completedSales.reduce((sum, sale) => sum + sale.amount, 0), [completedSales]);
  const salesAccount = useMemo(() => pendingSales.reduce((sum, sale) => sum + sale.amount, 0), [pendingSales]);

  const formatCurrency = amount => currencyFormatter.format(amount);

  const getItemIcon = category => {
    switch(category) {
      case 'glasses': return '👓';
      case 'accessories': return '🧽';
      default: return '📦';
    }
  };

  const getStatusClass = status => status.toLowerCase();

  const handleFilterChange = (key) => {
    setFilter(key);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="main-content" role="main">
        <div className="loading">Loading sales data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content" role="main">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="main-content" role="main">
      <div className="header">
        <div className="header-content">
          <div className="header-title" aria-label="Sales Dashboard Title">
            <h2>My Sales</h2>
            <span className="dropdown-icon" aria-hidden="true">▼</span>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search sales..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search sales"
              />
              <span className="search-icon" aria-hidden="true">🔍</span>
            </div>
            <button
              className="header-btn"
              type="button"
              aria-label="Download sales data"
              title="Download sales data"
            >
              ⬇️
            </button>
            <button
              className="add-new-btn"
              type="button"
              aria-label="Add new sale"
              title="Add new sale"
            >
              Add new
            </button>
          </div>
        </div>
      </div>

      <div className="content-area">
        {/* Sales Metrics */}
        <div className="sales-metrics" aria-label="Sales summary metrics">
          <div className="metric-card sales-amount">
            <div className="metric-value">{formatCurrency(salesAmount)}</div>
            <div className="metric-label">Sales Amount</div>
            <div className="metric-change positive" aria-live="polite">↑ +5% from last Today</div>
          </div>
          <div className="metric-card sales-account">
            <div className="metric-value">{formatCurrency(salesAccount)}</div>
            <div className="metric-label">Sales Account</div>
            <div className="metric-change negative" aria-live="polite">↓ -3% from last month</div>
          </div>
        </div>

        {/* Sales Table Section */}
        <div className="sales-section">
          <div className="sales-header">
            <h3 className="sales-title">Sales</h3>
            <div className="sales-filters" role="group" aria-label="Filter sales by status">
              {filters.map(f => (
                <button
                  key={f.key}
                  type="button"
                  className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                  onClick={() => handleFilterChange(f.key)}
                  aria-pressed={filter === f.key}
                  title={`Show ${f.label}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container" role="table" aria-label="Sales records table">
            <table className="sales-table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Date & Time</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id}>
                    <td>
                      <div className="sales-item">
                        <div className="item-icon" aria-hidden="true">
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
                      <button
                        className="action-btn"
                        type="button"
                        aria-label={`More actions for ${sale.item}`}
                        title="More actions"
                      >
                        <span className="dots">⋯</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSales.length === 0 && (
              <div className="no-results" role="alert" aria-live="assertive">
                <p>No sales found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
