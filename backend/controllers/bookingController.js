const Booking = require('../models/Booking');
const Item = require('../models/Item');
const { createNotification } = require('./notificationController');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      itemId, startDate, endDate, totalAmount, subtotal,
      shippingFee, securityDeposit, discount, deliveryMethod, couponCode
    } = req.body;
    const renterId = req.user.userId;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, msg: 'Item not found' });
    }

    if (item.owner.toString() === renterId) {
      return res.status(400).json({ success: false, msg: 'You cannot book your own item.' });
    }

    const newBooking = new Booking({
      userId: renterId,
      itemId,
      ownerId: item.owner,
      startDate,
      endDate,
      totalAmount,
      subtotal,
      shippingFee,
      securityDeposit,
      discount,
      deliveryMethod,
      couponCode,
    });

    await newBooking.save();

    // Create notification for the owner
    await createNotification({
      recipientId: item.owner,
      senderId: renterId,
      type: 'new_booking',
      bookingId: newBooking._id,
      message: `You have a new booking request for your item: ${item.title}`,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (err) {
    console.error('[CREATE BOOKING] Error:', err);
    res.status(500).json({ success: false, msg: 'Error creating booking', message: err.message });
  }
};

// Get bookings made by the current user (renter)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('itemId', 'title images pricePerDay category')
      .populate('ownerId', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching bookings', message: err.message });
  }
};

// Get bookings for a specific user (by userId)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('itemId', 'title images pricePerDay category')
      .populate('ownerId', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching bookings', message: err.message });
  }
};

// Get bookings for items owned by the current user
exports.getBookingsForMyItems = async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.userId })
      .populate('itemId', 'title images pricePerDay category')
      .populate('userId', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching owner bookings', message: err.message });
  }
};

// Get bookings for a specific owner (by ownerId)
exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.params.ownerId })
      .populate('itemId', 'title images')
      .populate('userId', 'name email profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching owner bookings', message: err.message });
  }
};

// Update booking status (by owner)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'cancelled'
    const booking = await Booking.findById(req.params.bookingId).populate('itemId');

    if (!booking) {
      return res.status(404).json({ success: false, msg: 'Booking not found' });
    }

    if (booking.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, msg: 'You are not authorized to update this booking' });
    }
    
    if (booking.status !== 'pending') {
        return res.status(400).json({ success: false, msg: `Cannot update status of a booking that is already '${booking.status}'` });
    }

    booking.status = status;
    await booking.save();

    // Notify renter of the status update
    await createNotification({
        recipientId: booking.userId,
        senderId: booking.ownerId,
        type: status === 'approved' ? 'booking_approved' : 'booking_cancelled',
        bookingId: booking._id,
        message: `Your booking for ${booking.itemId.title} has been ${status}.`
    });

    res.json({ success: true, message: `Booking ${status}`, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error updating booking status', message: err.message });
  }
};

// Cancel a booking (by renter)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, msg: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, msg: 'You are not authorized to cancel this booking' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, msg: 'You can only cancel pending bookings' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Notify owner of the cancellation
    await createNotification({
      recipientId: booking.ownerId,
      senderId: booking.userId,
      type: 'booking_cancelled',
      bookingId: booking._id,
      message: `A booking for your item has been cancelled.`
    });

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error cancelling booking', message: err.message });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('itemId', 'title images pricePerDay category description')
      .populate('userId', 'name email profileImage')
      .populate('ownerId', 'name email profileImage');

    if (!booking) {
      return res.status(404).json({ success: false, msg: 'Booking not found' });
    }

    // Check if user is either the renter or the owner
    if (booking.userId._id.toString() !== req.user.userId && booking.ownerId._id.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, msg: 'You are not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching booking', message: err.message });
  }
};
