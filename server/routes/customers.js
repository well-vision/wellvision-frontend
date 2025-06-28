const express = require('express');
const router = express.Router();
const db = require('../db');

// Get customers (with optional search)
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  try {
    const [rows] = await db.execute(
      `SELECT * FROM customers WHERE givenName LIKE ? OR familyName LIKE ? OR email LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// Add customer
router.post('/', async (req, res) => {
  const {
    givenName, familyName, ageYears, birthDate, nicPassport,
    gender, nationality, phoneNo, address, email
  } = req.body;
  
  try {
    const [result] = await db.execute(
      `INSERT INTO customers
      (givenName, familyName, ageYears, birthDate, nicPassport,
       gender, nationality, phoneNo, address, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [givenName, familyName, ageYears, birthDate, nicPassport,
       gender, nationality, phoneNo, address, email]
    );
    res.json({ message: 'Customer added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add customer' });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    givenName, familyName, ageYears, birthDate, nicPassport,
    gender, nationality, phoneNo, address, email
  } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE customers SET
        givenName=?, familyName=?, ageYears=?, birthDate=?, nicPassport=?,
        gender=?, nationality=?, phoneNo=?, address=?, email=?
      WHERE id=?`,
      [givenName, familyName, ageYears, birthDate, nicPassport,
       gender, nationality, phoneNo, address, email, id]
    );
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute(`DELETE FROM customers WHERE id = ?`, [id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete customer' });
  }
});

module.exports = router;
