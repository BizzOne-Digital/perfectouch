// galleryRoutes.js
const express = require('express');
const router = express.Router();
const { getGallery, addGalleryItem, deleteGalleryItem, updateGalleryItem, uploadImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getGallery); // Public
router.post('/', protect, addGalleryItem); // Admin
router.post('/upload', protect, ...uploadImage); // Admin - upload image
router.put('/:id', protect, updateGalleryItem); // Admin
router.delete('/:id', protect, deleteGalleryItem); // Admin

module.exports = router;
