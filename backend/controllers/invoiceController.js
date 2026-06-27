const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
};

exports.generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const discountAmount = booking.discountApplied ? booking.price * 0.85 : 0;
    const invoice = await Invoice.create({
      booking: booking._id,
      customerName: booking.customerName,
      email: booking.email,
      phone: booking.phone,
      address: booking.address,
      service: booking.service,
      vehicleInfo: `${booking.vehicleYear || ''} ${booking.vehicleMake || ''} ${booking.vehicleModel || ''}`.trim(),
      serviceDate: booking.date,
      basePrice: booking.price,
      discount: discountAmount,
      discountPercent: booking.discountApplied ? 15 : 0,
      totalAmount: booking.finalPrice,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    booking.invoiceGenerated = true;
    booking.invoiceId = invoice._id;
    await booking.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 })
      .limit(limit * 1).skip((page - 1) * limit);
    const total = await Invoice.countDocuments(filter);
    res.json({ invoices, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('booking');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendInvoiceEmail = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0066ff,#003399);padding:30px;text-align:center">
          <h1 style="color:#fff;margin:0">PerfectTouch Auto Detailing</h1>
          <p style="color:#93c5fd;margin:5px 0">Professional Mobile Detailing - Sullivan County</p>
        </div>
        <div style="padding:30px">
          <h2 style="color:#1e293b">Invoice #${invoice.invoiceNumber}</h2>
          <p><strong>To:</strong> ${invoice.customerName}</p>
          <p><strong>Service:</strong> ${invoice.service}</p>
          <p><strong>Vehicle:</strong> ${invoice.vehicleInfo || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date(invoice.serviceDate).toLocaleDateString()}</p>
          <hr/>
          <p><strong>Base Price:</strong> $${invoice.basePrice}</p>
          ${invoice.discount > 0 ? `<p style="color:#22c55e"><strong>First-Time Discount (15%):</strong> -$${invoice.discount}</p>` : ''}
          <h3>Total Due: $${invoice.totalAmount}</h3>
          <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p>📞 845-866-2430 | ✉️ perfecttouch.autodetailing29@gmail.com</p>
        </div>
      </div>
    `;

    await sendEmail(invoice.email, `Invoice #${invoice.invoiceNumber} - PerfectTouch Auto Detailing`, html);
    await Invoice.findByIdAndUpdate(invoice._id, { status: 'Sent' });

    res.json({ message: 'Invoice sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};