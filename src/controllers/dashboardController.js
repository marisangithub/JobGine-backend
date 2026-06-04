const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {

    const userId = req.user.id;

    const resumes = await pool.query(
      `SELECT COUNT(*) FROM resumes
       WHERE user_id = $1`,
      [userId]
    );

    const analyses = await pool.query(
      `SELECT COUNT(*) FROM analyses
       WHERE user_id = $1`,
      [userId]
    );

    const avgScore = await pool.query(
      `SELECT
        COALESCE(
          ROUND(AVG(ats_score)),
          0
        ) as average
       FROM analyses
       WHERE user_id = $1`,
      [userId]
    );

    const latest = await pool.query(
      `
      SELECT *
      FROM analyses
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    res.json({
      totalResumes:
        resumes.rows[0].count,

      totalAnalyses:
        analyses.rows[0].count,

      averageScore:
        avgScore.rows[0].average,

      latestAnalyses:
        latest.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};