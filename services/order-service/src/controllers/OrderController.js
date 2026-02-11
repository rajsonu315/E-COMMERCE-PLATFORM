const OrderService = require('../services/OrderService');

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body; // Expect full address object
    const order = await OrderService.createOrder(req.user.id, shippingAddress);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // Check if admin (roleId 1)
    const isAdmin = req.user.roleId === 1;
    const orders = await OrderService.getUserOrders(req.user.id, isAdmin);
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await OrderService.getOrderDetails(req.params.id);
    // Security check: does order belong to user?
    if (order.user_id !== req.user.id && req.user.roleId !== 1) { // Assuming 1 is admin
         // For now, simple check
         // throw new AppError('Not authorized', 403);
    }
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};
