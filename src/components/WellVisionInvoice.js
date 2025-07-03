import React, { useState } from 'react';
import './WellVisionInvoice.css';


const WellVisionInvoice = () => {
  const [formData, setFormData] = useState({
  orderNo: '',
  date: new Date().toISOString().slice(0, 10),
  billNo: '',
  name: '',
  tel: '',
  address: '',
  items: Array(4).fill(null).map(() => ({ item: '', description: '', rs: '', cts: '' })),
  amount: '',
  advance: '',
  balance: '',
});


  const handleChange = (e, index, field) => {
  if (index !== undefined) {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: e.target.value,
    };
    setFormData({ ...formData, items: updatedItems });
  } else {
    setFormData({ ...formData, [field]: e.target.value });
  }
};


  const renderLineInput = (value, onChange, width = '200px') => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{
        border: 'none',
        borderBottom: '1px dotted black',
        outline: 'none',
        width,
        background: 'transparent',
      }}
    />
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Invoice saved successfully!');
        // Optionally reset form here
      } else {
        alert('Failed to save invoice: ' + data.message);
      }
    } catch (error) {
      alert('Error saving invoice: ' + error.message);
    }
  };

  return (
    <form className="bill-container" onSubmit={handleSubmit}>
      {/* Your entire existing JSX below remains unchanged */}
      <div className="header">
        <div className="logo-section">
          <img src="/logo.png" alt="Well Vision Logo" className="logo" />
          <div>
            <h1>WELL VISION</h1>
            <p className="tagline">THE PATH TO CLEAR VISION</p>
            <p className="br-number">BR.No. PV00281194</p>
            <div className="services-box">
              <div className="services">
                Specialized eye channelling + Investigation, theater, glaucoma diagnosis + Treatment, computerized <br />
                eye testing + optical paradise, Spectacle Frames, Lenses, Contact Lenses + Colour Contact Lenses, Sun Glasses
              </div>
            </div>
          </div>
        </div>
        <div className="contact-section">
          <p>Kalawewa Junction, Galewela</p>
          <p>+94 664336709 / +94 777 136 79</p>
          <p>wellvision.lk@gmail.com</p>
        </div>
      </div>

      <div className="info-row">
        <span>Order No : {renderLineInput(formData.orderNo, e => handleChange(e, undefined, 'orderNo'), '200px')}</span>
        <span>Date : {renderLineInput(formData.date, e => handleChange(e, undefined, 'date'), '200px')}</span>
        <span>Bill No : {renderLineInput(formData.billNo, e => handleChange(e, undefined, 'billNo'), '150px')}</span>
      </div>

      <div className="info-row">
        <span>Name : {renderLineInput(formData.name, e => handleChange(e, undefined, 'name'), '590px')}</span>
        <span>Tel : {renderLineInput(formData.tel, e => handleChange(e, undefined, 'tel'), '150px')}</span>
      </div>

      <div className="info-row">
        <span>Address : {renderLineInput(formData.address, e => handleChange(e, undefined, 'address'), '580px')}</span>
      </div>

      <br />
      <table className="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Rs.</th>
            <th>Cts.</th>
          </tr>
        </thead>
        <tbody>
          {formData.items.map((row, i) => (
            <tr key={i}>
              <td>{renderLineInput(row.item, e => handleChange(e, i, 'item'))}</td>
              <td>{renderLineInput(row.description, e => handleChange(e, i, 'description'))}</td>
              <td>{renderLineInput(row.rs, e => handleChange(e, i, 'rs'), '60px')}</td>
              <td>{renderLineInput(row.cts, e => handleChange(e, i, 'cts'), '60px')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer-section">
        <div className="signature">
          ...............................................................
          <br />
          Signature
        </div>
        <div className="amounts">
          <p>Amount {renderLineInput(formData.amount, e => handleChange(e, undefined, 'amount'), '150px')}</p>
          <p>Advance {renderLineInput(formData.advance, e => handleChange(e, undefined, 'advance'), '150px')}</p>
          <p>Balance {renderLineInput(formData.balance, e => handleChange(e, undefined, 'balance'), '150px')}</p>
        </div>
      </div>

      <div className="notice">
        <p>
          Please note that your confirmed order cannot be changed or cancelled. Advance paid would not be refunded
        </p>
        <p className="sinhala">
          **********************************sinhala content**********************************
        </p>
        <p className="notice-bottom">
          We do not hold responsibility to any orders not removed within 3 months
          <br />
          Items once sold cannot be returned
        </p>
        <p className="sinhala">
          **********************************sinhala content**********************************
        </p>
      </div>

      <div className="galewela">Galewela</div>

      {/* Add Submit button here */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button type="submit" style={{ padding: '10px 30px', fontSize: '16px', cursor: 'pointer' }}>
          Save Invoice
        </button>
      </div>
    </form>
  );
};

export default WellVisionInvoice;
