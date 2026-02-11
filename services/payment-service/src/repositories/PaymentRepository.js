const pool = require('../config/database');

class PaymentRepository {
  async create(data) {
    const { orderId, amount, status, transactionId, provider } = data;
    const [result] = await pool.execute(
      'INSERT INTO payments (order_id, amount, status, transaction_id, provider) VALUES (?, ?, ?, ?, ?)',
      [orderId, amount, status, transactionId, provider]
    );
    return result.insertId;
  }

  async updateOrderStatus(orderId, status) {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
  }
  
  async getOrder(orderId) {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0];
  }
}

module.exports = new PaymentRepository();
