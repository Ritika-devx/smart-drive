const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getStorage, getStorageBreakdown } = require("../controllers/storageController");

// GET USER STORAGE
router.get("/", authMiddleware, getStorage);

// GET STORAGE BREAKDOWN BY FILE TYPE
router.get("/breakdown", authMiddleware, getStorageBreakdown);

module.exports = router;