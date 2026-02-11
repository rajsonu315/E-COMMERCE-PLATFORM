const pool = require('../config/database');

class NotificationRepository {
  async create(userId, type, message) {
    const [result] = await pool.execute(
      'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
      [userId, type, message]
    );
    return result.insertId;
  }

  async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  }
}

module.exports = new NotificationRepository();
