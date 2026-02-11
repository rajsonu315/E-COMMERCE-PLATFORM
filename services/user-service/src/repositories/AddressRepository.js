const pool = require('../config/database');

class AddressRepository {
  async findAllByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    return rows;
  }

  async create(userId, data) {
    const { streetLine1, streetLine2, city, state, postalCode, country, isDefault } = data;
    const [result] = await pool.execute(
      'INSERT INTO addresses (user_id, street_line1, street_line2, city, state, postal_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, streetLine1, streetLine2, city, state, postalCode, country, isDefault || false]
    );
    return { id: result.insertId, ...data };
  }

  async delete(id, userId) {
      await pool.execute('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
  }
}

module.exports = new AddressRepository();
