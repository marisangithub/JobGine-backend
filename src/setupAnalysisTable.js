require("dotenv").config();

const pool = require("./config/db");

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
        job_description TEXT NOT NULL,
        ats_score INTEGER,
        matched_skills TEXT[],
        missing_skills TEXT[],
        suggestions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Analysis table created");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createTable();