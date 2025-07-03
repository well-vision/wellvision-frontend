// routes/invoiceRoutes.js
import express from 'express';
import { createInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

// ✅ Route to create a new invoice using the controller
router.post('/create', createInvoice);

export default router;
