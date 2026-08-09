const { Listing, User } = require('../models');
const { Op } = require('sequelize');
const { sendMilestoneAlert } = require('../services/emailService');

// @desc    Get all listings with pagination, filters, and search
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { search, category, condition, listingType, minPrice, maxPrice, sortBy } = req.query;

    const whereClause = { status: 'active' };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (condition) {
      whereClause.condition = condition;
    }

    if (listingType) {
      whereClause.listingType = listingType;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
    }

    // Sort order
    let order = [['createdAt', 'DESC']];
    if (sortBy === 'price_asc') order = [['price', 'ASC']];
    if (sortBy === 'price_desc') order = [['price', 'DESC']];
    if (sortBy === 'popular') order = [['viewsCount', 'DESC']];

    const { count, rows: listings } = await Listing.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'avatar', 'college'] }],
    });

    res.json({
      success: true,
      listings,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing by ID & increment view count
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email', 'avatar', 'college', 'phone'] }],
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Increment view count
    listing.viewsCount += 1;
    await listing.save();

    // Check milestones (10, 25, 50, 100 views)
    const milestones = [10, 25, 50, 100];
    if (milestones.includes(listing.viewsCount) && listing.seller) {
      sendMilestoneAlert(listing.seller, listing, listing.viewsCount);
    }

    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res, next) => {
  try {
    const { title, description, price, listingType, category, condition, location, lat, lng } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const listing = await Listing.create({
      title,
      description,
      price: parseFloat(price),
      listingType: listingType || 'sell',
      category,
      condition,
      location,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      images,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const { title, description, price, listingType, category, condition, location, lat, lng, status } = req.body;

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price ? parseFloat(price) : listing.price;
    listing.listingType = listingType || listing.listingType;
    listing.category = category || listing.category;
    listing.condition = condition || listing.condition;
    listing.location = location || listing.location;
    listing.lat = lat ? parseFloat(lat) : listing.lat;
    listing.lng = lng ? parseFloat(lng) : listing.lng;
    listing.status = status || listing.status;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      listing.images = [...(listing.images || []), ...newImages];
    }

    await listing.save();

    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await listing.destroy();

    res.json({ success: true, message: 'Listing removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own listings + performance analytics
// @route   GET /api/listings/my-listings
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    const totalViews = listings.reduce((sum, item) => sum + (item.viewsCount || 0), 0);
    const totalSoldRented = listings.filter((item) => item.status === 'sold' || item.status === 'rented').length;

    res.json({
      success: true,
      stats: {
        totalListings: listings.length,
        totalViews,
        totalSoldRented,
      },
      listings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
};
