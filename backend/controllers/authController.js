const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in environment variables');
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
    }

    const admin = await Admin.findOne({ email });
    console.log('Admin found:', !!admin);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (err) {
    console.error('GET ME ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.seedAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne({ email: 'admin@perfecttouch.com' });
    if (exists) return res.json({ message: 'Admin already exists' });

    await Admin.create({
      name: 'Joshua Turk',
      email: 'admin@perfecttouch.com',
      password: 'PerfectTouch@2024'
    });
    res.json({ message: 'Admin created. Email: admin@perfecttouch.com | Password: PerfectTouch@2024' });
  } catch (err) {
    console.error('SEED ADMIN ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};