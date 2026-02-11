const PaymentRepository = require('../repositories/PaymentRepository');
const AppError = require('../utils/AppError');
const crypto = require('crypto');

class PaymentService {
  async processPayment(orderId, amount, token) {
    // 1. Verify Order exists and amount matches (Optional but recommended)
    const order = await PaymentRepository.getOrder(orderId);
    if (!order) {
        throw new AppError('Order not found', 404);
    }
    // Simple check: if order is already paid
    if (order.status === 'paid') {
        throw new AppError('Order is already paid', 400);
    }

    // 2. Mock Gateway Call
    const isSuccess = true; // Mock success
    const transactionId = crypto.randomUUID();

    if (!isSuccess) {
      await PaymentRepository.create({
        orderId, amount, status: 'failed', transactionId, provider: 'mock'
      });
      throw new AppError('Payment failed', 400);
    }

    // 3. Record Payment
    const paymentId = await PaymentRepository.create({
      orderId, amount, status: 'completed', transactionId, provider: 'mock'
    });

    // 4. Update Order Status
    await PaymentRepository.updateOrderStatus(orderId, 'paid');

    return { paymentId, transactionId, status: 'completed' };
  }
}

module.exports = new PaymentService();
