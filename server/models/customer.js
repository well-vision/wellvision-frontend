// models/Customer.js
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  givenName: String,
  familyName: String,
  ageYears: Number,
  birthDate: Date,
  nicPassport: String,
  gender: String,
  ethnicity : String,
  phoneNo: String,
  address: String,
  email: String,
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
