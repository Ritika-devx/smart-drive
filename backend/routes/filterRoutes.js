const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");

router.get("/filter", async (req, res) => {
  try {
    const { category } = req.query;

    const files = await prisma.files.findMany({
      where: {
        category: category,
      },
    });

    res.status(200).json({
      success: true,
      files,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;