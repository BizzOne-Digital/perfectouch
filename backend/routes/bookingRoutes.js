const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getBookingById, updateBookingStatus, deleteBooking, getCalendarEvents, squareWebhook } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', createBooking); // Public - create booking
router.post('/square-webhook', squareWebhook); // Public - Square payment webhook
router.get('/', protect, getAllBookings); // Admin
router.get('/calendar', protect, getCalendarEvents); // Admin calendar
router.get('/:id', protect, getBookingById); // Admin
router.put('/:id/status', protect, updateBookingStatus); // Admin
router.delete('/:id', protect, deleteBooking); // Admin

module.exports = router;
