const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from the environment variables.');
  }

  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

const loginAdmin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const passwordMatches = await admin.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = signToken(admin._id);

    console.log(`Admin logged in: ${admin.email}`);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error(`Admin login error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: 'Server error while logging in.'
    });
  }
};

module.exports = {
  loginAdmin
};
