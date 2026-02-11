const pool = require('../config/database');

class CartRepository {
  async findCartByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
    return rows[0];
  }

  async createCart(userId) {
    const [result] = await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }

  async getCartItems(cartId) {
    const [rows] = await pool.execute('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);
    return rows;
  }

  async addItem(cartId, productId, quantity) {
    // Check if exists
    const [existing] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existing.length > 0) {
      await pool.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
        [quantity, cartId, productId]
      );
    } else {
      await pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, quantity]
      );
    }
  }

  async updateItemQuantity(cartId, productId, quantity) {
    await pool.execute(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
  }

  async removeItem(cartId, productId) {
    await pool.execute('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
  }

  async clearCart(cartId) {
      await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
}

module.exports = new CartRepository();
