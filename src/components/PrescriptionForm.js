import React, { useState } from 'react';
import './PrescriptionForm.css';

const PrescriptionForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    patientName: '',
    age: '',
    vaRight: '',
    vaLeft: '',
    phRight: '',
    phLeft: '',
    dm: '',
    ht: '',
    glaucoma: '',
    distanceHbRSph: '', distanceHbRCyl: '', distanceHbRAxis: '',
    distanceSRNSph: '', distanceSRNCyl: '', distanceSRNAxis: '',
    distanceCYLSph: '', distanceCYLCyl: '', distanceCYLAxis: '',
    distanceAXISSph: '', distanceAXISCyl: '', distanceAXISAxis: '',
    nearHbRSph: '', nearHbRCyl: '', nearHbRAxis: '',
    nearSRNSph: '', nearSRNCyl: '', nearSRNAxis: '',
    nearCYLSph: '', nearCYLCyl: '', nearCYLAxis: '',
    nearAXISSph: '', nearAXISCyl: '', nearAXISAxis: '',
    prescriptionDistanceRightSph: '', prescriptionDistanceRightCyl: '', prescriptionDistanceRightAxis: '',
    prescriptionDistanceLeftSph: '', prescriptionDistanceLeftCyl: '', prescriptionDistanceLeftAxis: '',
    prescriptionNearRightSph: '', prescriptionNearRightCyl: '', prescriptionNearRightAxis: '',
    prescriptionNearLeftSph: '', prescriptionNearLeftCyl: '', prescriptionNearLeftAxis: '',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewPrescription = () => {
    setShowForm(true);
    setFormData({
      date: '',
      patientName: '',
      age: '',
      vaRight: '',
      vaLeft: '',
      phRight: '',
      phLeft: '',
      dm: '',
      ht: '',
      glaucoma: '',
      distanceHbRSph: '', distanceHbRCyl: '', distanceHbRAxis: '',
      distanceSRNSph: '', distanceSRNCyl: '', distanceSRNAxis: '',
      distanceCYLSph: '', distanceCYLCyl: '', distanceCYLAxis: '',
      distanceAXISSph: '', distanceAXISCyl: '', distanceAXISAxis: '',
      nearHbRSph: '', nearHbRCyl: '', nearHbRAxis: '',
      nearSRNSph: '', nearSRNCyl: '', nearSRNAxis: '',
      nearCYLSph: '', nearCYLCyl: '', nearCYLAxis: '',
      nearAXISSph: '', nearAXISCyl: '', nearAXISAxis: '',
      prescriptionDistanceRightSph: '', prescriptionDistanceRightCyl: '', prescriptionDistanceRightAxis: '',
      prescriptionDistanceLeftSph: '', prescriptionDistanceLeftCyl: '', prescriptionDistanceLeftAxis: '',
      prescriptionNearRightSph: '', prescriptionNearRightCyl: '', prescriptionNearRightAxis: '',
      prescriptionNearLeftSph: '', prescriptionNearLeftCyl: '', prescriptionNearLeftAxis: '',
      remarks: ''
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!showForm) {
    return (
      <div className="prescription-container">
        <button className="new-prescription-btn" onClick={handleNewPrescription}>
          New Prescription
        </button>
      </div>
    );
  }

  return (
    <div className="prescription-container">
      <div className="prescription-form">
        {/* Header Section */}
        <div className="header-section">
          <div className="clinic-name">WELL VISION</div>
          <div className="clinic-tagline">THE PATH TO CLEAR VISION</div>
          <div className="clinic-info">
            <span>Kalawewa Junction,Galewela</span>
            <span>+94 664336709 / +94 777 136 79</span>
            <span>wellvision.lk@gmail.com</span>
          </div>
          <div className="br-number">BR.No. PV00281194</div>
        </div>

        {/* Patient Information */}
        <div className="patient-info">
          <div className="info-field">
            <label>Date :</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="......"
            />
          </div>
          <div className="info-field">
            <label>PLName :</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder="......"
            />
          </div>
          <div className="info-field">
            <label>Age :</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="......"
            />
          </div>
        </div>

        {/* VA and PH Section */}
        <div className="va-ph-section">
          <div className="va-section">
            <div className="section-label">VA</div>
            <div className="input-group">
              <div className="input-field">
                <label>R</label>
                <input
                  type="text"
                  name="vaRight"
                  value={formData.vaRight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label>L</label>
                <input
                  type="text"
                  name="vaLeft"
                  value={formData.vaLeft}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="ph-section">
            <div className="section-label">PH</div>
            <div className="input-group">
              <div className="input-field">
                <label>R</label>
                <input
                  type="text"
                  name="phRight"
                  value={formData.phRight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-field">
                <label>L</label>
                <input
                  type="text"
                  name="phLeft"
                  value={formData.phLeft}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="conditions-section">
          <div className="condition">
            <label>DM</label>
            <input
              type="text"
              name="dm"
              value={formData.dm}
              onChange={handleInputChange}
            />
          </div>
          <div className="condition">
            <label>HT</label>
            <input
              type="text"
              name="ht"
              value={formData.ht}
              onChange={handleInputChange}
            />
          </div>
          <div className="condition">
            <label>Glaucoma</label>
            <input
              type="text"
              name="glaucoma"
              value={formData.glaucoma}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <hr className="divider" />

        {/* First Table */}
        <div className="table-section">
          <div className="table-header">
            <span className="eye-label">RIGHT</span>
            <div className="measurements-header">
              <span>HbR</span>
              <span>SRN</span>
              <span>CYL</span>
              <span>AXIS</span>
            </div>
          </div>
          <div className="table">
            <div className="table-row">
              <div className="row-label">DISTANCE</div>
              <div className="measurements">
                <input type="text" name="distanceHbRSph" value={formData.distanceHbRSph} onChange={handleInputChange} />
                <input type="text" name="distanceHbRCyl" value={formData.distanceHbRCyl} onChange={handleInputChange} />
                <input type="text" name="distanceHbRAxis" value={formData.distanceHbRAxis} onChange={handleInputChange} />
                <input type="text" name="distanceSRNSph" value={formData.distanceSRNSph} onChange={handleInputChange} />
                <input type="text" name="distanceSRNCyl" value={formData.distanceSRNCyl} onChange={handleInputChange} />
                <input type="text" name="distanceSRNAxis" value={formData.distanceSRNAxis} onChange={handleInputChange} />
                <input type="text" name="distanceCYLSph" value={formData.distanceCYLSph} onChange={handleInputChange} />
                <input type="text" name="distanceCYLCyl" value={formData.distanceCYLCyl} onChange={handleInputChange} />
                <input type="text" name="distanceCYLAxis" value={formData.distanceCYLAxis} onChange={handleInputChange} />
                <input type="text" name="distanceAXISSph" value={formData.distanceAXISSph} onChange={handleInputChange} />
                <input type="text" name="distanceAXISCyl" value={formData.distanceAXISCyl} onChange={handleInputChange} />
                <input type="text" name="distanceAXISAxis" value={formData.distanceAXISAxis} onChange={handleInputChange} />
              </div>
            </div>
            <div className="table-row">
              <div className="row-label">NEAR</div>
              <div className="measurements">
                <input type="text" name="nearHbRSph" value={formData.nearHbRSph} onChange={handleInputChange} />
                <input type="text" name="nearHbRCyl" value={formData.nearHbRCyl} onChange={handleInputChange} />
                <input type="text" name="nearHbRAxis" value={formData.nearHbRAxis} onChange={handleInputChange} />
                <input type="text" name="nearSRNSph" value={formData.nearSRNSph} onChange={handleInputChange} />
                <input type="text" name="nearSRNCyl" value={formData.nearSRNCyl} onChange={handleInputChange} />
                <input type="text" name="nearSRNAxis" value={formData.nearSRNAxis} onChange={handleInputChange} />
                <input type="text" name="nearCYLSph" value={formData.nearCYLSph} onChange={handleInputChange} />
                <input type="text" name="nearCYLCyl" value={formData.nearCYLCyl} onChange={handleInputChange} />
                <input type="text" name="nearCYLAxis" value={formData.nearCYLAxis} onChange={handleInputChange} />
                <input type="text" name="nearAXISSph" value={formData.nearAXISSph} onChange={handleInputChange} />
                <input type="text" name="nearAXISCyl" value={formData.nearAXISCyl} onChange={handleInputChange} />
                <input type="text" name="nearAXISAxis" value={formData.nearAXISAxis} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Header */}
        <div className="prescription-header">
          THE PRESCRIPTION
        </div>

        {/* Second Table */}
        <div className="table-section">
          <div className="table-header">
            <span className="eye-label">RIGHT</span>
            <div className="measurements-header">
              <span>SPH</span>
              <span>CYL</span>
              <span>AXIS</span>
              <span>SPH</span>
              <span>CYL</span>
              <span>AXIS</span>
            </div>
          </div>
          <div className="table">
            <div className="table-row">
              <div className="row-label">DISTANCE</div>
              <div className="measurements">
                <input type="text" name="prescriptionDistanceRightSph" value={formData.prescriptionDistanceRightSph} onChange={handleInputChange} />
                <input type="text" name="prescriptionDistanceRightCyl" value={formData.prescriptionDistanceRightCyl} onChange={handleInputChange} />
                <input type="text" name="prescriptionDistanceRightAxis" value={formData.prescriptionDistanceRightAxis} onChange={handleInputChange} />
                <input type="text" name="prescriptionDistanceLeftSph" value={formData.prescriptionDistanceLeftSph} onChange={handleInputChange} />
                <input type="text" name="prescriptionDistanceLeftCyl" value={formData.prescriptionDistanceLeftCyl} onChange={handleInputChange} />
                <input type="text" name="prescriptionDistanceLeftAxis" value={formData.prescriptionDistanceLeftAxis} onChange={handleInputChange} />
              </div>
            </div>
            <div className="table-row">
              <div className="row-label">NEAR</div>
              <div className="measurements">
                <input type="text" name="prescriptionNearRightSph" value={formData.prescriptionNearRightSph} onChange={handleInputChange} />
                <input type="text" name="prescriptionNearRightCyl" value={formData.prescriptionNearRightCyl} onChange={handleInputChange} />
                <input type="text" name="prescriptionNearRightAxis" value={formData.prescriptionNearRightAxis} onChange={handleInputChange} />
                <input type="text" name="prescriptionNearLeftSph" value={formData.prescriptionNearLeftSph} onChange={handleInputChange} />
                <input type="text" name="prescriptionNearLeftCyl" value={formData.prescriptionNearLeftCyl} onChange={handleInputChange} />
                <input type="text" name="prescriptionNearLeftAxis" value={formData.prescriptionNearLeftAxis} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="remarks-section">
          <label>Remarks :</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder=""
          />
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="print-btn" onClick={handlePrint}>
            Print Prescription
          </button>
          <button className="new-prescription-btn" onClick={handleNewPrescription}>
            New Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;