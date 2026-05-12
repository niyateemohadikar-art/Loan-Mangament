const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/create-session', authenticate, paymentController.createPaymentSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.get('/verify/:session_id', authenticate, paymentController.verifyPayment);
router.get('/history', authenticate, paymentController.getPaymentHistory);

module.exports = router;
