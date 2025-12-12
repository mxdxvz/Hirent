import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { API_URL, ENDPOINTS, makeAPICall } from '../config/api';

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  // Establish socket connection
  useEffect(() => {
    if (user && user._id) {
      const newSocket = io(API_URL);
      setSocket(newSocket);

      newSocket.emit('join', user._id);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user, socket]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (user && user._id) {
      const data = await makeAPICall(ENDPOINTS.MESSAGES.GET_ALL_FOR_USER(user._id));
      if (data) {
        setConversations(data);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleMessageReceive = (newMessage) => {
      if (selectedConversation && newMessage.conversationId === selectedConversation._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      // Update conversations list with new message for preview
      fetchConversations();
    };

    socket.on('message:receive', handleMessageReceive);

    return () => {
      socket.off('message:receive', handleMessageReceive);
    };
  }, [socket, user, selectedConversation, fetchConversations]);

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    const data = await makeAPICall(ENDPOINTS.MESSAGES.GET_MESSAGES(conversation._id));
    if (data) {
      setMessages(data);
    }
    // Mark messages as read
    await makeAPICall(ENDPOINTS.MESSAGES.MARK_READ(conversation._id), {
      method: 'PATCH',
      body: JSON.stringify({ userId: user._id })
    });
    fetchConversations(); // Refresh conversations to update read status
  };

  const sendMessage = async (receiverId, text) => {
    if (!selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation._id,
      senderId: user._id,
      receiverId,
      text
    };

    const newMessage = await makeAPICall(ENDPOINTS.MESSAGES.SEND, {
      method: 'POST',
      body: JSON.stringify(messageData)
    });

    if (newMessage) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit('message:send', messageData);
      fetchConversations(); // Refresh for last message update
    }
  };
  
  const startConversation = async (otherUserId) => {
    const body = user.role === 'owner' 
      ? { ownerId: user._id, renterId: otherUserId }
      : { ownerId: otherUserId, renterId: user._id };

    const data = await makeAPICall(ENDPOINTS.MESSAGES.START, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (data && data.participants) {
        await fetchConversations();
        selectConversation(data);
        return data;
    }
    return null;
  };

  const value = {
    conversations,
    selectedConversation,
    messages,
    selectConversation,
    sendMessage,
    startConversation
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
