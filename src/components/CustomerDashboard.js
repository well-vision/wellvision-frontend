import React, { useState, useEffect } from 'react';
import './CustomerDashboard.css';
import WellVisionInvoice from './WellVisionInvoice';

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
  const [allCustomers, setAllCustomers] = useState([]);  // all fetched customers
  const [filteredCustomers, setFilteredCustomers] = useState([]); // filtered + last 10 latest
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' or 'edit' or 'view'
  const [activePage, setActivePage] = useState('home');

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

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.givenName.trim()) {
      newErrors.givenName = 'Given name is required';
    } else if (formData.givenName.length < 2) {
      newErrors.givenName = 'Must be at least 2 characters';
    }

    if (!formData.familyName.trim()) {
      newErrors.familyName = 'Family name is required';
    } else if (formData.familyName.length < 2) {
      newErrors.familyName = 'Must be at least 2 characters';
    }

    if (!formData.ageYears) {
      newErrors.ageYears = 'Age is required';
    } else if (isNaN(formData.ageYears) || formData.ageYears < 0 || formData.ageYears > 120) {
      newErrors.ageYears = 'Enter a valid age (0–120)';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }

    if (!formData.nicPassport.trim()) {
      newErrors.nicPassport = 'NIC/Passport number is required';
    } else if (!/^[A-Za-z0-9]{5,15}$/.test(formData.nicPassport)) {
      newErrors.nicPassport = '5–15 characters, letters and numbers only';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch all customers once on mount
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/customers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch customers');
      }

      const customers = Array.isArray(data.data) ? data.data : data;

      // Sort by newest first (using createdAt if exists, fallback to _id)
      const sortedCustomers = [...customers].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b._id.localeCompare(a._id);
      });

      setAllCustomers(sortedCustomers);
      setFilteredCustomers(sortedCustomers.slice(0, 10));
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

  // Filter customers by search term on any relevant field
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(allCustomers.slice(0, 10));
      return;
    }

    const term = searchTerm.toLowerCase();

    const filtered = allCustomers.filter(c =>
      c.givenName.toLowerCase().includes(term) ||
      c.familyName.toLowerCase().includes(term) ||
      c.phoneNo.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.nicPassport.toLowerCase().includes(term) ||
      c.nationality.toLowerCase().includes(term)
    );

    setFilteredCustomers(filtered.slice(0, 10));
  }, [searchTerm, allCustomers]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

  // Select customer for view/edit
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      givenName: customer.givenName,
      familyName: customer.familyName,
      ageYears: customer.ageYears,
      birthDate: customer.birthDate ? customer.birthDate.slice(0, 10) : '',
      nicPassport: customer.nicPassport,
      gender: customer.gender,
      nationality: customer.nationality,
      phoneNo: customer.phoneNo,
      address: customer.address,
      email: customer.email
    });
    setMode('view');
  };

  const handleEdit = () => {
    setMode('edit');
  };

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
        ageYears: Number(formData.ageYears)
      };

      let response;
      if (mode === 'create') {
        response = await fetch('http://localhost:5000/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      } else {
        response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer._id}`, {
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

  const handleDelete = async () => {
    if (!selectedCustomer) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedCustomer.givenName} ${selectedCustomer.familyName}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/customers/${selectedCustomer._id}`, {
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

  const getInitials = (givenName, familyName) => {
    return ((givenName?.charAt(0) || '') + (familyName?.charAt(0) || '')).toUpperCase();
  };

  const getColorClass = (index) =>
    ['bg-blue', 'bg-green', 'bg-purple', 'bg-red', 'bg-yellow', 'bg-pink'][index % 6];

  return (
    <div className="main-content" style={{ flex: 1 }}>
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
          {/* Customer List + Search */}
          <div className="customer-list-container">

            <form onSubmit={e => e.preventDefault()} className="search-container">
              <input
                type="text"
                placeholder="Search customers by name, phone, email, etc."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </form>

            {isLoading ? (
              <div className="loading-message">Loading customers...</div>
            ) : (
              <div className="customer-list">
                {filteredCustomers.length === 0 ? (
                  <p>No customers found.</p>
                ) : (
                  filteredCustomers.map((c, i) => (
                    <div
                      key={c._id}
                      className={`customer-item ${selectedCustomer?._id === c._id ? 'selected' : ''}`}
                      onClick={() => handleSelectCustomer(c)}
                    >
                      <div className={`customer-avatar ${getColorClass(i)}`}>
                        {getInitials(c.givenName, c.familyName)}
                      </div>
                      <div className="customer-info">
                        <p className="customer-name">{c.givenName} {c.familyName}</p>
                        <p className="customer-email">{c.email}</p>
                        <p className="customer-phone">{c.phoneNo}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Customer Form */}
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
                    {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
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
                    {errors.gender && <span className="error-message">{errors.gender}</span>}
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
                    {errors.nationality && <span className="error-message">{errors.nationality}</span>}
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
                  {errors.address && <span className="error-message">{errors.address}</span>}
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

      {activePage === 'invoice' && (
        <WellVisionInvoice />
      )}
    </div>
  );
}
