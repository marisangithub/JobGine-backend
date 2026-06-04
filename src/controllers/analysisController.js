const pool = require("../config/db");

const {
  generateSuggestions,
  generateJobDescription,
  extractSkillsWithAI
} = require(
  "../services/geminiService"
);

exports.runAnalysis = async (req, res) => {
  try {
    const {
      resumeId,
      jobDescription,
      jobTitle
    } = req.body;

    let finalJobDescription = jobDescription;

    // Generate JD from Job Title if JD not provided
    if (
      (!jobDescription ||
        jobDescription.trim() === "") &&
      jobTitle
    ) {
      finalJobDescription =
        await generateJobDescription(
          jobTitle
        );
    }

    if (
      !finalJobDescription ||
      finalJobDescription.trim() === ""
    ) {
      return res.status(400).json({
        message:
          "Provide either a Job Description or Job Title"
      });
    }

    // Fetch Resume
    const resumeResult =
      await pool.query(
        `
        SELECT *
        FROM resumes
        WHERE id = $1
        `,
        [resumeId]
      );

    if (
      resumeResult.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    const resume =
      resumeResult.rows[0];

    // Extract Skills
const resumeSkills =
  await extractSkillsWithAI(
    resume.resume_text
  );

const jobSkills =
  await extractSkillsWithAI(
    finalJobDescription
  );

    // Match Skills
const matchedSkills =
  resumeSkills.filter(
    (skill) =>
      jobSkills.some(
        (jobSkill) =>
          jobSkill.toLowerCase() ===
          skill.toLowerCase()
      )
  );

  const missingSkills =
  jobSkills.filter(
    (skill) =>
      !resumeSkills.some(
        (resumeSkill) =>
          resumeSkill.toLowerCase() ===
          skill.toLowerCase()
      )
  );

    // ATS Score
    const atsScore =
      jobSkills.length === 0
        ? 0
        : Math.round(
            (
              matchedSkills.length /
              jobSkills.length
            ) * 100
          );

    // Gemini Suggestions
    let suggestions;

    try {
      suggestions =
        await generateSuggestions(
          resume.resume_text,
          finalJobDescription,
          missingSkills
        );
    } catch (error) {
      console.error(
        "Gemini Error:",
        error
      );

      suggestions =
        missingSkills.length > 0
          ? `Consider adding: ${missingSkills.join(
              ", "
            )}`
          : "Resume matches job requirements well.";
    }

    // Save Analysis
    const analysis =
      await pool.query(
        `
        INSERT INTO analyses (
          user_id,
          resume_id,
          job_description,
          ats_score,
          matched_skills,
          missing_skills,
          suggestions
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *
        `,
        [
          req.user.id,
          resumeId,
          finalJobDescription,
          atsScore,
          matchedSkills,
          missingSkills,
          suggestions
        ]
      );

    res.json({
      ...analysis.rows[0],
      generatedJobDescription:
        finalJobDescription
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Analysis failed"
    });
  }
};

exports.getAnalyses = async (req, res) => {
  try {
    const result =
      await pool.query(
        `
        SELECT *
        FROM analyses
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
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