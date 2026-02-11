const PaymentService = require('../services/PaymentService');

exports.processPayment = async (req, res, next) => {
  try {
    const { orderId, amount, token } = req.body;
    const result = await PaymentService.processPayment(orderId, amount, token);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};
