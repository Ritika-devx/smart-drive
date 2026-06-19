const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const fs = require("fs");
const path = require("path");
const logActivity = require("../services/logService");


// DELETE /api/delete/:id
router.delete("/delete/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    // find file
    const file = await prisma.files.findUnique({
      where: {
        id: id
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    // uploads path
    const filePath = path.join(
      __dirname,
      "../uploads",
      file.filename
    );

    // delete physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // delete database entry
    await prisma.files.delete({
      where: {
        id: id
      }
    });
    await logActivity("DELETE", file.original_name);

    res.status(200).json({
      success: true,
      message: "File deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});



// GET /api/download/:id
router.get("/download/:id", async (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const file = await prisma.files.findUnique({
      where: {
        id: id
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      file.filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Physical file not found"
      });
    }

    await logActivity("DOWNLOAD", file.original_name);

    res.download(filePath, file.original_name);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});
module.exports = router;