const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");

// GET /api/largest-files
router.get("/largest-files", async (req, res) => {
  try {

    const largestFiles = await prisma.files.findMany({
      orderBy: {
        size: "desc"
      },
      take: 5
    });

    const formattedFiles = largestFiles.map(file => ({
      id: file.id,
      filename: file.filename,
      original_name: file.original_name,
      size: Number(file.size),
      type: file.type,
      upload_date: file.upload_date
    }));

    res.status(200).json({
      success: true,
      files: formattedFiles
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;