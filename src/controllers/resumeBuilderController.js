const pool = require("../config/db");

const {
  generateResume,
} = require("../services/groqService");

exports.createResume = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      experience,
      skills,
      projects,
      education,
      certifications,
    } = req.body;

    const resumeContent =
      await generateResume({
        name,
        email,
        phone,
        role,
        experience,
        skills,
        projects,
        education,
        certifications,
      });

const cleanedResume =
  resumeContent
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#+/g, "")
    .replace(/References[\s\S]*$/i, "")
    .trim();

    const result =
      await pool.query(
        `
        INSERT INTO generated_resumes
        (
          user_id,
          role,
          resume_content
        )
        VALUES ($1,$2,$3)
        RETURNING *
        `,
        [
          req.user.id,
          role,
          cleanedResume,
        ]
      );

    res.status(201).json({
      resume: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Resume generation failed",
    });
  }
};
exports.getResumeHistory =
  async (req, res) => {

    try {

      const result =
        await pool.query(
          `
          SELECT *
          FROM generated_resumes
          WHERE user_id = $1
          ORDER BY created_at DESC
          `,
          [req.user.id]
        );

      res.json(
        result.rows
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch history"
      });
    }
};

exports.deleteResume =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      await pool.query(
        `
        DELETE FROM generated_resumes
        WHERE id = $1
        AND user_id = $2
        `,
        [
          id,
          req.user.id
        ]
      );

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