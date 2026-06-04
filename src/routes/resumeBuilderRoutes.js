const express = require("express");

const router = express.Router();

const protect =
  require("../middlewares/authMiddleware");

const {
  createResume,
  getResumeHistory,
  deleteResume
} = require(
  "../controllers/resumeBuilderController"
);

router.post(
  "/generate",
  protect,
  createResume
);
router.get(
  "/history",
  protect,
  getResumeHistory
);

router.delete(
  "/:id",
  protect,
  deleteResume
);

module.exports = router;