const skillDatabase = [

  // Frontend
  "react",
  "next.js",
  "vue",
  "angular",
  "javascript",
  "typescript",
  "html",
  "css",
  "sass",
  "bootstrap",
  "tailwind",

  // Backend
  "node.js",
  "express",
  "nestjs",
  "spring",
  "spring boot",
  "django",
  "flask",
  "laravel",
  "php",
  "java",
  "c#",
  ".net",

  // Databases
  "mongodb",
  "postgresql",
  "mysql",
  "sqlite",
  "oracle",
  "sql server",
  "redis",
  "firebase",

  // DevOps
  "docker",
  "kubernetes",
  "jenkins",
  "github actions",
  "gitlab ci",
  "terraform",
  "ansible",

  // Cloud
  "aws",
  "azure",
  "gcp",
  "ec2",
  "s3",
  "lambda",
  "cloudformation",

  // AI / ML
  "python",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "tensorflow",
  "pytorch",
  "keras",
  "opencv",
  "nlp",
  "llm",
  "generative ai",
  "langchain",
  "rag",

  // Data Science
  "pandas",
  "numpy",
  "scikit-learn",
  "power bi",
  "tableau",
  "data analysis",
  "data visualization",
  "statistics",

  // Cybersecurity
  "penetration testing",
  "ethical hacking",
  "kali linux",
  "burp suite",
  "wireshark",
  "owasp",
  "siem",

  // Mobile
  "flutter",
  "react native",
  "android",
  "ios",
  "swift",
  "kotlin",

  // Testing
  "jest",
  "cypress",
  "selenium",
  "playwright",
  "manual testing",
  "automation testing",

  // Tools
  "git",
  "github",
  "bitbucket",
  "jira",
  "postman",
  "swagger",

  // Architecture
  "microservices",
  "rest api",
  "graphql",
  "jwt",
  "oauth",

  // UI/UX
  "figma",
  "adobe xd",
  "wireframing",
  "prototyping",
  "user research",

  // Business Analyst
  "requirement gathering",
  "stakeholder management",
  "gap analysis",
  "business process modeling",

  // Project Management
  "agile",
  "scrum",
  "kanban",
  "project planning",
  "risk management",

  // HR
  "recruitment",
  "talent acquisition",
  "employee relations",
  "payroll",

  // Finance
  "accounting",
  "financial analysis",
  "bookkeeping",
  "taxation",
  "excel",

  // Marketing
  "seo",
  "sem",
  "google analytics",
  "content marketing",
  "social media marketing",

  // Sales
  "lead generation",
  "crm",
  "salesforce",
  "customer relationship management",

  // Healthcare
  "medical coding",
  "ehr",
  "patient care",
  "clinical research"
];

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();

  return skillDatabase.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );
};

module.exports = {
  extractSkills
};