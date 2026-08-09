const { Message, Chat, User, Listing } = require('../models');
const { sendNewMessageAlert } = require('../services/emailService');

const onlineUsers = new Map(); // userId -> socketId

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ Socket connected:', socket.id);

    // User setup & online status
    socket.on('setup', (userData) => {
      if (userData && userData.id) {
        socket.userId = userData.id;
        onlineUsers.set(userData.id, socket.id);
        socket.join(`user_${userData.id}`);
        console.log(`User ${userData.name} (${userData.id}) connected & joined personal room`);
        
        // Broadcast online users list
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });

    // Join room / chat
    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Socket ${socket.id} joined room chat_${chatId}`);
    });

    // Send direct message
    socket.on('send_message', async (data) => {
      try {
        const { chatId, senderId, receiverId, content } = data;

        if (!chatId || !senderId || !receiverId || !content) return;

        // Retrieve chat with associated listing
        const chat = await Chat.findByPk(chatId, {
          include: [{ model: Listing, as: 'listing' }]
        });

        if (!chat) return;

        // Check if listing is sold and enforce restrictions
        if (chat.listing && chat.listing.status === 'sold') {
          const isBuyer = chat.listing.buyerId === senderId;
          const isSeller = chat.listing.userId === senderId;
          if (!isBuyer && !isSeller) {
            socket.emit('error_message', { message: 'Item no longer available' });
            return;
          }
        }

        // Persist message to DB
        const message = await Message.create({
          chatId,
          senderId,
          receiverId,
          content,
        });

        // Update Chat lastMessage
        chat.lastMessage = content;
        chat.lastMessageAt = new Date();
        await chat.save();

        const fullMessage = await Message.findByPk(message.id, {
          include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] }],
        });

        // Emit to chat room
        io.to(`chat_${chatId}`).emit('receive_message', fullMessage);
        
        // Also emit directly to recipient user room for real-time notifications
        io.to(`user_${receiverId}`).emit('new_message_notification', fullMessage);

        // If recipient is offline, trigger email notification
        const isRecipientOnline = onlineUsers.has(receiverId);
        if (!isRecipientOnline) {
          const recipient = await User.findByPk(receiverId);
          const sender = await User.findByPk(senderId);
          if (recipient && sender) {
            sendNewMessageAlert(recipient, sender.name, content);
          }
        }
      } catch (error) {
        console.error('Error handling send_message in Socket.io:', error.message);
      }
    });

    // Typing indicators
    socket.on('typing', ({ chatId, userId }) => {
      socket.to(`chat_${chatId}`).emit('typing', { chatId, userId });
    });

    socket.on('stop_typing', ({ chatId, userId }) => {
      socket.to(`chat_${chatId}`).emit('stop_typing', { chatId, userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('online_users', Array.from(onlineUsers.keys()));
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};

module.exports = socketHandler;
