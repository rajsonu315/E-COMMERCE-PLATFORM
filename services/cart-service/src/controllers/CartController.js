const CartService = require('../services/CartService');

exports.getCart = async (req, res, next) => {
  try {
    const cart = await CartService.getCart(req.user.id);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartService.addToCart(req.user.id, productId, quantity || 1);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;
    const cart = await CartService.updateItem(req.user.id, productId, quantity);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const cart = await CartService.removeItem(req.user.id, productId);
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (err) {
    next(err);
  }
};
