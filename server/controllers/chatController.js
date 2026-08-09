const { Chat, Message, User, Listing } = require('../models');
const { Op } = require('sequelize');

// @desc    Access or create 1-on-1 chat
// @route   POST /api/chats
// @access  Private
const accessChat = async (req, res, next) => {
  try {
    const { targetUserId, listingId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'targetUserId is required' });
    }

    if (parseInt(targetUserId) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });
    }

    // If listingId is provided, check if the listing is sold
    if (listingId) {
      const listing = await Listing.findByPk(listingId);
      if (listing && listing.status === 'sold') {
        // Only allow if user is buyer or seller
        const isBuyer = listing.buyerId === req.user.id;
        const isSeller = listing.userId === req.user.id;
        if (!isBuyer && !isSeller) {
          return res.status(403).json({
            success: false,
            message: 'This listing is no longer available. New chats are disabled.',
          });
        }
      }
    }

    // Check if chat already exists (associated with this listing if listingId is provided)
    const chatWhere = {
      [Op.or]: [
        { user1Id: req.user.id, user2Id: targetUserId },
        { user1Id: targetUserId, user2Id: req.user.id },
      ],
    };
    if (listingId) {
      chatWhere.listingId = listingId;
    }

    let chat = await Chat.findOne({
      where: chatWhere,
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'avatar', 'college'] },
        { model: User, as: 'user2', attributes: ['id', 'name', 'avatar', 'college'] },
        { model: Listing, as: 'listing', attributes: ['id', 'title', 'price', 'status', 'buyerId', 'userId'] },
      ],
    });

    if (!chat) {
      chat = await Chat.create({
        user1Id: req.user.id,
        user2Id: targetUserId,
        listingId: listingId || null,
        lastMessage: 'Chat started',
      });

      chat = await Chat.findByPk(chat.id, {
        include: [
          { model: User, as: 'user1', attributes: ['id', 'name', 'avatar', 'college'] },
          { model: User, as: 'user2', attributes: ['id', 'name', 'avatar', 'college'] },
          { model: Listing, as: 'listing', attributes: ['id', 'title', 'price', 'status', 'buyerId', 'userId'] },
        ],
      });
    }

    res.json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user chats
// @route   GET /api/chats
// @access  Private
const getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { user1Id: req.user.id },
          { user2Id: req.user.id },
        ],
      },
      order: [['lastMessageAt', 'DESC']],
      include: [
        { model: User, as: 'user1', attributes: ['id', 'name', 'avatar', 'college'] },
        { model: User, as: 'user2', attributes: ['id', 'name', 'avatar', 'college'] },
        { model: Listing, as: 'listing', attributes: ['id', 'title', 'price', 'status', 'buyerId', 'userId'] },
      ],
    });

    res.json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history for a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
const getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: Listing, as: 'listing', attributes: ['id', 'status', 'buyerId', 'userId'] }
      ]
    });
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    if (chat.user1Id !== req.user.id && chat.user2Id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these messages' });
    }

    // Chat system logic block: if listing.status === 'sold', restrict messaging only to buyer and seller
    if (chat.listing && chat.listing.status === 'sold') {
      const isBuyer = chat.listing.buyerId === req.user.id;
      const isSeller = chat.listing.userId === req.user.id;
      if (!isBuyer && !isSeller) {
        return res.json({
          success: true,
          messages: [],
          systemNotice: 'Item no longer available',
        });
      }
    }

    const messages = await Message.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
      ],
    });

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  accessChat,
  getUserChats,
  getChatMessages,
};
