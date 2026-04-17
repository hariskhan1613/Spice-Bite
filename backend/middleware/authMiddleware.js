const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing from the environment variables.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    }

    req.admin = {
      id: admin._id,
      email: admin.email
    };

    return next();
  } catch (error) {
    console.error(`Auth middleware error: ${error.message}`);

    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid. Please log in again.'
    });
  }
};

module.exports = protect;
