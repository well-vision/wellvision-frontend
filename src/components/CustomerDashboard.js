// Updated CustomerDashboard.js using regular CSS classes
import React, { useState } from 'react';
import './CustomerDashboard.css';
import {
  Home,
  BarChart3,
  Users,
  Package,
  FileText,
  CreditCard,
  Settings, 
  User
} from 'lucide-react';

export default function CustomerDashboard() {
  const [customers] = useState([
    { id: 1, name: 'Pathum Dilshan', email: 'pathum@example.com' },
    { id: 2, name: 'Sandaru Samitha', email: 'sandaru@example.com' },
    { id: 3, name: 'Kaveesha Gamage', email: 'kaveesha@example.com' },
    { id: 4, name: 'Naveen Dhananjaya', email: 'naveen@example.com' },
    { id: 5, name: 'Ayesh Umayanga', email: 'ayesh@example.com' },
    { id: 6, name: 'Jane Dolle', email: 'jane@example.com' }
  ]);

  const [formData, setFormData] = useState({
    profile: '',
    givenName: '',
    familyName: '',
    ageYears: '',
    birthDate: '',
    nicPassport: '',
    gender: '',
    nationality: '',
    phoneNo: '',
    address: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setFormData({
      profile: '',
      givenName: '',
      familyName: '',
      ageYears: '',
      birthDate: '',
      nicPassport: '',
      gender: '',
      nationality: '',
      phoneNo: '',
      address: ''
    });
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getColorClass = (index) => ['bg-blue', 'bg-green', 'bg-purple', 'bg-red', 'bg-yellow', 'bg-pink'][index % 6];

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>Well Vision</h1>
          <p>Logo</p>
        </div>
        <div className="sidebar-menu">
          <p className="menu-label">MENU</p>
            <div className="menu-nav">
              <a href="#" className="menu-item">
                <Home className="menu-icon" />
                Home
              </a>
              <a href="#" className="menu-item">
                <BarChart3 className="menu-icon" />
                Daily reports
              </a>
              <a href="#" className="menu-item active">
                <Users className="menu-icon" />
                Customers
              </a>
              <a href="#" className="menu-item">
                <Package className="menu-icon" />
                Product
              </a>
              <a href="#" className="menu-item">
                <FileText className="menu-icon" />
                Invoice
              </a>
              <a href="#" className="menu-item">
                <CreditCard className="menu-icon" />
                Bills
              </a>
        </div>

        <div className="sidebar-menu"></div>
          <div className="general-section">
            <p className="menu-label">GENERAL</p>
            <div className="menu-nav">
              <a href="#" className="menu-item">
                <Settings className="menu-icon" />
                Settings
              </a>
              <a href="#" className="menu-item">
                <User className="menu-icon" />
                Profile
              </a>
            </div>
          </div>
        </div>
        <div className="user-profile">
          <div className="user-profile-content">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <p className="user-name">Jane Dolle</p>
              <p className="user-email">janeadmin@example.com</p>
            </div>
          </div>
        </div>
      </div>

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
              <button className="add-new-btn">Add new</button>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="content-flex">
            <div className="customer-list-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search customers"
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
                <button className="search-btn">🔍</button>
              </div>
              <div className="customer-list">
                {customers.map((c, i) => (
                  <div key={c.id} className="customer-item">
                    <div className={`customer-avatar ${getColorClass(i)}`}>{getInitials(c.name)}</div>
                    <div className="customer-info">
                      <p className="customer-name">{c.name}</p>
                      <p className="customer-email">{c.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-container">
              <div className="form-card">
                <div className="form-header">
                  <div className="form-icon"><span>+</span></div>
                  <h3 className="form-title">Add new customer</h3>
                </div>
                <div className="form-content">
                  <div className="form-row">
                    <input type="text" name="profile" placeholder="Profile" value={formData.profile} onChange={handleInputChange} className="form-input" />
                    <input type="text" name="givenName" placeholder="Given Name" value={formData.givenName} onChange={handleInputChange} className="form-input" />
                  </div>
                  <input type="text" name="familyName" placeholder="Family Name" value={formData.familyName} onChange={handleInputChange} className="form-input" />
                  <div className="form-row">
                    <input type="text" name="ageYears" placeholder="Age Years" value={formData.ageYears} onChange={handleInputChange} className="form-input" />
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="form-input" />
                  </div>
                  <input type="text" name="nicPassport" placeholder="NIC / Passport No" value={formData.nicPassport} onChange={handleInputChange} className="form-input" />
                  <div className="form-row">
                    <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleInputChange} className="form-input" />
                    <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleInputChange} className="form-input" />
                  </div>
                  <input type="tel" name="phoneNo" placeholder="Phone No" value={formData.phoneNo} onChange={handleInputChange} className="form-input" />
                  <textarea name="address" placeholder="Address" rows={3} value={formData.address} onChange={handleInputChange} className="form-textarea"></textarea>
                  <div className="form-submit">
                    <button onClick={handleSubmit} className="submit-btn">SUBMIT</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
