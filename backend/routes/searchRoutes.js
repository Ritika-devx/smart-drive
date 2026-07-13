const express = require("express");
const router = express.Router();

const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const { getSuggestions } = require("../services/optimizationService");

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a file name to search.",
      });
    }

    const files = await prisma.files.findMany({
      where: {
        original_name: {
          contains: name,
        },
      },
    });

    const result = files.map((file) => ({
      id: file.id,
      filename: file.original_name,
      suggestions: getSuggestions(file),
    }));

    res.status(200).json({
      success: true,
      files: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;