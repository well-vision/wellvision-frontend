// models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  givenName: { type: String, required: true },
  familyName: { type: String, required: true },
  ageYears: { type: Number, required: true },
  birthDate: { type: Date },
  nicPassport: { type: String, required: true },
  gender: { type: String, required: true },
  ethnicity: { type: String, required: true }, // updated from "nationality"
  phoneNo: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
