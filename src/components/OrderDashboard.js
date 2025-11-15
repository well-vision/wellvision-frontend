import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Oders.css';
import SidebarMenu from './SidebarMenu';
import {
  Plus,
  Download,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  Package,
  Minus,
  ShoppingCart
} from 'lucide-react';

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', or 'add'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Add order form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderForm, setOrderForm] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    items: [],
    notes: ''
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order statuses
  const orderStatuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Order Received', label: 'Order Received' },
    { value: 'Order place in Lab', label: 'Order Place in Lab' },
    { value: 'In lab proccessing', label: 'In Lab Processing' },
    { value: 'Transit to shop', label: 'Transit to Shop' },
    { value: 'Ready for customer', label: 'Ready for Customer' }
  ];

  // Fetch orders and products from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();

        if (data.success) {
          // Transform backend data to match frontend structure
          const transformedOrders = data.data.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customer: order._id, // Use order ID as customer reference
            placedAt: order.placedAt,
            status: order.status,
            total: order.total,
            items: order.items.map(item => ({
              product: item.description || item.sku,
              quantity: item.quantity,
              price: item.unitPrice
            })),
            notes: order.customerEmail || ''
          }));
          setOrders(transformedOrders);
          setFilteredOrders(transformedOrders);
        } else {
          console.error('Failed to fetch orders:', data.message);
          // Fallback to sample data if API fails
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Fallback to sample data if API fails
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchOrders();
    fetchProducts();

    // Check if products were selected from the products page
    if (location.state?.selectedProducts) {
      const selectedItems = location.state.selectedProducts.map(item => ({
        productId: item.productId,
        sku: item.sku,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }));

      setOrderForm(prev => ({
        ...prev,
        items: selectedItems
      }));

      // Clear the state to prevent re-populating on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const getStatusBadge = (status) => {
    const badges = {
      'Order Received': { bg: '#DBEAFE', color: '#1E3A8A' },
      'Order place in Lab': { bg: '#FEF3C7', color: '#92400E' },
      'In lab proccessing': { bg: '#FFF7ED', color: '#92400E' },
      'Transit to shop': { bg: '#F3E8FF', color: '#6D28D9' },
      'Ready for customer': { bg: '#DCFCE7', color: '#166534' }
    };
    return badges[status] || { bg: '#F1F5F9', color: '#0F172A' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          setOrders(orders.filter(o => o._id !== orderId));
          alert('Order deleted successfully!');
        } else {
          alert('Failed to delete order: ' + data.message);
        }
      } catch (err) {
        console.error('Delete order error:', err);
        alert('Error deleting order');
      }
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:4000/api/orders/${selectedOrder._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: selectedOrder.status })
      });
      const data = await response.json();

      if (data.success) {
        setOrders(orders.map(o =>
          o._id === selectedOrder._id
            ? { ...o, status: selectedOrder.status }
            : o
        ));
        setShowModal(false);
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status: ' + data.message);
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Error updating order status');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const exportOrders = () => {
    // In real app, implement CSV export
    alert('Exporting orders to CSV...');
  };

  // Add order functions
  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) return;

    const product = products.find(p => p._id === selectedProduct);
    if (!product) return;

    const newItem = {
      productId: selectedProduct,
      sku: product.sku,
      description: product.name,
      quantity: quantity,
      unitPrice: product.price
    };

    setOrderForm({
      ...orderForm,
      items: [...orderForm.items, newItem]
    });

    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setOrderForm({
      ...orderForm,
      items: orderForm.items.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = () => {
    return orderForm.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!orderForm.orderNumber || !orderForm.customerName) {
      alert('Order number and customer name are required');
      return;
    }

    if (orderForm.items.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...orderForm,
          total: calculateTotal()
        })
      });

      const data = await response.json();

      if (data.success) {
        setOrders([...orders, {
          _id: data.data._id,
          orderNumber: data.data.orderNumber,
          customerName: data.data.customerName,
          customer: data.data._id,
          placedAt: data.data.placedAt,
          status: data.data.status,
          total: data.data.total,
          items: data.data.items.map(item => ({
            product: item.description || item.sku,
            quantity: item.quantity,
            price: item.unitPrice
          })),
          notes: data.data.customerEmail || ''
        }]);
        setShowAddModal(false);
        setOrderForm({
          orderNumber: '',
          customerName: '',
          customerEmail: '',
          items: [],
          notes: ''
        });
        alert('Order created successfully!');
      } else {
        alert('Failed to create order: ' + data.message);
      }
    } catch (err) {
      console.error('Create order error:', err);
      alert('Error creating order');
    }
  };

  const totalOrders = orders.length;
  const receivedCount = orders.filter(o => o.status === 'Order Received').length;
  const processingCount = orders.filter(o => o.status === 'In lab proccessing').length;
  const readyCount = orders.filter(o => o.status === 'Ready for customer').length;

  return (
    <div className="orders-page">
      <SidebarMenu active="orders" />
      
      <div className="orders-main-content">
        {/* Header */}
        <div className="orders-header">
          <div className="orders-header-content">
            <div className="orders-header-title">
              <h2>Orders Management</h2>
              <div className="orders-stats">
                <span className="stat-badge">Total: {totalOrders}</span>
                <span className="stat-badge" style={{ backgroundColor: '#DBEAFE', color: '#1E3A8A' }}>
                  New: {receivedCount}
                </span>
                {processingCount > 0 && (
                  <span className="stat-badge" style={{ backgroundColor: '#FFF7ED', color: '#92400E' }}>
                    Processing: {processingCount}
                  </span>
                )}
                {readyCount > 0 && (
                  <span className="stat-badge" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                    Ready: {readyCount}
                  </span>
                )}
              </div>
            </div>
            <div className="orders-header-actions">
              <button className="add-order-btn" onClick={() => setShowAddModal(true)}>
                <Plus size={16} />
                Add Order
              </button>
              <button className="export-btn" onClick={exportOrders}>
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <div className="search-filter">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by order number, customer, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Content */}
        <div className="orders-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No orders found</h3>
              <p className="empty-state-description">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No orders have been placed yet'}
              </p>
            </div>
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const statusStyle = getStatusBadge(order.status);
                    return (
                      <tr key={order._id}>
                        <td>
                          <div className="order-number">
                            <Package size={16} />
                            <span>{order.orderNumber}</span>
                          </div>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <span className="customer-name">{order.customerName}</span>
                          </div>
                        </td>
                        <td>{formatDate(order.placedAt)}</td>
                        <td>{order.items.length} item(s)</td>
                        <td style={{ fontWeight: 600, color: '#0d9488' }}>
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ 
                              backgroundColor: statusStyle.bg, 
                              color: statusStyle.color 
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="table-action-btn view-action-btn"
                              onClick={() => handleViewOrder(order)}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="table-action-btn edit-action-btn"
                              onClick={() => handleEditStatus(order)}
                              title="Update Status"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="table-action-btn delete-action-btn"
                              onClick={() => handleDeleteOrder(order._id)}
                              title="Delete Order"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'view' ? 'Order Details' : 'Update Order Status'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {modalMode === 'view' ? (
                <>
                  <div className="order-detail-section">
                    <h4>Order Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Order Number:</span>
                        <span className="detail-value">{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-value">{selectedOrder.customerName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Order Date:</span>
                        <span className="detail-value">{formatDate(selectedOrder.placedAt)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span 
                          className="status-badge"
                          style={getStatusBadge(selectedOrder.status)}
                        >
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="order-detail-section">
                    <h4>Order Items</h4>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.product}</td>
                            <td>{item.quantity}</td>
                            <td>Rs. {item.price.toLocaleString()}</td>
                            <td>Rs. {(item.quantity * item.price).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600 }}>Total:</td>
                          <td style={{ fontWeight: 700, color: '#0d9488' }}>
                            Rs. {selectedOrder.total.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {selectedOrder.notes && (
                    <div className="order-detail-section">
                      <h4>Notes</h4>
                      <p className="order-notes">{selectedOrder.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleStatusUpdate}>
                  <div className="form-group">
                    <label className="form-label">
                      Order Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedOrder.orderNumber}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Customer
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedOrder.customerName}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Update Status <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={selectedOrder.status}
                      onChange={(e) => setSelectedOrder({
                        ...selectedOrder,
                        status: e.target.value
                      })}
                      required
                    >
                      {orderStatuses.filter(s => s.value !== 'all').map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="modal-btn modal-btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="modal-btn modal-btn-submit">
                      Update Status
                    </button>
                  </div>
                </form>
              )}
            </div>

            {modalMode === 'view' && (
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="modal-btn modal-btn-submit"
                  onClick={() => setModalMode('edit')}
                >
                  Update Status
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content add-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Order</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="modal-body">
                {/* Order Information */}
                <div className="order-detail-section">
                  <h4>Order Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Order Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={orderForm.orderNumber}
                        onChange={(e) => setOrderForm({...orderForm, orderNumber: e.target.value})}
                        placeholder="Enter order number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Customer Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={orderForm.customerName}
                        onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Customer Email
                      </label>
                      <input
                        type="email"
                        className="form-input"
                        value={orderForm.customerEmail}
                        onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                        placeholder="Enter customer email"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Notes
                      </label>
                      <textarea
                        className="form-textarea"
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                        placeholder="Additional notes"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                {/* Add Products */}
                <div className="order-detail-section">
                  <h4>Add Products</h4>
                  <div className="add-product-section">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Product</label>
                        <select
                          className="form-select"
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                          <option value="">Select a product</option>
                          {products.map(product => (
                            <option key={product._id} value={product._id}>
                              {product.name} - Rs. {product.price} (Stock: {product.stock})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          className="form-input"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          min="1"
                        />
                      </div>

                      <div className="form-group">
                        <button
                          type="button"
                          className="add-product-btn"
                          onClick={handleAddProduct}
                          disabled={!selectedProduct}
                        >
                          <Plus size={16} />
                          Add Product
                        </button>
                        <button
                          type="button"
                          className="browse-products-btn"
                          onClick={() => navigate('/products?mode=select')}
                          title="Browse Products"
                        >
                          <ShoppingCart size={16} />
                          Browse Products
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {orderForm.items.length > 0 && (
                  <div className="order-detail-section">
                    <h4>Order Items</h4>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderForm.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>Rs. {item.unitPrice.toLocaleString()}</td>
                            <td>Rs. {(item.quantity * item.unitPrice).toLocaleString()}</td>
                            <td>
                              <button
                                type="button"
                                className="remove-item-btn"
                                onClick={() => handleRemoveItem(index)}
                                title="Remove item"
                              >
                                <Minus size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'right', fontWeight: 600 }}>Total:</td>
                          <td style={{ fontWeight: 700, color: '#0d9488' }}>
                            Rs. {calculateTotal().toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-btn modal-btn-submit">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
