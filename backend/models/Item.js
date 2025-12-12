const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  // Basic Info
  title: { type: String, required: true },
  itemName: { type: String },
  description: String,
  
  // Owner reference
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },

  // Category and images
  category: String,
  images: [{ type: String }],
  
  // Pricing
  pricePerDay: Number,
  securityDeposit: Number,
  deliveryOptions: {
    offersDelivery: { type: Boolean, default: false },
    deliveryFee: { type: Number, default: 0 },
    offersPickup: { type: Boolean, default: true },
  },
  
  // Condition and availability
  condition: String,
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  
  // Location
  location: String,
  zone: String,
  barangay: String,
  postalCode: String,
  province: String,
  
  // Availability settings
  availabilityType: { type: String, default: 'always' }, // always, specific-dates
  unavailableDates: [{ start: Date, end: Date }],
  minimumRentalDays: { type: Number, default: 1 },
  maximumRentalDays: { type: Number, default: 30 },
  advanceNoticeDays: { type: Number, default: 1 },
  
  // Item options and color
  color: String,
  itemOptions: [String],
  
  // Booking preferences
  instantBooking: { type: Boolean, default: false },
  requireApproval: { type: Boolean, default: true },
  identificationRequired: { type: Boolean, default: true },
  insuranceRequired: { type: Boolean, default: false },
  cancellationPolicy: { type: String, default: 'flexible' },
  
  // Status tracking
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'archived'] },
  totalBookings: { type: Number, default: 0 },
  views: { type: Number, default: 0 }

}, { timestamps: true });

ItemSchema.index({ title: "text", description: "text" });
ItemSchema.index({ owner: 1 });

module.exports = mongoose.models.Item || mongoose.model("Item", ItemSchema);
