const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const getClient = () => twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Format phone to E.164
const formatPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
};

const createMailTransport = () => nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  requireTLS: true
});

const sendInvoiceEmailNotification = async (invoice) => {
  try {
    const transporter = createMailTransport();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Invoice #${invoice.invoiceNumber} - PerfectTouch Auto Detailing`,
      html: `
        <h3>Invoice Ready</h3>
        <p>Hello ${invoice.customerName},</p>
        <p>Your invoice for ${invoice.service || 'your service'} is ready.</p>
        <p><strong>Total Amount:</strong> $${invoice.totalAmount}</p>
        <p><strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
        <p>Thank you for choosing PerfectTouch Auto Detailing.</p>
      `
    };

    if (invoice.email) {
      mailOptions.cc = invoice.email;
    }

    await transporter.sendMail(mailOptions);
    console.log('✅ Invoice email sent');
  } catch (err) {
    console.error('Invoice email error:', err.message);
  }
};

// Send SMS to CUSTOMER
const sendSMSToCustomer = async (customerPhone, body) => {
  try {
    const result = await getClient().messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: formatPhone(customerPhone), // Customer ka number
      body: body
    });
    console.log(`✅ Invoice SMS sent to customer ${customerPhone} - SID: ${result.sid}`);
  } catch (err) {
    console.error('Invoice SMS error:', err.message);
  }
};

// Send WhatsApp to CUSTOMER
const sendWhatsAppToCustomer = async (customerPhone, body) => {
  try {
    const result = await getClient().messages.create({
      from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
      to: `whatsapp:${formatPhone(customerPhone)}`, // Customer ka number
      body: body
    });
    console.log(`✅ Invoice WhatsApp sent to customer ${customerPhone} - SID: ${result.sid}`);
  } catch (err) {
    console.error('Invoice WhatsApp error:', err.message);
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const discountAmount = booking.discountApplied
      ? parseFloat((booking.price * 0.15).toFixed(2))
      : 0;

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
    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
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

// Send invoice to CUSTOMER via SMS + WhatsApp
exports.sendInvoiceEmail = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    if (!invoice.phone) {
      return res.status(400).json({ message: 'Customer phone number not found' });
    }

    const msg =
`PerfectTouch Auto Detailing
Invoice #${invoice.invoiceNumber}

Hi ${invoice.customerName}!
Service: ${invoice.service}
Vehicle: ${invoice.vehicleInfo || 'N/A'}
Date: ${invoice.serviceDate ? new Date(invoice.serviceDate).toLocaleDateString() : 'N/A'}
Amount Due: $${invoice.totalAmount}${invoice.discount > 0 ? ` (15% discount applied)` : ''}
Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}

Questions? Call: 845-866-2430
Thank you for choosing PerfectTouch!`;

    // Send BOTH to CUSTOMER only
    await Promise.allSettled([
      sendSMSToCustomer(invoice.phone, msg),
      sendWhatsAppToCustomer(invoice.phone, msg)
    ]);

    await sendInvoiceEmailNotification(invoice);
    await Invoice.findByIdAndUpdate(invoice._id, { status: 'Sent' });

    res.json({ message: `Invoice sent to customer at ${invoice.phone}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send: ' + err.message });
  }
};