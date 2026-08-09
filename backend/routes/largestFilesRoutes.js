const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
// GET /api/largest-files
router.get("/largest-files", authMiddleware, async (req, res) => {
  try {

    const largestFiles = await prisma.files.findMany({
      where: {
        is_deleted: { not: true },
        is_archived: { not: true }
      },
      orderBy: {
        size: "desc"
      },
      take: 5
    });

    const formattedFiles = largestFiles.map(file => ({
      id: file.id,
      filename: file.filename,
      original_name: file.original_name,
      size: Number(file.size || 0),
      type: file.type,
      uploaded_at: file.upload_date
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