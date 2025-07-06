import React, { useState } from 'react';
import { ChevronDown, Plus, ChevronRight } from 'lucide-react';
import WellVisionInvoice from './WellVisionInvoice';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const customer = {
    givenName: 'Pathum',
    familyName: 'Dilshan',
    phoneNo: '076 658 8177',
    email: 'pathum@example.com',
    nicPassport: '123456789V',
    gender: 'Male',
    ethnicity: 'Sinhalese',
    address: '123 Main St, Colombo',
    birthDate: '1990-01-01',
  };

  const tabs = ['Personal Details', 'Job Card', 'Billing', 'xxxxxx', 'xxxxxx'];
  const [activeTab, setActiveTab] = useState('Personal Details');
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(true);
  const [prescriptionExpanded, setPrescriptionExpanded] = useState(true);

  const prescriptions = [
    { id: 1, name: 'Prescription 1', description: 'Description', date: '2023-07-01', time: '10:00 AM' },
    { id: 2, name: 'Prescription 2', description: 'Description', date: '2023-07-05', time: '2:00 PM' },
    { id: 3, name: 'Prescription 3', description: 'Description', date: '2023-07-10', time: '11:30 AM' },
  ];

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
          <button className="profile-icon-btn" title="Refresh">⟳</button>
          <button className="profile-icon-btn" title="Notifications">🔔 <span className="profile-notification-badge">24</span></button>
          <button className="profile-add-new-btn"><Plus size={16} /> Add new</button>
        </div>
      </header>

      {/* Customer Info */}
      <section className="profile-customer-info">
        <div className="profile-avatar">
          {(customer.givenName[0] + customer.familyName[0]).toUpperCase()}
        </div>
        <div className="profile-customer-text">
          <h1>{customer.givenName} {customer.familyName}</h1>
          <p>{customer.phoneNo}</p>
        </div>
      </section>

      {/* Customer Details Card */}
      <section className="profile-card">
        <div
          className="profile-card-header"
          onClick={() => setCustomerDetailsExpanded(!customerDetailsExpanded)}
        >
          <ChevronRight
            size={18}
            className={`profile-chevron-icon ${customerDetailsExpanded ? 'expanded' : ''}`}
          />
          <h3>Customer Details</h3>
        </div>

        {customerDetailsExpanded && (
          <div className="profile-card-body">
            <div className="profile-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`profile-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Personal Details */}
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
                    <td>{customer.birthDate}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {/* Billing Tab: Show WellVisionInvoice */}
            {activeTab === 'Billing' && (
              <div className="profile-billing-tab">
                <WellVisionInvoice customer={customer} />
              </div>
            )}

            {/* You can implement other tabs (Job Card, etc.) here later */}
          </div>
        )}
      </section>

      {/* Prescription Section */}
      <section className="profile-card">
        <div
          className="profile-card-header"
          onClick={() => setPrescriptionExpanded(!prescriptionExpanded)}
        >
          <ChevronRight
            size={18}
            className={`profile-chevron-icon ${prescriptionExpanded ? 'expanded' : ''}`}
          />
          <h3>Prescription</h3>
        </div>

        {prescriptionExpanded && (
          <div className="profile-card-body">
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
                {prescriptions.map(prescription => (
                  <tr key={prescription.id}>
                    <td>{prescription.name}</td>
                    <td>{prescription.description}</td>
                    <td>{prescription.date}</td>
                    <td>{prescription.time}</td>
                    <td><button className="profile-view-btn">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerProfile;
