const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  runAnalysis,
  getAnalyses
} = require("../controllers/analysisController");

router.post(
  "/run",
  protect,
  runAnalysis
);
router.get(
  "/",
  protect,
  getAnalyses
);

module.exports = router;