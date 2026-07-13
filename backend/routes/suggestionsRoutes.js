const express = require("express");
const router = express.Router();

const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const { getSuggestions } = require("../services/optimizationService");

console.log("Suggestions route loaded");

router.get("/suggestions", authMiddleware, async (req, res) => {
  try {
    const files = await prisma.files.findMany();

    if (files.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const suggestions = files.map((file) => ({
      id: file.id,
      filename: file.original_name,
      suggestions: getSuggestions(file),
    }));

    res.status(200).json({
      success: true,
      data: suggestions,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;