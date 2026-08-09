const { User, Listing, Roommate, Review, Payment } = require('../models');

// @desc    Get admin platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalListings = await Listing.count();
    const totalRoommates = await Roommate.count();
    const totalReviews = await Review.count();
    const activeListings = await Listing.count({ where: { status: 'available' } });
    const activeRoommates = await Roommate.count({ where: { status: 'active' } });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalListings,
        totalRoommates,
        totalReviews,
        activeListings,
        activeRoommates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user ban status
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleUserBan = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot ban admin user' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} is now ${user.isBanned ? 'banned' : 'unbanned'}`,
      isBanned: user.isBanned,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate listing (status change or remove)
// @route   DELETE /api/admin/listings/:id
// @access  Private/Admin
const moderateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    await listing.destroy();

    res.json({ success: true, message: 'Listing moderated and deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate roommate post
// @route   DELETE /api/admin/roommates/:id
// @access  Private/Admin
const moderateRoommate = async (req, res, next) => {
  try {
    const roommate = await Roommate.findByPk(req.params.id);

    if (!roommate) {
      return res.status(404).json({ success: false, message: 'Roommate post not found' });
    }

    await roommate.destroy();

    res.json({ success: true, message: 'Roommate post moderated and deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions/payments
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getAdminTransactions = async (req, res, next) => {
  try {
    const transactions = await Payment.findAll({
      include: [
        { model: Listing, attributes: ['id', 'title', 'price'] },
        { model: User, attributes: ['id', 'name', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserBan,
  moderateListing,
  moderateRoommate,
  getAdminTransactions,
};
