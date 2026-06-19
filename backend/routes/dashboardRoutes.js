const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");

// GET /api/dashboard
router.get("/dashboard", async (req, res) => {
  try {

    const totalFiles = await prisma.files.count();

    const totalStorage = await prisma.files.aggregate({
      _sum: {
        size: true
      }
    });

    const duplicateFiles = await prisma.files.count({
      where: {
        duplicate_flag: true
      }
    });

   res.status(200).json({
  success: true,
  totalFiles,
  totalStorage: Number(totalStorage._sum.size || 0),
  duplicateFiles
});

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;