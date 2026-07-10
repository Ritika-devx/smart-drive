const express = require("express");
const router = express.Router();

const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const { classifyFileType } = require("../services/hashService");

router.get("/filter", authMiddleware, async (req, res) => {
  try {

    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const files = await prisma.files.findMany();

    const filteredFiles = files.filter((file) => {

      const fileCategory = classifyFileType(
        file.type,
        file.original_name || file.filename || ""
      );

      return (
        fileCategory.toLowerCase() === category.toLowerCase()
      );

    });

    res.status(200).json({
      success: true,
      totalFiles: filteredFiles.length,
      files: filteredFiles,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;