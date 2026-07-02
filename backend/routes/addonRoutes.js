const express = require('express');
const router = express.Router();
const { getAddons, createAddon, updateAddon, deleteAddon } = require('../controllers/addonController');
const { uploadImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

router.get('/', getAddons); // Public
router.post('/upload', protect, ...uploadImage); // Admin - upload image (Cloudinary)
router.post('/', protect, createAddon); // Admin
router.put('/:id', protect, updateAddon); // Admin
router.delete('/:id', protect, deleteAddon); // Admin

module.exports = router;
