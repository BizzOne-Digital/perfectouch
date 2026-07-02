const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { createDepositPaymentLink, verifyWebhookSignature } = require('../services/squareService');

const PRICES = {
  'Interior Detail': 149,
  'Exterior Detail': 119,
  'Full Detail': 249
};

// Deposit % (default 25). Client Square dashboard se amount aata hai.
const DEPOSIT_PERCENT = Number(process.env.SQUARE_DEPOSIT_PERCENT || 25);

const twilioClient = () => twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const formatPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
};

// Customer ko deposit link SMS + WhatsApp pe bhejo
const sendDepositLinkToCustomer = async (booking) => {
  const msg =
`PerfectTouch Auto Detailing
Hi ${booking.customerName}!

Aapki booking request mil gayi hai.
Service: ${booking.service}
Date: ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}

Booking confirm karne ke liye $${booking.depositAmount} deposit (${booking.depositPercent}%) yahan pay karein:
${booking.depositPaymentUrl}

Baaqi balance service ke baad. Thank you!`;

  const client = twilioClient();
  await Promise.allSettled([
    client.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to: formatPhone(booking.phone),
      body: msg
    }),
    client.messages.create({
      from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
      to: `whatsapp:${formatPhone(booking.phone)}`,
      body: msg
    })
  ]);

  // Email bhi (agar customer ne di ho)
  if (booking.email) {
    try {
      const transporter = createMailTransport();
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: booking.email,
        cc: process.env.EMAIL_USER,
        subject: `Confirm your booking - $${booking.depositAmount} deposit`,
        html: `
          <h3>Almost done, ${booking.customerName}!</h3>
          <p>Service: <strong>${booking.service}</strong></p>
          <p>Date: ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot}</p>
          <p>To confirm your booking, please pay a <strong>$${booking.depositAmount}</strong> deposit (${booking.depositPercent}%):</p>
          <p><a href="${booking.depositPaymentUrl}" style="background:#0a84ff;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;">Pay Deposit</a></p>
          <p>The remaining balance is due after your service. Thank you for choosing PerfectTouch!</p>
        `
      });
    } catch (err) {
      console.error('Deposit email error:', err.message);
    }
  }
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

const sendBookingEmail = async (booking, finalPrice) => {
  try {
    const transporter = createMailTransport();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Booking Request - ${booking.customerName}`,
      html: `
        <h3>New Booking Request</h3>
        <p><strong>Name:</strong> ${booking.customerName}</p>
        <p><strong>Email:</strong> ${booking.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${booking.phone || 'N/A'}</p>
        <p><strong>Service:</strong> ${booking.service}</p>
        <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.timeSlot}</p>
        <p><strong>Address:</strong> ${booking.address || 'N/A'}</p>
        <p><strong>Price:</strong> $${finalPrice}${booking.discountApplied ? ' (15% off)' : ''}</p>
      `
    };

    if (booking.email) {
      mailOptions.cc = booking.email;
    }

    await transporter.sendMail(mailOptions);
    console.log('✅ Booking email sent');
  } catch (err) {
    console.error('Booking email error:', err.message);
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
    await sendBookingEmail(booking, finalPrice);

    // ---- Square deposit link (percentage of final price) ----
    try {
      const depositAmount = parseFloat((finalPrice * (DEPOSIT_PERCENT / 100)).toFixed(2));
      if (depositAmount > 0) {
        const link = await createDepositPaymentLink({ booking, amount: depositAmount });

        booking.depositPercent = DEPOSIT_PERCENT;
        booking.depositAmount = depositAmount;
        booking.depositStatus = 'Pending';
        booking.depositPaymentLinkId = link.paymentLinkId;
        booking.depositPaymentUrl = link.url;
        booking.depositOrderId = link.orderId;
        await booking.save();

        await sendDepositLinkToCustomer(booking);
      }
    } catch (depErr) {
      // Deposit link fail ho to bhi booking save rahe — sirf log karo
      console.error('Deposit link error:', depErr.message);
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

// ---------------------------------------------------------------
// Square webhook: jab customer deposit pay karta hai to Square
// yahan event bhejta hai. Ham booking ko 'Confirmed' + deposit 'Paid'
// mark karte hain aur Joshua ko notify karte hain.
// ---------------------------------------------------------------
exports.squareWebhook = async (req, res) => {
  try {
    const signature = req.get('x-square-hmacsha256-signature');
    const notificationUrl = process.env.SQUARE_WEBHOOK_URL; // exact URL jo Square dashboard mein set kiya

    const valid = verifyWebhookSignature({
      rawBody: req.rawBody?.toString('utf8') || JSON.stringify(req.body),
      signature,
      notificationUrl
    });

    if (!valid) {
      console.error('Square webhook: invalid signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;
    const payment = event?.data?.object?.payment;

    // Sirf completed payments par act karo
    if (payment && payment.status === 'COMPLETED' && payment.order_id) {
      const booking = await Booking.findOne({ depositOrderId: payment.order_id });

      if (booking && booking.depositStatus !== 'Paid') {
        booking.depositStatus = 'Paid';
        booking.depositPaidAt = new Date();
        booking.status = 'Confirmed';
        await booking.save();

        // Joshua ko batao ke deposit aa gaya
        try {
          await twilioClient().messages.create({
            from: process.env.TWILIO_FROM_NUMBER,
            to: process.env.TWILIO_TO_NUMBER,
            body: `Deposit RECEIVED - PerfectTouch
${booking.customerName} ne $${booking.depositAmount} deposit pay kar diya.
Service: ${booking.service}
Date: ${new Date(booking.date).toLocaleDateString()} ${booking.timeSlot}
Booking ab CONFIRMED hai.`
          });
        } catch (smsErr) {
          console.error('Deposit-paid SMS error:', smsErr.message);
        }
      }
    }

    // Square ko hamesha 200 do warna wo retry karta rahega
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Square webhook error:', err.message);
    res.status(200).json({ received: true });
  }
};