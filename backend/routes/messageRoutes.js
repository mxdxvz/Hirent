const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  startConversation,
  sendMessage,
  getMessages,
  getConversations,
  markAsRead
} = require('../controllers/messageController');

// Start a new conversation
router.post('/start-conversation', auth, startConversation);

// Send a message
router.post('/send', auth, sendMessage);

// Get messages for a conversation
router.get('/:conversationId', auth, getMessages);

// Get all conversations for a user
router.get('/user/:userId', auth, getConversations);

// Mark messages as read
router.patch('/read/:conversationId', auth, markAsRead);

module.exports = router;
