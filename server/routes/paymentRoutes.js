const express = require('express');
const router = express.Router();
const {
  reserveListing,
  createOrder,
  verifyPayment,
  getPaymentById,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/listings/:id/reserve', protect, reserveListing);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/:id', protect, getPaymentById);

module.exports = router;
