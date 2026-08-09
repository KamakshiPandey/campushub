const { Review, User, Listing } = require('../models');
const { Op } = require('sequelize');

// @desc    Add review for a user
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { targetUserId, rating, comment } = req.body;

    if (!targetUserId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (parseInt(targetUserId) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // Verify completed transaction between reviewer and target user
    const completedTransaction = await Listing.findOne({
      where: {
        status: 'sold',
        [Op.or]: [
          { userId: req.user.id, buyerId: targetUserId },
          { userId: targetUserId, buyerId: req.user.id }
        ]
      }
    });

    if (!completedTransaction) {
      return res.status(403).json({
        success: false,
        message: 'You can only review users you have completed a transaction (buy/sell) with.'
      });
    }

    // Check if user already reviewed this peer
    const existingReview = await Review.findOne({
      where: {
        reviewerId: req.user.id,
        targetUserId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this user.'
      });
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      targetUserId,
      rating: Number(rating),
      comment,
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(201).json({ success: true, review: fullReview });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a target user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { targetUserId: req.params.userId },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
    });

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getUserReviews,
};
