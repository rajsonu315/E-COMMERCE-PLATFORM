const pool = require('../config/database');

class UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  async create(user) {
    const { email, passwordHash, roleId } = user;
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)',
      [email, passwordHash, roleId]
    );
    return result.insertId;
  }
  
  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async findAll() {
    const [rows] = await pool.execute('SELECT id, email, role_id, created_at, status FROM users');
    return rows;
  }

  async updateStatus(id, status) {
    const [result] = await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
  
  async getUserPermissions(userId) {
      // Join users -> roles -> role_permissions -> permissions
      const query = `
        SELECT p.slug 
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
      `;
      const [rows] = await pool.execute(query, [userId]);
      return rows.map(row => row.slug);
  }
}

module.exports = new UserRepository();
