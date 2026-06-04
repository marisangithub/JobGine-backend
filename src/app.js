const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analysisRoutes = require( "./routes/analysisRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const resumeBuilderRoutes = require( "./routes/resumeBuilderRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const jobRoutes =
require("./routes/jobRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/analysis", analysisRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume-builder", resumeBuilderRoutes);

app.use(
  "/api/resumes",
  resumeRoutes
);

app.use((req, res, next) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "ResumeIQ API Running"
  });
});

module.exports = app;