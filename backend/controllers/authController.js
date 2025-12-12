const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendOwnerVerificationEmail,
  sendWelcomeEmail,
} = require("../services/emailService");

// REGISTER
const registerUser = async (req, res) => {
  try {
    console.log("[REGISTER] Request received");
    const { name, email, password, role = "renter" } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Validate role if provided
    if (role && !["renter", "owner", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be renter, owner, or admin",
      });
    }

    console.log("[REGISTER] Checking if user exists:", email);
    let user = await User.findOne({ email });

    if (user) {
      console.log("[REGISTER] User already exists:", email);

      // Check if this is owner signup
      const isOwnerSignup =
        req.originalUrl.includes("/ownersignup") || role === "owner";

      if (isOwnerSignup) {
        if (user.role === "renter") {
          return res.status(400).json({
            success: false,
            message: "Email already registered as a Renter",
          });
        } else if (user.role === "owner") {
          return res.status(400).json({
            success: false,
            message: "Email already registered as an Owner",
          });
        }
      }
      // Default existing user response
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    console.log("[REGISTER] Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with specified role
    console.log("[REGISTER] Creating new user with role:", role);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role,
      authProvider: "email",
    });

    console.log("[REGISTER] Saving user to database...");
    await user.save();
    console.log(
      "[REGISTER] User saved successfully:",
      user._id,
      "with role:",
      user.role
    );

    // Generate JWT token (7 days)
    console.log("[REGISTER] Generating JWT token...");
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success with token and user data
    console.log("[REGISTER] Sending success response...");
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
      },
      message: "Registration successful",
    });
  } catch (err) {
    console.error("[REGISTER] Error occurred:", err.message);
    console.error("[REGISTER] Stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error during registration: " + err.message,
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    console.log("[LOGIN] Request received");
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    console.log("[LOGIN] Finding user:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("[LOGIN] User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare passwords
    console.log("[LOGIN] Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[LOGIN] Password mismatch for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token (7 days)
    console.log("[LOGIN] Generating JWT token...");
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success with token and all user data
    console.log("[LOGIN] Sending success response...");
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        authProvider: user.authProvider,
        // Personal info
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
        bio: user.bio,
        // Owner setup fields
        ownerSetupCompleted: user.ownerSetupCompleted,
        sellerType: user.sellerType,
        ownerAddress: user.ownerAddress,
        pickupAddress: user.pickupAddress,
        region: user.region,
        regionName: user.regionName,
        province: user.province,
        provinceName: user.provinceName,
        city: user.city,
        cityName: user.cityName,
        barangay: user.barangay,
        postalCode: user.postalCode,
        // Business fields
        businessName: user.businessName,
        businessType: user.businessType,
        taxId: user.taxId,
        // Payment fields
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountName: user.accountName,
        ewalletProvider: user.ewalletProvider,
        ewalletNumber: user.ewalletNumber,
        ewalletName: user.ewalletName,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("[LOGIN] Error occurred:", err.message);
    console.error("[LOGIN] Stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error during login: " + err.message,
    });
  }
};

// GOOGLE SIGNUP/LOGIN
const googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.user;
    const { state } = req.query; // state=owner for owner signup flow

    const normalizedEmail = email?.toLowerCase().trim();
    console.log("[GOOGLE AUTH] Processing:", { email: normalizedEmail, state });

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    // If existing user is a renter but trying to signup as owner, block
    if (user && state === "owner" && user.role === "renter") {
      console.log(
        "[GOOGLE AUTH] User exists as renter, cannot sign up as owner"
      );
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(
          "You already have an account as a renter. Please login."
        )}`
      );
    }

    let isNewUser = false;

    if (!user) {
      // NEW USER - role based on state param
      const role = state === "owner" ? "owner" : "renter";

      user = new User({
        googleId,
        email: normalizedEmail,
        name,
        avatar,
        role,
        authProvider: "google",
        ownerSetupCompleted: role === "owner" ? false : undefined, // default false for owners
      });
      await user.save();
      isNewUser = true;
      console.log("[GOOGLE AUTH] New user created:", user._id, "role:", role);
    } else {
      // EXISTING USER - NEVER CHANGE ROLE
      console.log(
        "[GOOGLE AUTH] Existing user found:",
        user._id,
        "role:",
        user.role
      );

      // Link Google account if not linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        console.log("[GOOGLE AUTH] Linked Google account to existing user");
      }

      // Update avatar if provided
      if (avatar && !user.avatar) user.avatar = avatar;

      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    // Build user response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role, // role is always preserved
      authProvider: user.authProvider,
      isNewUser,
      ownerSetupCompleted: user.ownerSetupCompleted,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      birthday: user.birthday,
      bio: user.bio,
      sellerType: user.sellerType,
      ownerAddress: user.ownerAddress,
      pickupAddress: user.pickupAddress,
      region: user.region,
      regionName: user.regionName,
      province: user.province,
      provinceName: user.provinceName,
      city: user.city,
      cityName: user.cityName,
      barangay: user.barangay,
      postalCode: user.postalCode,
      businessName: user.businessName,
      businessType: user.businessType,
      taxId: user.taxId,
      bankName: user.bankName,
      accountNumber: user.accountNumber,
      accountName: user.accountName,
      ewalletProvider: user.ewalletProvider,
      ewalletNumber: user.ewalletNumber,
      ewalletName: user.ewalletName,
    };

    // Redirect frontend
    const redirectUrl = `${process.env.FRONTEND_URL}/auth-callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify(userResponse)
    )}`;
    console.log("[GOOGLE AUTH] Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("[GOOGLE AUTH] Error:", err.message);
    res.redirect(
      `${process.env.FRONTEND_URL}/signup?error=${encodeURIComponent(
        "Google authentication failed: " + err.message
      )}`
    );
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const {
      firstName = undefined,
      lastName = undefined,
      name = undefined,
      phone = undefined,
      address = undefined,
      gender = undefined,
      birthday = undefined,
      bio = undefined,
      currentPassword = undefined,
      newPassword = undefined,
      // Owner setup fields
      sellerType = undefined,
      ownerAddress = undefined,
      pickupAddress = undefined,
      region = undefined,
      regionName = undefined,
      province = undefined,
      provinceName = undefined,
      city = undefined,
      cityName = undefined,
      barangay = undefined,
      postalCode = undefined,
      ownerSetupCompleted = undefined,
      // Business fields
      businessName = undefined,
      businessType = undefined,
      taxId = undefined,
      bankName = undefined,
      accountNumber = undefined,
      accountName = undefined,
      ewalletProvider = undefined,
      ewalletNumber = undefined,
      ewalletName = undefined,
      zipCode = undefined,
      avatar = undefined,
    } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // --- Handle password change ---
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // --- Handle avatar upload ---
    if (req.file) {
      // Convert file buffer to base64
      user.avatar = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    } else if (avatar && avatar.startsWith("data:")) {
      // Handle base64 avatar from FormData
      user.avatar = avatar;
    }

    // --- Update basic profile fields ---
    // Handle firstName/lastName or name
    if (firstName !== undefined && firstName !== null && firstName !== "") {
      const first = firstName || "";
      const last = lastName || "";
      user.name = `${first} ${last}`.trim();
    } else if (lastName !== undefined && lastName !== null && lastName !== "") {
      const first = firstName || "";
      const last = lastName || "";
      user.name = `${first} ${last}`.trim();
    } else if (name !== undefined && name !== null && name !== "") {
      user.name = name;
    }

    if (phone !== undefined && phone !== null && phone !== "")
      user.phone = phone;
    if (address !== undefined && address !== null && address !== "")
      user.address = address;
    if (zipCode !== undefined && zipCode !== null && zipCode !== "")
      user.postalCode = zipCode;
    if (gender !== undefined && gender !== null && gender !== "")
      user.gender = gender;
    if (birthday !== undefined && birthday !== null && birthday !== "")
      user.birthday = birthday;
    if (bio !== undefined && bio !== null && bio !== "") user.bio = bio;

    // --- Update owner setup fields ---
    if (sellerType) user.sellerType = sellerType;
    if (ownerAddress) user.ownerAddress = ownerAddress;
    if (pickupAddress) user.pickupAddress = pickupAddress;
    if (region) user.region = region;
    if (regionName) user.regionName = regionName;
    if (province) user.province = province;
    if (provinceName) user.provinceName = provinceName;
    if (city) user.city = city;
    if (cityName) user.cityName = cityName;
    if (barangay) user.barangay = barangay;
    if (postalCode) user.postalCode = postalCode;
    if (ownerSetupCompleted !== undefined)
      user.ownerSetupCompleted = ownerSetupCompleted;

    // --- Update business fields ---
    if (businessName) user.businessName = businessName;
    if (businessType) user.businessType = businessType;
    if (taxId) user.taxId = taxId;
    if (bankName) user.bankName = bankName;
    if (accountNumber) user.accountNumber = accountNumber;
    if (accountName) user.accountName = accountName;
    if (ewalletProvider) user.ewalletProvider = ewalletProvider;
    if (ewalletNumber) user.ewalletNumber = ewalletNumber;
    if (ewalletName) user.ewalletName = ewalletName;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        authProvider: user.authProvider,
        // Owner setup fields
        ownerSetupCompleted: user.ownerSetupCompleted,
        sellerType: user.sellerType,
        ownerAddress: user.ownerAddress,
        pickupAddress: user.pickupAddress,
        region: user.region,
        regionName: user.regionName,
        province: user.province,
        provinceName: user.provinceName,
        city: user.city,
        cityName: user.cityName,
        barangay: user.barangay,
        postalCode: user.postalCode,
        // Business fields
        businessName: user.businessName,
        businessType: user.businessType,
        taxId: user.taxId,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        accountName: user.accountName,
        ewalletProvider: user.ewalletProvider,
        ewalletNumber: user.ewalletNumber,
        ewalletName: user.ewalletName,
      },
    });
  } catch (err) {
    console.error("[UPDATE PROFILE] Error:", err);
    res.status(500).json({
      success: false,
      message: "Error updating profile: " + err.message,
    });
  }
};

// SEND OWNER VERIFICATION EMAIL
const sendOwnerVerificationEmailEndpoint = async (req, res) => {
  try {
    console.log("[SEND VERIFICATION EMAIL] Request received");
    const userId = req.user.userId; // from authMiddleware
    if (!userId) {
      console.error("[SEND VERIFICATION EMAIL] No userId found");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log("[SEND VERIFICATION EMAIL] Finding user:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.error("[SEND VERIFICATION EMAIL] User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("[SEND VERIFICATION EMAIL] User role:", user.role);
    // Check if user is an owner
    if (user.role !== "owner") {
      console.error("[SEND VERIFICATION EMAIL] User is not an owner");
      return res.status(403).json({
        success: false,
        message: "Only owners can request email verification",
      });
    }

    // Generate verification token (24 hour expiry)
    console.log("[SEND VERIFICATION EMAIL] Generating token");
    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Store token in database
    console.log("[SEND VERIFICATION EMAIL] Storing token in database");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    user.emailVerificationSentAt = new Date();
    await user.save();

    // Send verification email
    console.log("[SEND VERIFICATION EMAIL] Sending email to:", user.email);
    const emailSent = await sendOwnerVerificationEmail(
      user.email,
      verificationToken,
      user.name
    );

    if (!emailSent) {
      console.error("[SEND VERIFICATION EMAIL] Email sending failed");
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    console.log("[SEND VERIFICATION EMAIL] Email sent successfully");
    res.json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (err) {
    console.error("[SEND VERIFICATION EMAIL] Error:", err);
    res.status(500).json({
      success: false,
      message: "Error sending verification email: " + err.message,
    });
  }
};

// VERIFY OWNER EMAIL
const verifyOwnerEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if token matches and hasn't expired
    if (user.emailVerificationToken !== token) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    if (user.emailVerificationTokenExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired",
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      message: "Email verified successfully! Your account is now active.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error("[VERIFY EMAIL] Error:", err);
    res.status(500).json({
      success: false,
      message: "Error verifying email: " + err.message,
    });
  }
};

// EXPORTS (must match your router!)
module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  updateProfile,
  sendOwnerVerificationEmailEndpoint,
  verifyOwnerEmail,
};
