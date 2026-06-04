const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateResume = async (resumeData) => {
  const prompt = `
Create a professional ATS-friendly resume for the following candidate.

Candidate Information:

Name: ${resumeData.name}
Email: ${resumeData.email}
Phone: ${resumeData.phone}

Target Role:
${resumeData.role}

Experience:
${resumeData.experience}

Skills:
${resumeData.skills}

Projects:
${resumeData.projects}

Education:
${resumeData.education}

Certifications:
${resumeData.certifications || "Not Provided"}

IMPORTANT RULES:

1. Do NOT use markdown.
2. Do NOT use ** symbols.
3. Do NOT use * bullet symbols.
4. Do NOT include References section.
5. Do NOT include Certifications section if none are provided.
6. Make the resume ATS friendly.
7. Keep the Professional Summary under 4 lines.
8. Categorize skills into Frontend, Backend, Database and Tools if applicable.
9. Every project must have:
   - Project Name
   - Description
   - Technologies Used
10. Use clean spacing between sections.
11. Return only resume content.

Use EXACTLY this format:

NAME

CONTACT INFORMATION
Email:
Phone:

--------------------------------------------------

PROFESSIONAL SUMMARY

(Professional summary here)

--------------------------------------------------

TECHNICAL SKILLS

Frontend:
- skill
- skill

Backend:
- skill
- skill

Database:
- skill
- skill

Tools:
- skill
- skill

--------------------------------------------------

PROJECTS

Project Name

Technologies Used:
...

Description:
...

Project Name

Technologies Used:
...

Description:
...

--------------------------------------------------

WORK EXPERIENCE

(Generate based on experience provided)

--------------------------------------------------

EDUCATION

(Education details)

--------------------------------------------------

CERTIFICATIONS

(Certifications only if provided)

Generate a complete professional resume.
`;

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

  return completion.choices[0].message.content;
};

const generateJobRoles =
async (resumeText) => {

  const prompt = `
Analyze the resume below.

Suggest exactly 10 suitable job roles.

Return only job titles.

Resume:

${resumeText}
`;

  const completion =
    await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model:
        "llama-3.3-70b-versatile"
    });

  return completion
    .choices[0]
    .message
    .content;
};

module.exports = {
  generateResume,
  generateJobRoles
};