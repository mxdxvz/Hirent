const Notification = require('../models/Notification');

// This function is for internal use by other controllers
exports.createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    // In a real-world app, you might also push this to a WebSocket service
    console.log('Notification created:', notification);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.params.userId })
      .populate('senderId', 'name profileImage')
      .populate('bookingId', 'status')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error fetching notifications', message: err.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }

    // Security check: ensure the user is the recipient
    if (notification.recipientId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, msg: 'Not authorized to update this notification' });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Error updating notification', message: err.message });
  }
};