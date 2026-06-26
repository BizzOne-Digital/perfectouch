const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.admin);
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
    res.status(500).json({ message: err.message });
  }
};
