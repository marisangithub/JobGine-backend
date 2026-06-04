const pool = require("../config/db");
const {
  generateJobRoles
} = require(
  "../services/groqService"
);

const {
  searchJobs
} = require(
  "../services/jobSearchService"
);

exports.findJobs =
  async (req, res) => {

    try {

      const {
        resumeId
      } = req.body;

      const result =
        await pool.query(
          `
          SELECT resume_text
          FROM resumes
          WHERE id = $1
          `,
          [resumeId]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Resume not found"
        });
      }

      const resumeText =
        result.rows[0]
          .resume_text
          .toLowerCase();

      const roles =
  await generateJobRoles(
    resumeText
  );

const jobs =
  roles
    .split("\n")
    .map(
      role =>
        role
          .replace(/^\d+[\.\-\)]\s*/, "")
          .trim()
    )
    .filter(Boolean);
const uniqueJobs = [
  ...new Set(jobs)
];

let allJobs = [];

for (
  const role of uniqueJobs.slice(
    0,
    3
  )
) {

const results =
  await searchJobs(role);

allJobs.push(
  ...results.slice(0, 5)
);

if (
  results.jobs &&
  Array.isArray(results.jobs)
) {
  allJobs.push(
    ...results.jobs.slice(0, 5)
  );
}
}

console.log(
  "Jobs Found:",
  allJobs.length
);

console.log(
  JSON.stringify(
    allJobs[0],
    null,
    2
  )
);

res.json(allJobs);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to find jobs"
      });
    }
};