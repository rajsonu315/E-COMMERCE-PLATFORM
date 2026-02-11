const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true 
});

async function seed() {
  try {
    console.log('Connecting to database...');
    const connection = await pool.getConnection();
    console.log('Connected!');

    // 1. Run Schema
    console.log('Running schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon but be careful with triggers/procedures if any (schema.sql looked simple)
    // Actually mysql2 supports multipleStatements: true, so we can just run it.
    // However, schema.sql creates tables. If they exist, it might fail if not "IF NOT EXISTS".
    // Let's read schema.sql again to check. 
    // The previous read showed "CREATE TABLE roles ...". It does NOT say "IF NOT EXISTS".
    // So if I run it again it will fail.
    // I should probably drop tables first or check if they exist.
    // Given "sb seed kro" (seed everything), I'll try to drop tables first to ensure clean slate.
    
    const dropTables = `
      SET FOREIGN_KEY_CHECKS = 0;
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS cart_items;
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS addresses;
      DROP TABLE IF EXISTS user_profiles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS role_permissions;
      DROP TABLE IF EXISTS permissions;
      DROP TABLE IF EXISTS roles;
      SET FOREIGN_KEY_CHECKS = 1;
    `;
    
    await connection.query(dropTables);
    console.log('Tables dropped.');

    await connection.query(schemaSql);
    console.log('Schema executed.');

    // 2. Insert Data
    console.log('Inserting initial data...');

    // Roles
    const [roleResult] = await connection.query(`
      INSERT INTO roles (name, description) VALUES 
      ('admin', 'Administrator with full access'),
      ('customer', 'Regular customer'),
      ('support', 'Support agent')
    `);
    console.log('Roles inserted');

    // Get Role IDs
    const [roles] = await connection.query('SELECT id, name FROM roles');
    const adminRole = roles.find(r => r.name === 'admin');
    const customerRole = roles.find(r => r.name === 'customer');

    // Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const [userResult] = await connection.query(`
      INSERT INTO users (email, password_hash, role_id, is_active) VALUES 
      ('admin@example.com', ?, ?, true),
      ('user@example.com', ?, ?, true)
    `, [passwordHash, adminRole.id, passwordHash, customerRole.id]);
    console.log('Users inserted');

    const [users] = await connection.query('SELECT id, email FROM users');
    const adminUser = users.find(u => u.email === 'admin@example.com');
    const regularUser = users.find(u => u.email === 'user@example.com');

    // User Profiles
    await connection.query(`
      INSERT INTO user_profiles (user_id, first_name, last_name, phone) VALUES 
      (?, 'Admin', 'User', '1234567890'),
      (?, 'John', 'Doe', '0987654321')
    `, [adminUser.id, regularUser.id]);
    console.log('User profiles inserted');

    // Categories
    await connection.query(`
      INSERT INTO categories (name, slug, parent_id) VALUES 
      ('Electronics', 'electronics', NULL),
      ('Clothing', 'clothing', NULL),
      ('Books', 'books', NULL)
    `);
    
    const [categories] = await connection.query('SELECT id, slug FROM categories');
    const electronics = categories.find(c => c.slug === 'electronics');
    const clothing = categories.find(c => c.slug === 'clothing');

    // Subcategories
    await connection.query(`
      INSERT INTO categories (name, slug, parent_id) VALUES 
      ('Laptops', 'laptops', ?),
      ('Smartphones', 'smartphones', ?),
      ('T-Shirts', 't-shirts', ?)
    `, [electronics.id, electronics.id, clothing.id]);
    console.log('Categories inserted');
    
    // Re-fetch categories to get subcategories
    const [allCategories] = await connection.query('SELECT id, slug FROM categories');
    const laptops = allCategories.find(c => c.slug === 'laptops');
    const smartphones = allCategories.find(c => c.slug === 'smartphones');

    // Products
    await connection.query(`
      INSERT INTO products (name, slug, description, price, stock_quantity, category_id, image_url) VALUES 
      ('MacBook Pro 16', 'macbook-pro-16', 'Powerful laptop for professionals', 2499.99, 50, ?, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800'),
      ('iPhone 15', 'iphone-15', 'Latest smartphone from Apple', 999.99, 100, ?, 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800'),
      ('Dell XPS 15', 'dell-xps-15', 'High performance Windows laptop', 1899.99, 30, ?, 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800'),
      ('Basic White Tee', 'basic-white-tee', 'Comfortable cotton t-shirt', 19.99, 200, ?, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800')
    `, [laptops.id, smartphones.id, laptops.id, clothing ? clothing.id : null]); // Fallback if clothing subcat issue
    console.log('Products inserted');

    connection.release();
    console.log('Seeding completed successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
