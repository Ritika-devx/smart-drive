const express = require("express");

const router = express.Router();

const {
  register,
  login,
  changePassword,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================
// PUBLIC ROUTES
// =====================

router.post("/register", register);

router.post("/login", login);

// =====================
// PROTECTED ROUTES
// =====================

router.post(
  "/change-password",
  authMiddleware,
  changePassword
);

router.put(
  "/update-profile",
  authMiddleware,
  updateProfile
);

module.exports = router;