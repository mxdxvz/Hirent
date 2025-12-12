const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  deliveryMethod: { type: String, required: true, enum: ['delivery', 'pickup'] },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'cancelled', 'completed'],
    default: 'pending',
  },
  couponCode: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
