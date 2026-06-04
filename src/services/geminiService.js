const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

const extractSkillsWithAI = async (text) => {
  const prompt = `
Extract only technical skills from the following text.

Return ONLY a JSON array.

Example:
["React","Node.js","MongoDB"]

Text:
${text}
`;

  const result =
    await model.generateContent(prompt);

  const response =
    result.response.text();

  try {
    return JSON.parse(
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    );
  } catch (error) {
    console.error(
      "Skill Parse Error:",
      error
    );

    return [];
  }
};

const generateSuggestions = async (
  resumeText,
  jobDescription,
  missingSkills
) => {
  const prompt = `
You are an ATS and Resume Expert.

Resume:
${resumeText}

Job Description:
${jobDescription}

Missing Skills:
${missingSkills.join(", ")}

Provide the response exactly in this format:

ATS Score Explanation:
1. ...

Missing Skills Recommendations:
1. ...

Resume Improvement Suggestions:
1. ...

Interview Preparation Advice:
1. ...

Rules:
- No markdown
- No ** symbols
- No bullet points
- Use only numbered lists
- Keep the response under 200 words
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

const generateJobDescription =
  async (jobTitle) => {

    const prompt = `
Generate a realistic job description
for a ${jobTitle}.

Return:
- Role Summary
- Required Skills
- Technologies
- Responsibilities

Keep under 300 words.
`;

    const result =
      await model.generateContent(
        prompt
      );

    return result.response.text();
};

module.exports = {
  generateSuggestions,
  generateJobDescription,
  extractSkillsWithAI
};
