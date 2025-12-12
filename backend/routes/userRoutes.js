const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const validationHandler = require("../utils/validators/validationHandler");
const {
  updateProfileValidator,
  updatePasswordValidator,
} = require("../utils/validators/userValidator");

// Protected routes (require authentication) - MUST come BEFORE public routes
// Get current user profile
router.get(
  "/me",
  authMiddleware,
  userController.getProfile
);

// Update user profile
router.put(
  "/update-profile",
  authMiddleware,
  updateProfileValidator,
  validationHandler,
  userController.updateProfile
);

router.put(
  "/password",
  authMiddleware,
  updatePasswordValidator,
  validationHandler,
  userController.updatePassword
);

// Fetch addresses and payment methods
router.get("/addresses", authMiddleware, userController.getAddresses);
router.get("/payment-methods", authMiddleware, userController.getPaymentMethods);

// Public routes - MUST come AFTER protected routes
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.post("/", authMiddleware, adminMiddleware, userController.createUser);

module.exports = router;
