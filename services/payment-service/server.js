const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3006;

pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`Payment Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
