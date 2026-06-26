const nodemailer = require('nodemailer');

exports.sendContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'perfecttouch.autodetailing29@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h3>New Contact Message - PerfectTouch Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
