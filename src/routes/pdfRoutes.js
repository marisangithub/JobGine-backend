const express = require("express");

const router = express.Router();

const protect =
  require("../middlewares/authMiddleware");

const {
  downloadResume
} = require(
  "../controllers/pdfController"
);

router.post(
  "/resume",
  protect,
  downloadResume
);

module.exports = router;