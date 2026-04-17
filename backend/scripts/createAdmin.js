require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  let exitCode = 0;

  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required in .env.');
      exitCode = 1;
      return;
    }

    if (password.length < 8) {
      console.error('ADMIN_PASSWORD must be at least 8 characters long.');
      exitCode = 1;
      return;
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin already exists: ${email}`);
      return;
    }

    await Admin.create({ email, password });

    console.log(`Admin created successfully: ${email}`);
  } catch (error) {
    console.error(`Create admin error: ${error.message}`);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(exitCode);
  }
};

createAdmin();
