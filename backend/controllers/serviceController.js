// serviceController.js
const Service = require('../models/Service');
const nodemailer = require('nodemailer');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    if (services.length === 0) {
      const defaults = [
        { name: 'Interior Detail', price: 149, description: "Bring your vehicle's interior back to life with a deep cleaning designed to remove dirt, dust, and everyday buildup.", features: ['Vacuum all surfaces', 'Dashboard & console wipe-down', 'Window cleaning (interior)', 'Seat & upholstery cleaning', 'Door panel cleaning', 'Odor elimination'], duration: '2-3 hours' },
        { name: 'Exterior Detail', price: 119, description: 'Comprehensive exterior detailing including wash, wheel and tire cleaning, and finish enhancement to restore shine and protection.', features: ['Hand wash & rinse', 'Wheel & tire cleaning', 'Tire shine application', 'Window cleaning (exterior)', 'Exterior wipe-down', 'Hand wax & polish'], duration: '1.5-2 hours' },
        { name: 'Full Detail', price: 249, description: 'Complete interior and exterior detailing to give your vehicle a fresh, well-maintained showroom appearance.', features: ['Everything in Interior Detail', 'Everything in Exterior Detail', 'Engine bay cleaning', 'Paint protection treatment', 'Full interior shampoo', 'Priority scheduling'], duration: '4-5 hours' }
      ];
      const created = await Service.insertMany(defaults);
      return res.json(created);
    }
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// contactController.js  
exports.sendContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      requireTLS: true
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name}`,
      html: `<h3>New Contact Message</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Message:</strong> ${message}</p>`
    });
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
