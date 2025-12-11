const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Start a new conversation or get an existing one
exports.startConversation = async (req, res) => {
  const { ownerId, renterId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [ownerId, renterId] }
    }).populate('participants', 'name role');

    if (conversation) {
      return res.status(200).json(conversation);
    }

    let newConversation = new Conversation({
      participants: [ownerId, renterId]
    });

    await newConversation.save();
    
    // Populate the participants after saving
    newConversation = await newConversation.populate('participants', 'name role');

    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: 'Error starting conversation', error });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  const { conversationId, senderId, receiverId, text } = req.body;

  try {
    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId,
      text
    });

    await newMessage.save();

    // Real-time emission will be handled in the socket setup

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Get all messages for a conversation
exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({ participants: userId }).populate('participants', 'name');
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  const { conversationId } = req.params;
  const { userId } = req.body; // The user who has read the messages

  try {
    await Message.updateMany(
      { conversationId: conversationId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read', error });
  }
};
