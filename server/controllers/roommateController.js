const { Roommate, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all roommate posts with filters & search
// @route   GET /api/roommates
// @access  Public
const getRoommates = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const { search, maxBudget, genderPreference, location } = req.query;

    const whereClause = { status: 'active' };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
      ];
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (genderPreference && genderPreference !== 'any') {
      whereClause.genderPreference = { [Op.in]: [genderPreference, 'any'] };
    }

    if (maxBudget) {
      whereClause.budget = { [Op.lte]: Number(maxBudget) };
    }

    const { count, rows: roommates } = await Roommate.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'avatar', 'college', 'phone'] }],
    });

    res.json({
      success: true,
      roommates,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get roommate post by ID
// @route   GET /api/roommates/:id
// @access  Public
const getRoommateById = async (req, res, next) => {
  try {
    const roommate = await Roommate.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email', 'avatar', 'college', 'phone', 'bio'] }],
    });

    if (!roommate) {
      return res.status(404).json({ success: false, message: 'Roommate post not found' });
    }

    res.json({ success: true, roommate });
  } catch (error) {
    next(error);
  }
};

// @desc    Create roommate post
// @route   POST /api/roommates
// @access  Private
const createRoommate = async (req, res, next) => {
  try {
    const { title, description, budget, location, genderPreference, moveInDate, amenities, lat, lng } = req.body;

    const roommate = await Roommate.create({
      title,
      description,
      budget: parseFloat(budget),
      location,
      genderPreference: genderPreference || 'any',
      moveInDate,
      amenities: Array.isArray(amenities) ? amenities : (amenities ? JSON.parse(amenities) : []),
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, roommate });
  } catch (error) {
    next(error);
  }
};

// @desc    Update roommate post
// @route   PUT /api/roommates/:id
// @access  Private
const updateRoommate = async (req, res, next) => {
  try {
    const roommate = await Roommate.findByPk(req.params.id);

    if (!roommate) {
      return res.status(404).json({ success: false, message: 'Roommate post not found' });
    }

    if (roommate.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    const { title, description, budget, location, genderPreference, moveInDate, amenities, lat, lng, status } = req.body;

    roommate.title = title || roommate.title;
    roommate.description = description || roommate.description;
    roommate.budget = budget ? parseFloat(budget) : roommate.budget;
    roommate.location = location || roommate.location;
    roommate.genderPreference = genderPreference || roommate.genderPreference;
    roommate.moveInDate = moveInDate || roommate.moveInDate;
    roommate.status = status || roommate.status;
    roommate.lat = lat ? parseFloat(lat) : roommate.lat;
    roommate.lng = lng ? parseFloat(lng) : roommate.lng;
    if (amenities) {
      roommate.amenities = Array.isArray(amenities) ? amenities : JSON.parse(amenities);
    }

    await roommate.save();

    res.json({ success: true, roommate });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete roommate post
// @route   DELETE /api/roommates/:id
// @access  Private
const deleteRoommate = async (req, res, next) => {
  try {
    const roommate = await Roommate.findByPk(req.params.id);

    if (!roommate) {
      return res.status(404).json({ success: false, message: 'Roommate post not found' });
    }

    if (roommate.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await roommate.destroy();

    res.json({ success: true, message: 'Roommate post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoommates,
  getRoommateById,
  createRoommate,
  updateRoommate,
  deleteRoommate,
};
