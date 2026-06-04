const express = require("express");

const router = express.Router();

const protect = require(
  "../middlewares/authMiddleware"
);

const upload = require(
  "../config/multer"
);

const {
  uploadResume,
  getResumes,
  deleteResume
} = require(
  "../controllers/resumeController"
);


// Upload Resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// Get All User Resumes
router.get(
  "/",
  protect,
  getResumes
);
router.delete(
  "/:id",
  protect,
  deleteResume
);

module.exports = router;