const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const authController =
  require("../controllers/authController");

  const adminOnly = require(
  "../middlewares/adminMiddleware"
);

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
router.get("/users", protect,adminOnly, authController.getUsers);
router.put("/users/:id/role", protect, adminOnly, authController.updateRole);
router.delete("/users/:id", protect, adminOnly, authController.deleteUser);
router.get( "/admin-test", protect, adminOnly,
  (req, res) => {

    res.json({
      message: "Welcome Admin",
      user: req.user
    });

  }
);

module.exports = router;