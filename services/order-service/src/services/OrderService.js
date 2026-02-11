const OrderRepository = require('../repositories/OrderRepository');
const AppError = require('../utils/AppError');

class OrderService {
  async createOrder(userId, shippingAddress) {
    // 1. Get Cart Items with price
    const items = await OrderRepository.getCartItemsWithProduct(userId);
    if (items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // 2. Calculate Total
    const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    // 3. Create Order
    const orderId = await OrderRepository.create(userId, totalAmount, shippingAddress);

    // 4. Add Items
    await OrderRepository.addItems(orderId, items);

    // 5. Clear Cart
    await OrderRepository.clearCart(userId);

    return { orderId, totalAmount, status: 'pending' };
  }

  async getUserOrders(userId, isAdmin = false) {
    if (isAdmin) {
      return await OrderRepository.findAll();
    }
    const orders = await OrderRepository.findByUserId(userId);
    return orders;
  }

  async getOrderDetails(orderId) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    
    const items = await OrderRepository.getOrderItems(orderId);
    return { ...order, items };
  }
}

module.exports = new OrderService();
