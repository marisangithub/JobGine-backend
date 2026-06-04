require("dotenv").config();

const pool = require("./config/db");

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS generated_resumes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(255),
        resume_content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Generated Resume Table Created");
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createTable();