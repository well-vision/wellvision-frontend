import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { ChevronDown, Plus, ChevronRight } from 'lucide-react';
import WellVisionInvoice from './WellVisionInvoice';
=======
import { ChevronDown, Plus, ChevronRight, ArrowLeft, Edit, Download } from 'lucide-react';
import WellVisionInvoice from './WellVisionInvoice';
import PrescriptionForm from './PrescriptionForm';
>>>>>>> da5e7a0 (Initial Commit)
import './CustomerProfile.css';
import { toast } from 'react-toastify';

const CustomerProfile = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('Personal Details');
  const [expandedSections, setExpandedSections] = useState({
    customerDetails: true,
    prescription: true,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
<<<<<<< HEAD
=======
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
>>>>>>> da5e7a0 (Initial Commit)

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
        const res = await fetch(`http://localhost:4000/api/customers/${customerId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch customer');

        setCustomer(data.customer);
<<<<<<< HEAD
        setPrescriptions([
          { id: 1, name: 'Prescription 1', description: 'Description', date: '2023-07-01', time: '10:00 AM' },
          { id: 2, name: 'Prescription 2', description: 'Description', date: '2023-07-05', time: '2:00 PM' },
          { id: 3, name: 'Prescription 3', description: 'Description', date: '2023-07-10', time: '11:30 AM' },
        ]);
=======
        setPrescriptions([]);
>>>>>>> da5e7a0 (Initial Commit)
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

<<<<<<< HEAD
  if (loading) return <div className="loading-message">Loading customer profile...</div>;
  if (!customer) return <div className="error-message">Customer not found.</div>;
=======
  // Prescription functions
  const handleCreatePrescription = () => {
    setShowPrescriptionForm(true);
  };

  const handleSavePrescription = async (prescriptionData) => {
    try {
      const newPrescription = {
        id: Date.now().toString(),
        ...prescriptionData,
        createdAt: new Date().toISOString()
      };
      
      setPrescriptions(prev => [newPrescription, ...prev]);
      setShowPrescriptionForm(false);
      toast.success('Prescription created successfully!');
    } catch (error) {
      toast.error('Failed to save prescription');
    }
  };

  const handleEditPrescription = (prescriptionId) => {
    toast.info('Edit prescription functionality coming soon!');
  };

  const handleDownloadPrescription = (prescription) => {
    toast.info('Download prescription functionality coming soon!');
  };

  const handleCancelPrescription = () => {
    setShowPrescriptionForm(false);
  };

  // Edit customer functions
  const handleSaveCustomer = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/customers/${customer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      toast.success('Customer updated successfully');
      setCustomer(data.customer);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };
>>>>>>> da5e7a0 (Initial Commit)

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

<<<<<<< HEAD
=======
  if (loading) return <div className="loading-message">Loading customer profile...</div>;
  if (!customer) return <div className="error-message">Customer not found.</div>;

>>>>>>> da5e7a0 (Initial Commit)
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-header-left">
<<<<<<< HEAD
=======
          <button 
            className="profile-back-btn"
            onClick={() => navigate('/customers')}
            title="Back to Customers"
          >
            <ArrowLeft size={16} />
          </button>
>>>>>>> da5e7a0 (Initial Commit)
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
          <button
            className="profile-add-new-btn"
            onClick={() => navigate('/customers')}
            title="Add new customer"
          >
            <Plus size={16} /> Add new
          </button>
        </div>
      </header>

      <section className="profile-customer-info">
        <div className="profile-avatar">
          {(customer.givenName?.[0] + customer.familyName?.[0])?.toUpperCase() || 'CU'}
        </div>
        <div className="profile-customer-text">
          <h1>{customer.givenName} {customer.familyName}</h1>
          <p>{customer.phoneNo}</p>
        </div>
      </section>

<<<<<<< HEAD
      {renderSection('Customer Details', expandedSections.customerDetails, 'customerDetails', (
        <>
          <div className="profile-tabs">
            {['Personal Details', 'Job Card', 'Billing', 'xxxxxx', 'xxxxxx'].map((tab) => (
=======
      {/* Customer Details Section */}
      {renderSection('Customer Details', expandedSections.customerDetails, 'customerDetails', (
        <>
          <div className="profile-tabs">
            {['Personal Details', 'Prescriptions', 'Billing', 'xxxxxx', 'xxxxxx'].map((tab) => (
>>>>>>> da5e7a0 (Initial Commit)
              <button
                key={tab}
                className={`profile-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

<<<<<<< HEAD
          {activeTab === 'Personal Details' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditForm(customer);
=======
          {/* Personal Details Tab - ONLY personal details */}
          {activeTab === 'Personal Details' && (
            <>
              <div className="profile-edit-actions">
                {!isEditing ? (
                  <button
                    className="profile-edit-btn"
                    onClick={() => {
                      setIsEditing(true);
                      setEditForm({...customer});
>>>>>>> da5e7a0 (Initial Commit)
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
<<<<<<< HEAD
                      onClick={async () => {
                        try {
                          const res = await fetch(`http://localhost:4000/api/customers/${customer._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editForm),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || 'Update failed');
                          toast.success('Customer updated successfully');
                          setCustomer(data.customer);
                          setIsEditing(false);
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                    >
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                )}
              </div>
=======
                      className="profile-save-btn"
                      onClick={handleSaveCustomer}
                    >
                      Save
                    </button>
                    <button 
                      className="profile-cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
              
>>>>>>> da5e7a0 (Initial Commit)
              <table className="profile-details-table">
                <tbody>
                  <tr>
                    <td><strong>Email</strong></td>
<<<<<<< HEAD
                    <td>{isEditing ? (
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      customer.email
                    )}</td>
                    <td><strong>NIC/Passport</strong></td>
                    <td>{isEditing ? (
                      <input
                        value={editForm.nicPassport || ''}
                        onChange={e => setEditForm({ ...editForm, nicPassport: e.target.value })}
                      />
                    ) : (
                      customer.nicPassport
                    )}</td>
                  </tr>
                  <tr>
                    <td><strong>Gender</strong></td>
                    <td>{isEditing ? (
                      <select
                        value={editForm.gender || ''}
                        onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      customer.gender
                    )}</td>
                    <td><strong>Ethnicity</strong></td>
                    <td>{isEditing ? (
                      <input
                        value={editForm.ethnicity || ''}
                        onChange={e => setEditForm({ ...editForm, ethnicity: e.target.value })}
                      />
                    ) : (
                      customer.ethnicity
                    )}</td>
                  </tr>
                  <tr>
                    <td><strong>Address</strong></td>
                    <td>{isEditing ? (
                      <input
                        value={editForm.address || ''}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    ) : (
                      customer.address
                    )}</td>
                    <td><strong>Birth Date</strong></td>
                    <td>{isEditing ? (
                      <input
                        type="date"
                        value={editForm.birthDate?.slice(0, 10) || ''}
                        onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                      />
                    ) : (
                      customer.birthDate?.slice(0, 10)
                    )}</td>
=======
                    <td>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          className="edit-input"
                        />
                      ) : (
                        customer.email
                      )}
                    </td>
                    <td><strong>NIC/Passport</strong></td>
                    <td>
                      {isEditing ? (
                        <input
                          value={editForm.nicPassport || ''}
                          onChange={e => setEditForm({ ...editForm, nicPassport: e.target.value })}
                          className="edit-input"
                        />
                      ) : (
                        customer.nicPassport
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Gender</strong></td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editForm.gender || ''}
                          onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                          className="edit-input"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        customer.gender
                      )}
                    </td>
                    <td><strong>Ethnicity</strong></td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editForm.ethnicity || ''}
                          onChange={e => setEditForm({ ...editForm, ethnicity: e.target.value })}
                          className="edit-input"
                        >
                          <option value="">Select Ethnicity</option>
                          <option value="Sinhalese">Sinhalese</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Moor">Moor</option>
                          <option value="Malay">Malay</option>
                          <option value="Burghers">Burghers</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        customer.ethnicity
                      )}
                    </td>
                  </tr>
                  <tr>
                  <td><strong>Address</strong></td>
                  <td>
                  {isEditing ? (
                    <input
                        value={editForm.address || ''}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                        className="edit-input"
                        style={{ width: '100%' }}
                      />
                    ) : (
                        customer.address
                    )}
                  </td>
                  <td><strong>Phone Number</strong></td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editForm.phoneNo || ''}
                        onChange={e => setEditForm({ ...editForm, phoneNo: e.target.value })}
                        className="edit-input"
                      />
                    ) : (
                      customer.phoneNo
                    )}
                  </td>
                </tr>
                  <tr>
                    <td><strong>Birth Date</strong></td>
                    <td>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editForm.birthDate?.slice(0, 10) || ''}
                          onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                          className="edit-input"
                        />
                      ) : (
                        customer.birthDate?.slice(0, 10)
                      )}
                    </td>
                    <td><strong>Age</strong></td>
                    <td>{customer.ageYears} years</td>
>>>>>>> da5e7a0 (Initial Commit)
                  </tr>
                </tbody>
              </table>
            </>
          )}

<<<<<<< HEAD
=======
          {/* Prescriptions Tab - ONLY prescriptions */}
          {activeTab === 'Prescriptions' && (
            <div className="prescription-tab-content">
              {prescriptions.length === 0 ? (
                <div className="no-prescriptions">
                  <p>No prescriptions found for this customer.</p>
                  <button 
                    className="create-prescription-btn"
                    onClick={handleCreatePrescription}
                  >
                    <Plus size={16} />
                    Create New Prescription
                  </button>
                </div>
              ) : (
                <>
                  <div className="prescription-actions">
                    <button 
                      className="create-prescription-btn"
                      onClick={handleCreatePrescription}
                    >
                      <Plus size={16} />
                      Create New Prescription
                    </button>
                  </div>
                  
                  <table className="profile-prescription-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Right Eye</th>
                        <th>Left Eye</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                          <td>{new Date(prescription.date).toLocaleDateString()}</td>
                          <td>
                            D: {prescription.rightDistanceSph || 'N/A'} 
                            {prescription.rightDistanceCyl && `/${prescription.rightDistanceCyl}`}
                            {prescription.rightDistanceAxis && `@${prescription.rightDistanceAxis}`}
                            <br />
                            N: {prescription.rightNearSph || 'N/A'}
                            {prescription.rightNearCyl && `/${prescription.rightNearCyl}`}
                            {prescription.rightNearAxis && `@${prescription.rightNearAxis}`}
                          </td>
                          <td>
                            D: {prescription.leftDistanceSph || 'N/A'} 
                            {prescription.leftDistanceCyl && `/${prescription.leftDistanceCyl}`}
                            {prescription.leftDistanceAxis && `@${prescription.leftDistanceAxis}`}
                            <br />
                            N: {prescription.leftNearSph || 'N/A'}
                            {prescription.leftNearCyl && `/${prescription.leftNearCyl}`}
                            {prescription.leftNearAxis && `@${prescription.leftNearAxis}`}
                          </td>
                          <td className="remarks-cell">
                            {prescription.remarks ? 
                              prescription.remarks.substring(0, 30) + 
                              (prescription.remarks.length > 30 ? '...' : '') 
                              : 'No remarks'
                            }
                          </td>
                          <td>
                            <div className="prescription-action-buttons">
                              <button 
                                className="action-btn edit-btn"
                                onClick={() => handleEditPrescription(prescription.id)}
                                title="Edit Prescription"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="action-btn download-btn"
                                onClick={() => handleDownloadPrescription(prescription)}
                                title="Download Prescription"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}

          {/* Billing Tab */}
>>>>>>> da5e7a0 (Initial Commit)
          {activeTab === 'Billing' && (
            <div className="profile-billing-tab">
              <WellVisionInvoice customer={customer} />
            </div>
          )}
<<<<<<< HEAD
        </>
      ))}

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
=======

          {/* Other Tabs */}
          {activeTab === 'xxxxxx' && (
            <div className="tab-content">
              <p>This section is under development.</p>
            </div>
          )}
        </>
      ))}

      

      {/* Prescription Form Modal */}
      {showPrescriptionForm && (
        <PrescriptionForm
          customer={customer}
          onSave={handleSavePrescription}
          onCancel={handleCancelPrescription}
        />
      )}
>>>>>>> da5e7a0 (Initial Commit)
    </div>
  );
};

<<<<<<< HEAD
export default CustomerProfile;
=======
export default CustomerProfile;
>>>>>>> da5e7a0 (Initial Commit)
