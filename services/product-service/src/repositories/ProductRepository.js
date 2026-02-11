const pool = require('../config/database');

class ProductRepository {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM products');
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  async create(product) {
    const { name, slug, description, price, stockQuantity, categoryId, imageUrl } = product;
    const [result] = await pool.execute(
      'INSERT INTO products (name, slug, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, slug, description, price, stockQuantity, categoryId, imageUrl]
    );
    return result.insertId;
  }

  async update(id, product) {
    const { name, slug, description, price, stockQuantity, categoryId, imageUrl } = product;
    const [result] = await pool.execute(
      'UPDATE products SET name = ?, slug = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, slug, description, price, stockQuantity, categoryId, imageUrl, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new ProductRepository();
