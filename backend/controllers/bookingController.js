const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const phoneRegex = /^[\d\s()+-]{7,20}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const parseLocalDate = (dateValue) => {
  if (!dateValue) return null;

  const dateString = String(dateValue).trim();
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const bookingDate = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    bookingDate.getFullYear() !== Number(year) ||
    bookingDate.getMonth() !== Number(month) - 1 ||
    bookingDate.getDate() !== Number(day)
  ) {
    return null;
  }

  return bookingDate;
};

const isPastDate = (bookingDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDate < today;
};

const validateBookingPayload = ({ fullName, phone, date, time, guests }) => {
  if (!fullName || !phone || !date || !time || !guests) {
    return 'Please fill in all required fields.';
  }

  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number.';
  }

  if (!timeRegex.test(time)) {
    return 'Please enter a valid booking time.';
  }

  return null;
};

const createBooking = async (req, res) => {
  try {
    const payload = {
      fullName: req.body.fullName?.trim(),
      phone: req.body.phone?.trim(),
      date: req.body.date,
      time: req.body.time?.trim(),
      guests: req.body.guests?.trim(),
      requests: req.body.requests?.trim() || ''
    };

    const validationError = validateBookingPayload(payload);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const bookingDate = parseLocalDate(payload.date);

    if (!bookingDate) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid booking date.'
      });
    }

    if (isPastDate(bookingDate)) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past.'
      });
    }

    const booking = await Booking.create({
      ...payload,
      date: bookingDate
    });

    console.log(`New booking saved: ${booking._id}`);

    return res.status(200).json({
      success: true,
      message: 'Booking saved successfully.',
      data: booking
    });
  } catch (error) {
    console.error(`Create booking error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: 'Server error while saving booking.'
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(`Get bookings error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings.'
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID.'
      });
    }

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    console.log(`Booking deleted: ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully.'
    });
  } catch (error) {
    console.error(`Delete booking error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: 'Server error while deleting booking.'
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking
};
