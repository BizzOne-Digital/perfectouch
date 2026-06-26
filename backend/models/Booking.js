const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true, enum: ['Interior Detail', 'Exterior Detail', 'Full Detail'] },
  vehicleType: { type: String, required: true },
  vehicleMake: { type: String },
  vehicleModel: { type: String },
  vehicleYear: { type: String },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, default: 'Sullivan County' },
  notes: { type: String },
  isFirstTime: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  price: { type: Number },
  discountApplied: { type: Boolean, default: false },
  finalPrice: { type: Number },
  invoiceGenerated: { type: Boolean, default: false },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
