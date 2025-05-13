 const mongoose = require('mongoose');

 const MedicineRequestSchema = new mongoose.Schema({
   date: { type: Date, default: Date.now },
   medicineName: { type: String, required: true },
   category: { type: String, required: true },
   dosage: { type: String, required: true }, 
   quantity: { type: Number, required: true },
   supplier: { type: String, required: true }, 
  contact: { type: String, required: true }, 
  email: { type: String, required: true },  
  status: { type: String, default: "Pending" },
 });

 module.exports = mongoose.model('MedicineRequest', MedicineRequestSchema);