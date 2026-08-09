const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const fs = require("fs");
const prisma = require("../utils/prismaClient");
const logActivity = require("../services/logService");

const {
  generateFileHash,
  findDuplicateByHash,
} = require("../services/hashService");

// ===============================
// GET ALL FILES OF LOGGED-IN USER
// ===============================
router.get("/files", authMiddleware, async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        upload_date: "desc",
      },
    });

    const formattedFiles = files.map((file) => ({
      ...file,
      size: Number(file.size || 0),
    }));

    res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files: formattedFiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database error while fetching files",
      error: error.message,
    });
  }
});

// ===============================
// UPLOAD FILES
// ===============================
router.post(
  "/upload",
  authMiddleware,
  upload.array("file", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const fileDetails = [];

      for (const file of req.files) {
        const filePath = file.path;

        if (!fs.existsSync(filePath)) {
          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            status: "error",
            message: "File not found on server",
          });

          continue;
        }

        try {
          const hash = generateFileHash(filePath);

          const duplicate = await findDuplicateByHash(hash);

          // Save in database
          await prisma.files.create({
            data: {
              filename: file.filename,
              original_name: file.originalname,
              size: BigInt(file.size),
              type: file.mimetype,
              hash: hash,
              duplicate_flag: duplicate ? true : false,

              // Logged-in user
              userId: req.user.id,
            },
          });

          await logActivity("UPLOAD", file.originalname);

          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            status: duplicate ? "duplicate" : "uploaded",
            message: duplicate
              ? `Duplicate of file ID ${duplicate.id}`
              : "Uploaded successfully",
          });
        } catch (innerError) {
          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            status: "error",
            message: "Database insert failed",
            error: innerError.message,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: "Files processed successfully",
        totalFiles: fileDetails.length,
        files: fileDetails,
      });
    } catch (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 5MB limit",
        });
      }

      if (
        error.message &&
        error.message.includes("Only images")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid file type (Only JPG, PNG, PDF, DOC and DOCX allowed)",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while uploading file",
        error: error.message,
      });
    }
  }
);

module.exports = router;