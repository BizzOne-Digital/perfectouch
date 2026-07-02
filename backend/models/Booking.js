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
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },

  // ---- Square Deposit ----
  depositPercent: { type: Number, default: 0 },       // e.g. 25 (%)
  depositAmount: { type: Number, default: 0 },        // $ amount customer se maanga
  depositStatus: {
    type: String,
    enum: ['NotRequired', 'Pending', 'Paid', 'Failed'],
    default: 'NotRequired'
  },
  depositPaymentLinkId: { type: String },             // Square payment link id
  depositPaymentUrl: { type: String },                // customer ko bheja jaane wala link
  depositOrderId: { type: String },                   // Square order id (webhook match ke liye)
  depositPaidAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
