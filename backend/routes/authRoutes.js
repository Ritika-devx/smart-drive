const express = require("express");

const router = express.Router();

const {
  register,
  login,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================
// PUBLIC ROUTES
// =====================

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

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