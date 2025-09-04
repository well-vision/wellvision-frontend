import React, { useEffect, useState } from 'react';
import './WellVisionInvoice.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch next Bill No from backend
  useEffect(() => {
    const fetchBillNo = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/invoices/next-bill-no');
        const data = await res.json();

        if (data.success) {
          setFormData(prev => ({ ...prev, billNo: data.nextBillNo }));
        } else {
          toast.error(data.message || 'Failed to load Bill No');
        }
      } catch (err) {
        toast.error('Error fetching Bill No');
        console.error(err);
      }
    };

    fetchBillNo();
  }, []);

  // Recalculate amount & balance when items or advance changes
  useEffect(() => {
    const total = formData.items.reduce((acc, curr) => {
      const rs = parseFloat(curr.rs) || 0;
      const cts = parseFloat(curr.cts) || 0;
      return acc + rs + cts / 100;
    }, 0);

    const advance = parseFloat(formData.advance) || 0;
    const balance = total - advance;

    setFormData(prev => ({
      ...prev,
      amount: total.toFixed(2),
      balance: balance.toFixed(2),
    }));
  }, [formData.items, formData.advance]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.orderNo.trim()) newErrors.orderNo = 'Order No is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.billNo.trim()) newErrors.billNo = 'Bill No is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.tel.trim()) {
      newErrors.tel = 'Telephone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.tel)) {
      newErrors.tel = 'Enter a valid telephone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    const validItems = formData.items.some(
      item =>
        item.item.trim() !== '' &&
        (!isNaN(item.rs) && item.rs.trim() !== '')
    );
    if (!validItems) newErrors.items = 'At least one item with valid Rs. is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, index, field) => {
    const { value } = e.target;

    if (index !== undefined) {
      const updatedItems = [...formData.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error on change
    if (field && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'items' && errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const renderLineInput = (value, onChange, width = '200px', error = false, type = 'text', name = '') => (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        border: 'none',
        borderBottom: error ? '2px solid red' : '1px dotted black',
        outline: 'none',
        width,
        background: 'transparent',
      }}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${name}-error` : undefined}
      step={type === 'number' ? 'any' : undefined}
      min={type === 'number' ? '0' : undefined}
      autoComplete="off"
    />
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning('Please fix form errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/api/invoices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Respect notification preference for invoice saved toast
        try {
          const prefsRes = await fetch('http://localhost:4000/api/user/settings', { credentials: 'include' });
          const prefsData = await prefsRes.json();
          const showToast = prefsData?.settings?.notifications?.invoiceSavedToast !== false;
          if (showToast) toast.success('Invoice saved successfully!');
        } catch {
          toast.success('Invoice saved successfully!');
        }
        setFormData({
          orderNo: '',
          date: new Date().toISOString().slice(0, 10),
          billNo: '', // New billNo will be fetched
          name: '',
          tel: '',
          address: '',
          items: Array(4).fill(null).map(() => ({ item: '', description: '', rs: '', cts: '' })),
          amount: '',
          advance: '',
          balance: '',
        });
        setErrors({});
        // Refetch new bill number
        const res = await fetch('http://localhost:4000/api/invoices/next-bill-no');
        const data2 = await res.json();
        if (data2.success) {
          setFormData(prev => ({ ...prev, billNo: data2.nextBillNo }));
        }
      } else {
        toast.error('Failed to save invoice: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error saving invoice: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bill-container" onSubmit={handleSubmit} noValidate>
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
        <span>
          Order No :{' '}
          {renderLineInput(
            formData.orderNo,
            e => handleChange(e, undefined, 'orderNo'),
            '200px',
            !!errors.orderNo,
            'text',
            'orderNo'
          )}
          {errors.orderNo && <div id="orderNo-error" className="error-message">{errors.orderNo}</div>}
        </span>
        <span>
          Date :{' '}
          {renderLineInput(
            formData.date,
            e => handleChange(e, undefined, 'date'),
            '200px',
            !!errors.date,
            'date',
            'date'
          )}
          {errors.date && <div id="date-error" className="error-message">{errors.date}</div>}
        </span>
        <span>
          Bill No :{' '}
          {renderLineInput(
            formData.billNo,
            e => handleChange(e, undefined, 'billNo'),
            '150px',
            !!errors.billNo,
            'text',
            'billNo'
          )}
          {errors.billNo && <div id="billNo-error" className="error-message">{errors.billNo}</div>}
        </span>
      </div>

      <div className="info-row">
        <span>
          Name :{' '}
          {renderLineInput(
            formData.name,
            e => handleChange(e, undefined, 'name'),
            '590px',
            !!errors.name,
            'text',
            'name'
          )}
          {errors.name && <div id="name-error" className="error-message">{errors.name}</div>}
        </span>
        <span>
          Tel :{' '}
          {renderLineInput(
            formData.tel,
            e => handleChange(e, undefined, 'tel'),
            '150px',
            !!errors.tel,
            'tel',
            'tel'
          )}
          {errors.tel && <div id="tel-error" className="error-message">{errors.tel}</div>}
        </span>
      </div>

      <div className="info-row">
        <span>
          Address :{' '}
          {renderLineInput(
            formData.address,
            e => handleChange(e, undefined, 'address'),
            '580px',
            !!errors.address,
            'text',
            'address'
          )}
          {errors.address && <div id="address-error" className="error-message">{errors.address}</div>}
        </span>
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
              <td>
                {renderLineInput(row.item, e => handleChange(e, i, 'item'), '150px', false, 'text', `item-${i}`)}
              </td>
              <td>
                {renderLineInput(row.description, e => handleChange(e, i, 'description'), '250px', false, 'text', `description-${i}`)}
              </td>
              <td>
                {renderLineInput(row.rs, e => handleChange(e, i, 'rs'), '60px', !!errors.items, 'number', `rs-${i}`)}
              </td>
              <td>
                {renderLineInput(row.cts, e => handleChange(e, i, 'cts'), '60px', false, 'number', `cts-${i}`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {errors.items && <div className="error-message" style={{ marginBottom: '10px' }}>{errors.items}</div>}

      <div className="footer-section">
        <div className="signature">
          ...............................................................
          <br />
          Signature
        </div>
        <div className="amounts">
          <p>
            Amount{' '}
            {renderLineInput(
              formData.amount,
              () => {}, // no onChange, readonly
              '150px',
              !!errors.amount,
              'text',
              'amount'
            )}
            {errors.amount && <div id="amount-error" className="error-message">{errors.amount}</div>}
          </p>
          <p>
            Advance{' '}
            {renderLineInput(
              formData.advance,
              e => handleChange(e, undefined, 'advance'),
              '150px',
              !!errors.advance,
              'number',
              'advance'
            )}
            {errors.advance && <div id="advance-error" className="error-message">{errors.advance}</div>}
          </p>
          <p>
            Balance{' '}
            {renderLineInput(
              formData.balance,
              () => {}, // no onChange, readonly
              '150px',
              !!errors.balance,
              'text',
              'balance'
            )}
            {errors.balance && <div id="balance-error" className="error-message">{errors.balance}</div>}
          </p>
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

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: '10px 30px', fontSize: 16, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Saving...' : 'Save Invoice'}
        </button>
      </div>
    </form>
  );
};

export default WellVisionInvoice;
