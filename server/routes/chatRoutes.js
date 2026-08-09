const express = require('express');
const router = express.Router();
const {
  accessChat,
  getUserChats,
  getChatMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, accessChat);
router.get('/', protect, getUserChats);
router.get('/:chatId/messages', protect, getChatMessages);

module.exports = router;
