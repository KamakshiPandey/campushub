const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getRoommates,
  getRoommateById,
  createRoommate,
  updateRoommate,
  deleteRoommate,
} = require('../controllers/roommateController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

router.get('/', getRoommates);
router.get('/:id', getRoommateById);

router.post(
  '/',
  protect,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('budget', 'Budget must be a valid number').isNumeric(),
    check('location', 'Location is required').not().isEmpty(),
    check('moveInDate', 'Move-in date is required').not().isEmpty(),
  ],
  validate,
  createRoommate
);

router.put('/:id', protect, updateRoommate);
router.delete('/:id', protect, deleteRoommate);

module.exports = router;
