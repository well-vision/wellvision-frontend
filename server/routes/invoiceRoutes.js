import express from 'express';
import { createInvoice } from '../controllers/invoiceController.js';
import Counter from '../models/counterModel.js';

const router = express.Router();

// ✅ Generate and return the next Bill No
router.get('/next-bill-no', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'billNo' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formattedBillNo = `INV-${String(counter.seq).padStart(4, '0')}`; // e.g., INV-0005

    res.json({ success: true, nextBillNo: formattedBillNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error generating Bill No' });
  }
});

router.post('/create', createInvoice); // Your invoice save route

export default router;
