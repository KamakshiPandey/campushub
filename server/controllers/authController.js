const { User, Listing, Roommate, Review } = require('../models');
const generateToken = require('../utils/generateToken');
const { sendWelcomeEmail } = require('../services/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, college, phone, bio } = req.body;
    const allowedDomains = (process.env.COLLEGE_EMAIL_DOMAINS || '')
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    const emailLower = email.toLowerCase();
    const isAllowedDomain = allowedDomains.length === 0
      || allowedDomains.some((domain) => emailLower.endsWith(domain));

    if (!isAllowedDomain) {
      return res.status(400).json({
        success: false,
        message: `Only college emails from ${allowedDomains.join(' or ')} are allowed to register`,
      });
    }
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      college: college || 'Campus Main',
      phone: phone || '',
      bio: bio || '',
    });

    if (user) {
      // Async trigger welcome email
      sendWelcomeEmail(user);

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          avatar: user.avatar,
        },
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account is banned by administrator' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Listing, as: 'listings' },
        { model: Roommate, as: 'roommatePosts' },
        {
          model: Review,
          as: 'receivedReviews',
          include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate average rating
    const reviews = user.receivedReviews || [];
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      user: {
        ...user.toJSON(),
        avgRating: Number(avgRating),
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.college = req.body.college || user.college;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        college: updatedUser.college,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of another user
// @route   GET /api/auth/users/:id
// @access  Public
const getPublicUserProfile = async (req, res, next) => {
  try {
    const targetUser = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'college', 'avatar', 'bio', 'createdAt'],
      include: [
        { model: Listing, as: 'listings', where: { status: 'active' }, required: false },
        { model: Roommate, as: 'roommatePosts', where: { status: 'active' }, required: false },
        {
          model: Review,
          as: 'receivedReviews',
          include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
        },
      ],
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    const reviews = targetUser.receivedReviews || [];
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      user: {
        ...targetUser.toJSON(),
        avgRating: Number(avgRating),
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Verify email via token
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user || user.verificationTokenExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Account is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    sendVerificationEmail(user, verificationToken);

    res.json({ success: true, message: 'Verification email resent' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerification,
  updateUserProfile,
  getPublicUserProfile,
};
