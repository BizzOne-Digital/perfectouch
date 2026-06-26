const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String, enum: ['before-after', 'photo', 'video'], default: 'photo' },
  beforeImage: { type: String },
  afterImage: { type: String },
  image: { type: String },
  videoUrl: { type: String },
  cloudinaryId: { type: String },
  description: { type: String },
  service: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
