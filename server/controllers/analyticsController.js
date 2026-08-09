const { Listing, Payment, User } = require('../models');

// @desc    Get user and platform analytics stats
// @route   GET /api/analytics/dashboard
// @access  Private
const getAnalyticsDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Platform-wide stats
    const totalItemsSold = await Listing.count({ where: { status: 'sold' } });

    // User-specific analytics
    const mySales = await Listing.findAll({
      where: { userId, status: 'sold' },
    });

    const userSalesCount = mySales.length;
    const totalSalesVolume = mySales.reduce((sum, item) => sum + parseFloat(item.price), 0);

    const myActiveListings = await Listing.count({
      where: { userId, status: 'available' },
    });

    const myReservedListings = await Listing.count({
      where: { userId, status: 'reserved' },
    });

    res.json({
      success: true,
      platform: {
        totalItemsSold,
      },
      user: {
        userSalesCount,
        totalSalesVolume,
        myActiveListings,
        myReservedListings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsDashboard,
};
