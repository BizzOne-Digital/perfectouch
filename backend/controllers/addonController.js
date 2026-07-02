const Addon = require('../models/Addon');
const { cloudinary } = require('../config/cloudinary');

// Public - only active add-ons
exports.getAddons = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const addons = await Addon.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(addons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAddon = async (req, res) => {
  try {
    const { name, description, price, duration, image, cloudinaryId, order } = req.body;
    const addon = await Addon.create({ name, description, price, duration, image, cloudinaryId, order });
    res.status(201).json(addon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAddon = async (req, res) => {
  try {
    const addon = await Addon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(addon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddon = async (req, res) => {
  try {
    const addon = await Addon.findById(req.params.id);
    if (!addon) return res.status(404).json({ message: 'Not found' });
    if (addon.cloudinaryId) {
      try { await cloudinary.uploader.destroy(addon.cloudinaryId); } catch (e) { /* ignore */ }
    }
    await Addon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
