const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, minlength: 6 }, // Optional for Google OAuth users
  googleId: { type: String, sparse: true, unique: true }, // Google OAuth ID
  avatar: { type: String }, // Profile picture from Google
  role: {
    type: String,
    enum: ['renter', 'owner', 'admin'],
    default: 'renter'
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  // Owner Setup Fields
  ownerSetupCompleted: { type: Boolean, default: false },
  sellerType: { type: String, enum: ['individual', 'business'], default: 'individual' },
  phone: { type: String },
  ownerAddress: { type: String },
  pickupAddress: { type: String },
  region: { type: String },
  regionName: { type: String },
  province: { type: String },
  provinceName: { type: String },
  city: { type: String },
  cityName: { type: String },
  barangay: { type: String },
  postalCode: { type: String },
  // Additional profile fields
  address: { type: String },
  gender: { type: String },
  birthday: { type: String },
  bio: { type: String },
  // Business/Owner profile fields
  businessName: { type: String },
  businessType: { type: String },
  taxId: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  accountName: { type: String },
  ewalletProvider: { type: String },
  ewalletNumber: { type: String },
  ewalletName: { type: String },
  // Verification Status
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  idVerified: { type: Boolean, default: false },
  
  // Email Verification Token (for owner setup)
  emailVerificationToken: { type: String, sparse: true },
  emailVerificationTokenExpiry: { type: Date },
  emailVerificationSentAt: { type: Date },

  // Wishlist
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
