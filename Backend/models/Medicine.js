const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
   name: { type: String, required: true },
   batchNumber: { type: String, required: true },
   category: { type: String}, 
   strengthDosage: { type: String},
   composition: { type: String},
  storageLocation: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  gstTaxRate: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  supplierName: { type: String, required: true },
  supplierContact: { type: String, required: true }
});

 module.exports = mongoose.model('Medicine', MedicineSchema); 