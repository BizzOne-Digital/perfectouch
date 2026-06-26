const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

const PRICES = {
  'Interior Detail': 149,
  'Exterior Detail': 119,
  'Full Detail': 249
};

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

exports.createBooking = async (req, res) => {
  try {
    const { customerName, email, phone, service, vehicleType, vehicleMake,
      vehicleModel, vehicleYear, date, timeSlot, address, notes, isFirstTime } = req.body;

    const basePrice = PRICES[service] || 0;
    const discountApplied = isFirstTime;
    const finalPrice = discountApplied ? basePrice * 0.5 : basePrice;

    const booking = await Booking.create({
      customerName, email, phone, service, vehicleType,
      vehicleMake, vehicleModel, vehicleYear, date, timeSlot,
      address, notes, isFirstTime, price: basePrice,
      discountApplied, finalPrice
    });

    // Send confirmation email
    try {
      await sendEmail(email, 'Booking Confirmed - PerfectTouch Auto Detailing',
        `<h2>Hi ${customerName}!</h2>
        <p>Your booking is confirmed.</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        <p><strong>Price:</strong> $${finalPrice}${discountApplied ? ' (50% First-Time Discount Applied!)' : ''}</p>
        <p>We'll come to you at: ${address}</p>
        <p>Questions? Call us: 845-866-2430</p>`
      );
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

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
      req.params.id,
      { status: req.body.status },
      { new: true }
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
    const bookings = await Booking.find({ date: { $gte: start, $lte: end }, status: { $ne: 'Cancelled' } });
    const events = bookings.map(b => ({
      id: b._id,
      title: `${b.customerName} - ${b.service}`,
      date: b.date,
      time: b.timeSlot,
      status: b.status,
      color: b.status === 'Completed' ? '#22c55e' : b.status === 'Confirmed' ? '#3b82f6' : '#f59e0b'
    }));
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
