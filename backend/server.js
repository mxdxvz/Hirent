// -------------------------
// Load Dependencies
// -------------------------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const multer = require("multer");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, ".env") });

// -------------------------
// Initialize App
// -------------------------
const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Make upload available globally
app.locals.upload = upload;

// Passport initialization
require("./config/passport");
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set true in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Catch malformed JSON before routes
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return next({
      statusCode: 400,
      message: "Invalid JSON format",
    });
  }
  next();
});

// -------------------------
// Database Connection
// -------------------------
let mongoConnected = false;

const connectMongoDB = async () => {
  try {
    console.log('\n🔄 Connecting to MongoDB Atlas...');
    console.log('📍 URI:', process.env.MONGO_URI ? 'Configured' : 'NOT SET - Will fail!');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      maxConnecting: 2,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false
    });
    
    mongoConnected = true;
    console.log('✅ MongoDB connected successfully!');
    console.log('   Database:', mongoose.connection.db.databaseName);
    console.log('   Host:', mongoose.connection.host);
    
  } catch (err) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error('   Error:', err.message);
    console.error('\n⚠️  TROUBLESHOOTING:');
    console.error('   1. Verify your MONGO_URI in .env is correct');
    console.error('   2. Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)');
    console.error('   3. Ensure MongoDB Atlas cluster is running (not paused)');
    console.error('   4. Test connection: mongosh "' + process.env.MONGO_URI + '"');
    console.error('\n   Retrying in 5 seconds...\n');
    
    setTimeout(connectMongoDB, 5000);
  }
};

connectMongoDB();

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connected to MongoDB');
  mongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose disconnected from MongoDB');
  mongoConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('📡 Mongoose connection error:', err);
  mongoConnected = false;
});

// -------------------------
// ROUTES
// -------------------------

// Authentication Routes
app.use("/api/auth", require("./routes/authRoutes"));

// User Routes
app.use("/api/users", require("./routes/userRoutes"));

// Owner Routes
app.use("/api/owners", require("./routes/ownerRoutes"));

// Items Routes
app.use("/api/items", require("./routes/itemRoutes"));

// Wishlist Routes
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

// Location Routes
app.use("/api/locations", require("./routes/locationRoutes"));

// Home Personalized + Featured Routes
app.use("/api/home", require("./routes/homeRoutes"));
app.use("/api/homepage", require("./routes/homepageRoutes"));  // <-- FIXED PATH

// Cart Routes
app.use("/api/cart", require("./routes/cartRoutes"));

// Booking Routes
app.use("/api/bookings", require("./routes/bookingRoutes"));

// Message Routes
app.use("/api/messages", require("./routes/messageRoutes"));

// User Search Routes
app.use("/api/search-users", require("./routes/userSearchRoutes"));

// Root Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// -------------------------
// Error Handler (must be last)
// -------------------------
app.use(errorHandler);

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 5000;
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Handle joining a room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending a message
  socket.on('message:send', ({ conversationId, senderId, receiverId, text }) => {
    // When a message is sent, emit it to the receiver's room
    io.to(receiverId).emit('message:receive', { conversationId, senderId, text });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ EXPRESS SERVER RUNNING on port ${PORT}`);
  console.log('📍 API available at: http://localhost:' + PORT);
  console.log('\n⏳ Database connection status:', mongoConnected ? '✅ CONNECTED' : '⏳ CONNECTING...');
  console.log('\n💡 If MongoDB not connected yet, server will retry automatically.\n');
});

// Prevent server from exiting
server.keepAliveTimeout = 65000;

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error(err.stack);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
