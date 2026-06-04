require("dotenv").config();

const pool = require("./config/db");

const createResumeTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255),
        resume_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Resume table created");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createResumeTable();