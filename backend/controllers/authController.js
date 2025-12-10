const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    // Normalize email
    const normalizedEmail = email?.toLowerCase().trim();

    console.log("[GOOGLE AUTH] Processing:", { email: normalizedEmail, state });

    // Check if user exists
    let user = await User.findOne({ $or: [{ googleId }, { email: normalizedEmail }] });
    let isNewUser = false;

    if (!user) {
      // NEW USER - Determine role based on state parameter
      const role = state === "owner" ? "owner" : "renter";
      console.log("[GOOGLE AUTH] Creating new user with role:", role);

      user = new User({
        googleId,
        email: normalizedEmail,
        name,
        avatar,
        role,
        authProvider: "google",
      });
      await user.save();
      isNewUser = true;
      console.log("[GOOGLE AUTH] New user created:", user._id, "role:", role);
    } else {
      // EXISTING USER
      console.log("[GOOGLE AUTH] User exists:", user._id);

      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        console.log("[GOOGLE AUTH] Linked Google account to existing user");
      }

      // Update avatar if provided
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }

      // Add owner role if state=owner and user doesn't have it
      if (state === "owner" && user.role !== "owner") {
        user.role = "owner";
        console.log("[GOOGLE AUTH] Upgraded user to owner role");
      }

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Build response with all user fields
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      authProvider: user.authProvider,
      isNewUser, // Flag for new users
      ownerSetupCompleted: user.ownerSetupCompleted, // Owner setup status
      // Personal info
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      birthday: user.birthday,
      bio: user.bio,
      // Owner setup fields
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
    };

    // Redirect to frontend with token in query parameter
    const redirectUrl = `http://localhost:3000/auth-callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify(userResponse)
    )}`;

    console.log("[GOOGLE AUTH] Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("[GOOGLE AUTH] Error:", err.message);
    res.redirect(
      `http://localhost:3000/signup?error=${encodeURIComponent(
        "Google authentication failed: " + err.message
      )}`
    );
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const {
      name,
      phone,
      address,
      gender,
      birthday,
      bio,
      currentPassword,
      newPassword,
      // Owner setup fields
      sellerType,
      ownerAddress,
      pickupAddress,
      region,
      regionName,
      province,
      provinceName,
      city,
      cityName,
      barangay,
      postalCode,
      ownerSetupCompleted,
      // Business fields
      businessName,
      businessType,
      taxId,
      bankName,
      accountNumber,
      accountName,
      ewalletProvider,
      ewalletNumber,
      ewalletName,
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
      user.avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.avatar && req.body.avatar.startsWith('data:')) {
      // Handle base64 avatar from FormData
      user.avatar = req.body.avatar;
    }

    // --- Update basic profile fields ---
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;
    if (birthday) user.birthday = birthday;
    if (bio) user.bio = bio;

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
    if (ownerSetupCompleted !== undefined) user.ownerSetupCompleted = ownerSetupCompleted;

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
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating profile: " + err.message,
      });
  }
};

// EXPORTS (must match your router!)
module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  updateProfile,
};
