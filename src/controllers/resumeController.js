const fs = require("fs");
const pdf = require("pdf-parse");
const pool = require("../config/db");

exports.uploadResume = async (req, res) => {
  try {
    console.log("File received:", req.file);

    const filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdf(dataBuffer);

   console.log("PDF Text Length:", pdfData.text.length);

console.log(
  "PDF Text Preview:\n",
  pdfData.text.substring(0, 1000)
);

    const result = await pool.query(
      `INSERT INTO resumes (
        user_id,
        file_name,
        resume_text
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
      [
        req.user.id,
        req.file.filename,
        pdfData.text
      ]
    );

    res.status(201).json({
      message: "Resume uploaded",
      resume: result.rows[0]
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,
              file_name,
              created_at
       FROM resumes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};
exports.deleteResume = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM resumes
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [
        id,
        req.user.id
      ]
    );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Resume not found"
      });
    }

    res.json({
      message:
        "Resume deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Delete failed"
    });

  }
};