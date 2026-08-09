const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getListings);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getListingById);

router.post(
  '/',
  protect,
  upload.array('images', 5),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Price must be a valid number').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('condition', 'Condition is required').not().isEmpty(),
  ],
  validate,
  createListing
);

router.put('/:id', protect, upload.array('images', 5), updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
