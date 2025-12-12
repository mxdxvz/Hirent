const User = require('../models/Users');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, msg: 'Access denied. Admin role required.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error during admin check.' });
  }
};

module.exports = adminMiddleware;
