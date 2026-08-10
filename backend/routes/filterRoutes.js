const express = require("express");
const router = express.Router();

const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const { classifyFileType, getSuggestions } = require("../services/hashService");
const { getSuggestions: optimizationSuggestions } = require("../services/optimizationService");

router.get("/filter", authMiddleware, async (req, res) => {
  try {

    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const files = await prisma.files.findMany({
      where: {
        userId: req.user.id,
        is_deleted: { not: true },
        is_archived: { not: true },
      },
    });

    const filteredFiles = files.filter((file) => {

      const fileCategory = classifyFileType(
        file.type,
        file.original_name || file.filename || ""
      );

      return fileCategory.toLowerCase() === category.toLowerCase();

    });

    const result = filteredFiles.map((file) => ({
      id: file.id,
      filename: file.original_name,
      suggestions: optimizationSuggestions(file),
    }));

    res.status(200).json({
      success: true,
      totalFiles: result.length,
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