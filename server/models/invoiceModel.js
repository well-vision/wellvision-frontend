// models/invoiceModel.js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  item: String,
  description: String,
  rs: String,
  cts: String,
});

const invoiceSchema = new mongoose.Schema({
  orderNo: String,
  date: { type: Date, default: Date.now },
  billNo: String,
  name: String,
  tel: String,
  address: String,
  items: [itemSchema],
  amount: String,
  advance: String,
  balance: String,
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
