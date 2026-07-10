const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.trim() === "") {
  return res.status(400).json({
    success: false,
    message: "Please provide a file name to search."
  });
}

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