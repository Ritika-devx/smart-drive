const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");

router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    const files = await prisma.files.findMany({
      where: {
        original_name: {
          contains: name,
        },
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