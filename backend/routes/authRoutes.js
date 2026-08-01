const express = require("express");
const router = express.Router();

const {
  register,
  login,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Change Password (requires valid JWT)
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;