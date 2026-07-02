const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String },
  image: { type: String },
  cloudinaryId: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Addon', addonSchema);
