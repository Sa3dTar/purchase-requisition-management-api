const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contactPerson: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  taxNumber: { type: String }, // مهم جداً للحسابات والفواتير
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);