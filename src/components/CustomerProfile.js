import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Get :customerId from URL
import { ChevronDown, Plus, ChevronRight } from 'lucide-react';
import WellVisionInvoice from './WellVisionInvoice';
import './CustomerProfile.css';
import { toast } from 'react-toastify';

const CustomerProfile = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('Personal Details');
  const [expandedSections, setExpandedSections] = useState({
    customerDetails: true,
    prescription: true,
  });
  const [loading, setLoading] = useState(true);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
  if (!customerId) return;

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      console.log('Fetching customer with ID:', customerId);
      const res = await fetch(`http://localhost:5000/api/customers/${customerId}`);

      console.log('Response status:', res.status);

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) throw new Error(data.message || 'Failed to fetch customer');

      setCustomer(data.customer);

      // Set example prescriptions or fetch real ones if available
      setPrescriptions([
        { id: 1, name: 'Prescription 1', description: 'Description', date: '2023-07-01', time: '10:00 AM' },
        { id: 2, name: 'Prescription 2', description: 'Description', date: '2023-07-05', time: '2:00 PM' },
        { id: 3, name: 'Prescription 3', description: 'Description', date: '2023-07-10', time: '11:30 AM' },
      ]);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomer();
}, [customerId]);


  if (loading) return <div className="loading-message">Loading customer profile...</div>;
  if (!customer) return <div className="error-message">Customer not found.</div>;

  const renderSection = (title, isOpen, toggleKey, children) => (
    <section className="profile-card" aria-expanded={isOpen}>
      <div
        className="profile-card-header"
        role="button"
        tabIndex={0}
        onClick={() => toggleSection(toggleKey)}
        onKeyDown={(e) => e.key === 'Enter' && toggleSection(toggleKey)}
      >
        <ChevronRight
          size={18}
          className={`profile-chevron-icon ${isOpen ? 'expanded' : ''}`}
        />
        <h3>{title}</h3>
      </div>
      {isOpen && <div className="profile-card-body">{children}</div>}
    </section>
  );

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-left">
          <h2>
            Customers <ChevronDown size={16} />
          </h2>
        </div>
        <div className="profile-header-right">
          <button className="profile-icon-btn" title="Refresh" onClick={() => window.location.reload()}>
            ⟳
          </button>
          <button className="profile-icon-btn" title="Notifications">
            🔔 <span className="profile-notification-badge">24</span>
          </button>
          <button className="profile-add-new-btn">
            <Plus size={16} /> Add new
          </button>
        </div>
      </header>

      {/* Customer Info */}
      <section className="profile-customer-info">
        <div className="profile-avatar">
          {(customer.givenName?.[0] + customer.familyName?.[0])?.toUpperCase() || 'CU'}
        </div>
        <div className="profile-customer-text">
          <h1>{customer.givenName} {customer.familyName}</h1>
          <p>{customer.phoneNo}</p>
        </div>
      </section>

      {/* Customer Details */}
      {renderSection('Customer Details', expandedSections.customerDetails, 'customerDetails', (
        <>
          <div className="profile-tabs">
            {['Personal Details', 'Job Card', 'Billing', 'xxxxxx', 'xxxxxx'].map((tab) => (
              <button
                key={tab}
                className={`profile-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Personal Details' && (
            <table className="profile-details-table">
              <tbody>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{customer.email}</td>
                  <td><strong>NIC/Passport</strong></td>
                  <td>{customer.nicPassport}</td>
                </tr>
                <tr>
                  <td><strong>Gender</strong></td>
                  <td>{customer.gender}</td>
                  <td><strong>Ethnicity</strong></td>
                  <td>{customer.ethnicity}</td>
                </tr>
                <tr>
                  <td><strong>Address</strong></td>
                  <td>{customer.address}</td>
                  <td><strong>Birth Date</strong></td>
                  <td>{customer.birthDate?.slice(0, 10)}</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'Billing' && (
            <div className="profile-billing-tab">
              <WellVisionInvoice customer={customer} />
            </div>
          )}
        </>
      ))}

      {/* Prescription Section */}
      {renderSection('Prescription', expandedSections.prescription, 'prescription', (
        <table className="profile-prescription-table">
          <thead>
            <tr>
              <th>Prescription</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.id}>
                <td>{prescription.name}</td>
                <td>{prescription.description}</td>
                <td>{prescription.date}</td>
                <td>{prescription.time}</td>
                <td>
                  <button className="profile-view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default CustomerProfile;
