 const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  billId: String,
  customerName: String,
  customerPhone: String,
  medicines: Array,
  totalAmount: Number,
  totalGST: Number,
  totalBill: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);