const pool = require('../config/database');

exports.createPaymentSession = async (req, res) => {
  res.json({
    success: true,
    data: { url: 'http://localhost:5174/payment/success' }
  });
};

exports.getPaymentHistory = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.verifyPayment = async (req, res) => {
  res.json({ success: true, message: 'Payment verified' });
};

exports.handleWebhook = async (req, res) => {
  res.status(200).send('Webhook handled (Mock)');
};
