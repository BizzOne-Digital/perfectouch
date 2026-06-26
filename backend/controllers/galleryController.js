const Gallery = require('../models/Gallery');
const { cloudinary, upload } = require('../config/cloudinary');

exports.getGallery = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addGalleryItem = async (req, res) => {
  try {
    const { title, type, description, service, beforeImage, afterImage, videoUrl } = req.body;
    const item = await Gallery.create({
      title, type, description, service,
      beforeImage, afterImage, videoUrl,
      image: req.file ? req.file.path : null,
      cloudinaryId: req.file ? req.file.filename : null
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      res.json({ url: req.file.path, publicId: req.file.filename });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (item.cloudinaryId) {
      try { await cloudinary.uploader.destroy(item.cloudinaryId); } catch (e) { /* ignore */ }
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
