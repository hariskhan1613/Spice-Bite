const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  createBooking,
  getBookings,
  deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/', createBooking);
router.get('/', protect, getBookings);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
