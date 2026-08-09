import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const location = useLocation();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user chats
  const fetchChats = async () => {
    try {
      const res = await API.get('/chats');
      const chatList = res.data.chats || [];
      setChats(chatList);

      // If navigated here with a pre-selected chat state
      if (location.state && location.state.chat) {
        const found = chatList.find((c) => c.id === location.state.chat.id);
        setActiveChat(found || location.state.chat);
      } else if (chatList.length > 0 && !activeChat) {
        setActiveChat(chatList[0]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for active chat
  const fetchMessages = async (chatId) => {
    try {
      const res = await API.get(`/chats/${chatId}/messages`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
      if (socket) {
        socket.emit('join_chat', activeChat.id);
      }
    }
  }, [activeChat, socket]);

  // Socket listener for receiving messages in real-time
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (newMsg) => {
        if (activeChat && newMsg.chatId === activeChat.id) {
          setMessages((prev) => [...prev, newMsg]);
        }
        // Refresh chats list to update lastMessage snippet & order
        fetchChats();
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, activeChat]);

  const handleSendMessage = (content) => {
    if (!activeChat || !user || !socket) return;

    const recipientId =
      activeChat.user1Id === user.id ? activeChat.user2Id : activeChat.user1Id;

    socket.emit('send_message', {
      chatId: activeChat.id,
      senderId: user.id,
      receiverId: recipientId,
      content,
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="h-[78vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row">
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          currentUserId={user?.id}
          onlineUsers={onlineUsers}
        />
        <ChatWindow
          activeChat={activeChat}
          currentUserId={user?.id}
          messages={messages}
          onSendMessage={handleSendMessage}
          onlineUsers={onlineUsers}
        />
      </div>
    </div>
  );
};

export default ChatPage;
