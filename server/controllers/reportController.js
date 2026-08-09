const { Report, User, Listing, BlockedUser } = require('../models');
const { Op } = require('sequelize');

// @desc    Report a user or listing
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res, next) => {
  try {
    const { reportedUserId, reportedListingId, reason, description } = req.body;

    if (!reportedUserId && !reportedListingId) {
      return res.status(400).json({ success: false, message: 'Must report either a user or a listing' });
    }
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason is required' });
    }
    if (reportedUserId && Number(reportedUserId) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot report yourself' });
    }

    const report = await Report.create({
      reporterId: req.user.id,
      reportedUserId: reportedUserId || null,
      reportedListingId: reportedListingId || null,
      reason,
      description: description || '',
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const reports = await Report.findAll({
      where,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'reportedUser', attributes: ['id', 'name', 'email', 'isBanned'] },
        { model: Listing, as: 'reportedListing', attributes: ['id', 'title', 'status'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Block a user
// @route   POST /api/reports/block/:userId
// @access  Private
const blockUser = async (req, res, next) => {
  try {
    const blockedId = Number(req.params.userId);

    if (blockedId === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot block yourself' });
    }

    const targetUser = await User.findByPk(blockedId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [blockRecord, created] = await BlockedUser.findOrCreate({
      where: { blockerId: req.user.id, blockedId },
    });

    if (!created) {
      return res.status(400).json({ success: false, message: 'User is already blocked' });
    }

    res.status(201).json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unblock a user
// @route   DELETE /api/reports/block/:userId
// @access  Private
const unblockUser = async (req, res, next) => {
  try {
    const blockedId = Number(req.params.userId);

    const deleted = await BlockedUser.destroy({
      where: { blockerId: req.user.id, blockedId },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Block record not found' });
    }

    res.json({ success: true, message: 'User unblocked successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of users I've blocked
// @route   GET /api/reports/blocked
// @access  Private
const getBlockedUsers = async (req, res, next) => {
  try {
    const blocks = await BlockedUser.findAll({
      where: { blockerId: req.user.id },
      include: [{ model: User, as: 'blocked', attributes: ['id', 'name', 'avatar', 'college'] }],
    });

    res.json({ success: true, blockedUsers: blocks.map((b) => b.blocked) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
  blockUser,
  unblockUser,
  getBlockedUsers,
};