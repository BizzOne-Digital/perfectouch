const Booking = require('../models/Booking');
const twilio = require('twilio');

const PRICES = {
  'Interior Detail': 149,
  'Exterior Detail': 119,
  'Full Detail': 249
};

// SMS to Joshua when new booking comes in
const notifyJoshua = async (booking, finalPrice) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const msg =
`New Booking - PerfectTouch!
Name: ${booking.customerName}
Phone: ${booking.phone}
Service: ${booking.service}
Date: ${new Date(booking.date).toLocaleDateString()}
Time: ${booking.timeSlot}
Address: ${booking.address}
Price: $${finalPrice}${booking.discountApplied ? ' (15% off)' : ''}`;

    // Always send to Joshua's number
    await client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.TWILIO_TO_NUMBER, // Joshua: +18458662430
      body: msg
    });

    console.log('✅ Joshua notified via SMS');
  } catch (err) {
    console.error('SMS to Joshua error:', err.message);
  }
};

exports.createBooking = async (req, res) => {
  try {
    const {
      customerName, email, phone, service, vehicleType,
      vehicleMake, vehicleModel, vehicleYear, date,
      timeSlot, address, notes, isFirstTime
    } = req.body;

    const basePrice = PRICES[service] || 0;
    const discountApplied = isFirstTime;
    const finalPrice = discountApplied
      ? parseFloat((basePrice * 0.85).toFixed(2))
      : basePrice;

    const booking = await Booking.create({
      customerName, email, phone, service, vehicleType,
      vehicleMake, vehicleModel, vehicleYear, date,
      timeSlot, address, notes, isFirstTime,
      price: basePrice, discountApplied, finalPrice
    });

    // Notify Joshua about new booking
    await notifyJoshua(booking, finalPrice);

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('invoiceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const bookings = await Booking.find({
      date: { $gte: start, $lte: end },
      status: { $ne: 'Cancelled' }
    });
    const events = bookings.map(b => ({
      id: b._id,
      title: `${b.customerName} - ${b.service}`,
      date: b.date,
      time: b.timeSlot,
      status: b.status
    }));
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};