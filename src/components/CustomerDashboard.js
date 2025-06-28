<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import './CustomerDashboard.css';
import {
  Home,
  BarChart3,
  Users,
  Package,
  FileText,
  CreditCard,
  Settings,
  User,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' or 'edit' or 'view'
  
=======
// CustomerDashboard.js (Updated)
import React, { useState } from 'react';
import './CustomerDashboard.css';
import SidebarMenu from './SidebarMenu';

export default function CustomerDashboard({ onNavigate }) {
  const [customers] = useState([
    { id: 1, name: 'Pathum Dilshan', email: 'pathum@example.com' },
    { id: 2, name: 'Sandaru Samitha', email: 'sandaru@example.com' },
    { id: 3, name: 'Kaveesha Gamage', email: 'kaveesha@example.com' },
    { id: 4, name: 'Naveen Dhananjaya', email: 'naveen@example.com' },
    { id: 5, name: 'Ayesh Umayanga', email: 'ayesh@example.com' },
    { id: 6, name: 'Jane Dolle', email: 'jane@example.com' }
  ]);

>>>>>>> d363137f586a6fe1478bf9d4fdb0d1359314a2a5
  const [formData, setFormData] = useState({
    givenName: '',
    familyName: '',
    ageYears: '',
    birthDate: '',
    nicPassport: '',
    gender: '',
    nationality: '',
    phoneNo: '',
    address: '',
    email: ''
  });

  // Form validation rules
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.givenName.trim()) {
      newErrors.givenName = 'Given name is required';
    } else if (formData.givenName.length < 2) {
      newErrors.givenName = 'Given name must be at least 2 characters';
    }

    if (!formData.familyName.trim()) {
      newErrors.familyName = 'Family name is required';
    } else if (formData.familyName.length < 2) {
      newErrors.familyName = 'Family name must be at least 2 characters';
    }

    if (formData.ageYears && (isNaN(formData.ageYears) || formData.ageYears < 0 || formData.ageYears > 120)) {
      newErrors.ageYears = 'Please enter a valid age (0-120)';
    }

    if (formData.phoneNo && !/^[\d\s+-]+$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Please enter a valid phone number';
    }

    if (formData.nicPassport && !/^[A-Za-z0-9]+$/.test(formData.nicPassport)) {
      newErrors.nicPassport = 'Only letters and numbers allowed';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch customers from backend
  const fetchCustomers = async (search = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/customers?search=${search}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch customers');
      }
      
      setCustomers(data.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      givenName: '',
      familyName: '',
      ageYears: '',
      birthDate: '',
      nicPassport: '',
      gender: '',
      nationality: '',
      phoneNo: '',
      address: '',
      email: ''
    });
    setErrors({});
    setSelectedCustomer(null);
    setMode('create');
  };

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      givenName: customer.givenName,
      familyName: customer.familyName,
      ageYears: customer.ageYears,
      birthDate: customer.birthDate,
      nicPassport: customer.nicPassport,
      gender: customer.gender,
      nationality: customer.nationality,
      phoneNo: customer.phoneNo,
      address: customer.address,
      email: customer.email
    });
    setMode('view');
  };

  // Handle edit button click
  const handleEdit = () => {
    setMode('edit');
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.warning('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        dateOfBirth: formData.birthDate
      };

      let response;
      if (mode === 'create') {
        response = await fetch('http://localhost:5000/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      } else {
        response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save customer');
      }
      
      toast.success(`Customer ${mode === 'create' ? 'added' : 'updated'} successfully!`);
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete customer
  const handleDelete = async () => {
    if (!selectedCustomer) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedCustomer.givenName} ${selectedCustomer.familyName}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer.id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete customer');
      }
      
      toast.success('Customer deleted successfully!');
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(searchTerm);
  };

  const getInitials = (givenName, familyName) => {
    return ((givenName?.charAt(0) || '') + (familyName?.charAt(0) || '')).toUpperCase();
  };

  const getColorClass = (index) =>
    ['bg-blue', 'bg-green', 'bg-purple', 'bg-red', 'bg-yellow', 'bg-pink'][index % 6];

  return (
    <div className="dashboard-container">
<<<<<<< HEAD
      {/* Sidebar remains the same */}
      <div className="sidebar">
        {/* ... existing sidebar code ... */}
      </div>
=======
      <SidebarMenu onNavigate={onNavigate} currentPage="customers" />
>>>>>>> d363137f586a6fe1478bf9d4fdb0d1359314a2a5

      <div className="main-content">
        <div className="header">
          <div className="header-content">
            <div className="header-title">
              <h2>Customers</h2>
              <span className="dropdown-icon">▼</span>
            </div>
            <div className="header-actions">
              <button className="header-btn">🔍</button>
              <button className="header-btn">⬇️</button>
              <button className="add-new-btn" onClick={resetForm}>Add new</button>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="content-flex">
            {/* Customer List */}
            <div className="customer-list-container">
<<<<<<< HEAD
              <form onSubmit={handleSearch} className="search-container">
                <input
                  type="text"
                  placeholder="Search customers"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
=======
              <div className="search-container">
                <input type="text" placeholder="Search customers" className="search-input" />
>>>>>>> d363137f586a6fe1478bf9d4fdb0d1359314a2a5
                <span className="search-icon">🔍</span>
                <button type="submit" className="search-btn" disabled={isLoading}>
                  {isLoading ? '⌛' : '🔍'}
                </button>
              </form>

              {isLoading ? (
                <div className="loading-message">Loading customers...</div>
              ) : (
                <div className="customer-list">
                  {customers.map((c, i) => (
                    <div 
                      key={c.id} 
                      className={`customer-item ${selectedCustomer?.id === c.id ? 'selected' : ''}`}
                      onClick={() => handleSelectCustomer(c)}
                    >
                      <div className={`customer-avatar ${getColorClass(i)}`}>
                        {getInitials(c.givenName, c.familyName)}
                      </div>
                      <div className="customer-info">
                        <p className="customer-name">{c.givenName} {c.familyName}</p>
                        <p className="customer-email">{c.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form */}
            <div className="form-container">
              <form onSubmit={handleSubmit} className="form-card">
                <div className="form-header">
                  <div className="form-icon"><span>+</span></div>
                  <h3 className="form-title">
                    {mode === 'create' ? 'Add new customer' : 
                     mode === 'edit' ? 'Edit customer' : 'Customer details'}
                  </h3>
                </div>
                <div className="form-content">
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="givenName"
                        placeholder="Given Name *"
                        value={formData.givenName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.givenName ? 'error' : ''}`}
                        disabled={mode === 'view'}
                      />
                      {errors.givenName && <span className="error-message">{errors.givenName}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="familyName"
                        placeholder="Family Name *"
                        value={formData.familyName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.familyName ? 'error' : ''}`}
                        disabled={mode === 'view'}
                      />
                      {errors.familyName && <span className="error-message">{errors.familyName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="number"
                        name="ageYears"
                        placeholder="Age Years"
                        value={formData.ageYears}
                        onChange={handleInputChange}
                        className={`form-input ${errors.ageYears ? 'error' : ''}`}
                        min="0"
                        max="120"
                        disabled={mode === 'view'}
                      />
                      {errors.ageYears && <span className="error-message">{errors.ageYears}</span>}
                    </div>
                    <div className="form-group">
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={mode === 'view'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="nicPassport"
                      placeholder="NIC/Passport No"
                      value={formData.nicPassport}
                      onChange={handleInputChange}
                      className={`form-input ${errors.nicPassport ? 'error' : ''}`}
                      disabled={mode === 'view'}
                    />
                    {errors.nicPassport && <span className="error-message">{errors.nicPassport}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={mode === 'view'}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="nationality"
                        placeholder="Nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="form-input"
                        disabled={mode === 'view'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      disabled={mode === 'view'}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      name="phoneNo"
                      placeholder="Phone No"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phoneNo ? 'error' : ''}`}
                      disabled={mode === 'view'}
                    />
                    {errors.phoneNo && <span className="error-message">{errors.phoneNo}</span>}
                  </div>

                  <div className="form-group">
                    <textarea
                      name="address"
                      placeholder="Address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-textarea"
                      disabled={mode === 'view'}
                    />
                  </div>

                  <div className="form-submit">
                    {mode === 'view' ? (
                      <div className="action-buttons">
                        <button 
                          type="button" 
                          className="delete-btn"
                          onClick={handleDelete}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                        <button 
                          type="button" 
                          className="view-btn"
                          onClick={handleEdit}
                        >
                          <Edit size={16} /> Edit
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : mode === 'create' ? 'CREATE' : 'UPDATE'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}