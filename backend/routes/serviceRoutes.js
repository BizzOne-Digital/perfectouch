const express = require('express');
const router = express.Router();
const { getServices, updateService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.get('/', getServices);
router.put('/:id', protect, updateService);

module.exports = router;
