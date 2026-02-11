const pool = require('../config/database');

class UserProfileRepository {
  async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    return rows[0];
  }

  async upsert(userId, data) {
    const { firstName, lastName, phone } = data;
    // Check if exists
    const existing = await this.findByUserId(userId);
    if (existing) {
      await pool.execute(
        'UPDATE user_profiles SET first_name = ?, last_name = ?, phone = ? WHERE user_id = ?',
        [firstName, lastName, phone, userId]
      );
    } else {
      await pool.execute(
        'INSERT INTO user_profiles (user_id, first_name, last_name, phone) VALUES (?, ?, ?, ?)',
        [userId, firstName, lastName, phone]
      );
    }
    return this.findByUserId(userId);
  }
}

module.exports = new UserProfileRepository();
