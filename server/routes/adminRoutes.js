const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserBan,
  moderateListing,
  moderateRoommate,
  getAdminTransactions,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleUserBan);
router.delete('/listings/:id', moderateListing);
router.delete('/roommates/:id', moderateRoommate);
router.get('/transactions', getAdminTransactions);

module.exports = router;
