const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { 
  registerUser, 
  loginUser, 
  googleAuth, 
  updateProfile,
  sendOwnerVerificationEmailEndpoint,
  verifyOwnerEmail
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Configure multer for avatar uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for avatars
});

// Google OAuth - Standard (renter) flow
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth - Owner signup flow
router.get("/google/owner",
  passport.authenticate("google", { scope: ["profile", "email"], state: "owner" })
);

// Google OAuth callback (handles both renter and owner flows)
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuth
);

// Standard Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile management (requires authentication)
router.put("/profile", authMiddleware, upload.single("avatar"), updateProfile);

// Email Verification (requires authentication)
router.post("/send-verification-email", authMiddleware, sendOwnerVerificationEmailEndpoint);
router.post("/verify-email", verifyOwnerEmail);

module.exports = router;
