const CartRepository = require('../repositories/CartRepository');

class CartService {
  async getCart(userId) {
    let cart = await CartRepository.findCartByUserId(userId);
    if (!cart) {
      const cartId = await CartRepository.createCart(userId);
      cart = { id: cartId, user_id: userId };
    }
    const items = await CartRepository.getCartItems(cart.id);
    return { ...cart, items };
  }

  async addToCart(userId, productId, quantity) {
    const cart = await this.getCart(userId);
    await CartRepository.addItem(cart.id, productId, quantity);
    return this.getCart(userId);
  }

  async updateItem(userId, productId, quantity) {
    const cart = await this.getCart(userId);
    if (quantity <= 0) {
      await CartRepository.removeItem(cart.id, productId);
    } else {
      await CartRepository.updateItemQuantity(cart.id, productId, quantity);
    }
    return this.getCart(userId);
  }

  async removeItem(userId, productId) {
    const cart = await this.getCart(userId);
    await CartRepository.removeItem(cart.id, productId);
    return this.getCart(userId);
  }
}

module.exports = new CartService();
