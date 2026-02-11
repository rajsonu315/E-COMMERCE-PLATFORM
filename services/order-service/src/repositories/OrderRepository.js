const pool = require('../config/database');

class OrderRepository {
  async create(userId, totalAmount, shippingAddress) {
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address_json, status) VALUES (?, ?, ?, ?)',
      [userId, totalAmount, JSON.stringify(shippingAddress), 'pending']
    );
    return result.insertId;
  }

  async addItems(orderId, items) {
    const values = items.map(item => [orderId, item.product_id, item.product_name, item.price, item.quantity]);
    // Bulk insert
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES ?',
      [values]
    );
  }

  async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  }

  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  }

  async findById(orderId) {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0];
  }

  async getOrderItems(orderId) {
    const [rows] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows;
  }
  
  async updateStatus(orderId, status) {
      await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  }

  // Helper to fetch cart items with product details
  async getCartItemsWithProduct(userId) {
    const query = `
      SELECT ci.product_id, ci.quantity, p.name as product_name, p.price
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      JOIN products p ON ci.product_id = p.id
      WHERE c.user_id = ?
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  async clearCart(userId) {
    // Subquery delete or find cart id first
    // Simplify:
    await pool.execute('DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?', [userId]);
  }
}

module.exports = new OrderRepository();
