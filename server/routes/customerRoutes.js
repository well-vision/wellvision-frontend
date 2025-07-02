// server/routes/customerRoutes.js
import express from 'express';
import Customer from '../models/customer.js';

const router = express.Router();

// GET: Get all customers (with optional search)
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  try {
    const customers = await Customer.find({
      $or: [
        { givenName: { $regex: search, $options: 'i' } },
        { familyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 }); // optional: show latest first
    res.json({ data: customers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
});

// POST: Add new customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({
      message: 'Customer added successfully',
      customer,
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add customer', error: err.message });
  }
});

// PUT: Update existing customer by _id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer updated successfully', customer: updated });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update customer', error: err.message });
  }
});

// DELETE: Delete customer by _id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer', error: err.message });
  }
});

export default router;
