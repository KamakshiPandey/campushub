const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createReport,
  getReports,
  updateReportStatus,
  blockUser,
  unblockUser,
  getBlockedUsers,
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

router.post(
  '/',
  protect,
  [check('reason', 'Reason is required').not().isEmpty()],
  validate,
  createReport
);

router.get('/', protect, admin, getReports);
router.put('/:id', protect, admin, updateReportStatus);

router.post('/block/:userId', protect, blockUser);
router.delete('/block/:userId', protect, unblockUser);
router.get('/blocked', protect, getBlockedUsers);

module.exports = router;