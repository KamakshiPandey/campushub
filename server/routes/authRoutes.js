const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getPublicUserProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  validate,
  loginUser
);

router.get('/verify-email/:token', verifyEmail);
router.post(
  '/resend-verification',
  [check('email', 'Please include a valid email').isEmail()],
  validate,
  resendVerification
);
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [check('password', 'Password must be 6 or more characters').isLength({ min: 6 })],
  validate,
  resetPassword
);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.get('/users/:id', getPublicUserProfile);

module.exports = router;