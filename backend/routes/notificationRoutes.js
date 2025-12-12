const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/:userId', authMiddleware, notificationController.getUserNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', authMiddleware, notificationController.markNotificationAsRead);

module.exports = router;