const express = require("express");
const router = express.Router();

const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
const { getSuggestions } = require("../services/optimizationService");
const { classifyFileType } = require("../services/hashService");

router.get("/search", authMiddleware, async (req, res) => {
  try {

    const { name = "", category = "" } = req.query;

    // console.log("Request:", { name, category });

    // Fetch this user's files only (excluding trashed/archived)
    let files = await prisma.files.findMany({
      where: {
        userId: req.user.id,
        is_deleted: { not: true },
        is_archived: { not: true },
      },
    });

    // console.log("Before filtering:", files.length);

    // ==========================
    // Search Filter
    // ==========================
    if (name.trim() !== "") {

      files = files.filter(file =>
        (file.original_name || "")
          .toLowerCase()
          .includes(name.toLowerCase())
      );

    }

    // console.log("After search:", files.length);

    // ==========================
    // Category Filter
    // ==========================
    if (category.trim() !== "") {

      files = files.filter(file => {

        const fileCategory = classifyFileType(
          file.type,
          file.original_name || file.filename || ""
        );

        console.log(
          `${file.original_name} -> ${fileCategory}`
        );

        return fileCategory.toLowerCase() === category.toLowerCase();

      });

    }

    // console.log("After category:", files.length);

    // ==========================
    // Convert for Frontend
    // ==========================
    const result = files.map(file => ({
      id: file.id,
      filename: file.original_name,
      suggestions: getSuggestions(file),
    }));

    res.status(200).json({
      success: true,
      files: result,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;