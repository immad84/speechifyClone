
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ [INFO] MongoDB connection established successfully..........');
  } catch (err) {
    console.error("❌ [ERROR] MongoDB connection error..........................", err)
    process.exit(1);
  }
};

module.exports = connectDB;



// require('dotenv').config();
// const { Pool } = require('pg')

// const pool = new Pool({
//   host: process.env.PG_HOST,
//   port: process.env.PG_PORT,
//   database: process.env.PG_DATABASE,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD
// })

// const connectDB = async () => {
//   try {
//     await pool.connect();
//     console.log('PostgreSQL connected');
//   } catch (err) {
//     console.error('DB connection error:', err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;




