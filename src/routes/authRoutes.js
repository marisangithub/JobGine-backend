const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authController =
  require("../controllers/authController");

const {
  register,
  login,
  getMe,
  verifyOTP
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post(
  "/verify-otp",
  authController.verifyOTP
);
router.get("/me", protect, getMe);

module.exports = router;