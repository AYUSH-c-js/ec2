const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon (and most cloud Postgres)
  }
});

pool.on('connect', () => {
  console.log('Connected to the Neon PostgreSQL database');
});

// Initialize Database Schema
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      is_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("Table 'todos' checks/creation successful");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

module.exports = { pool, initDb };
