const express = require('express');
const router = express.Router();
const { generateInvoice, getAllInvoices, getInvoiceById, updateInvoiceStatus, sendInvoiceEmail } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllInvoices);
router.get('/:id', protect, getInvoiceById);
router.post('/generate/:bookingId', protect, generateInvoice);
router.put('/:id/status', protect, updateInvoiceStatus);
router.post('/:id/send', protect, sendInvoiceEmail);

module.exports = router;
