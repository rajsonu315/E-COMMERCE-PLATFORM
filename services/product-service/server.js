const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3003;

pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`Product Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
