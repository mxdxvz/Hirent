const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    required: true,
    enum: ['new_booking', 'booking_approved', 'booking_cancelled', 'booking_completed'],
  },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
