const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
      maxlength: [80, 'Full name cannot exceed 80 characters.']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters.']
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required.']
    },
    time: {
      type: String,
      required: [true, 'Booking time is required.'],
      trim: true
    },
    guests: {
      type: String,
      required: [true, 'Number of guests is required.'],
      trim: true
    },
    requests: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters.'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
