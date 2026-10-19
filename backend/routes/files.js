
const express = require("express");
const router = express.Router();
const path = require("path");
const { randomUUID } = require("crypto");
const cloudinary = require("cloudinary").v2;

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const prisma = require("../utils/prismaClient");
const logActivity = require("../services/logService");

const {
  generateFileHash,
  findDuplicateByHash,
} = require("../services/hashService");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        type: "authenticated",
        folder: "smart-drive",
        public_id: publicId,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// GET ALL FILES OF LOGGED-IN USER
router.get("/files", authMiddleware, async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      where: {
        userId: req.user.id,
        is_deleted: { not: true },
        is_archived: { not: true },
      },
      orderBy: { upload_date: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files: files.map((file) => ({
        ...file,
        size: Number(file.size || 0),
      })),
    });
  } catch (error) {
    console.error("Fetch files error:", error);
    res.status(500).json({
      success: false,
      message: "Database error while fetching files",
    });
  }
});

// UPLOAD FILES
router.post(
  "/upload",
  authMiddleware,
  upload.array("file", 5),
  async (req, res) => {
    const uploadedAssets = [];

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const fileDetails = [];

      for (const file of req.files) {
        let cloudAsset = null;

        try {
          // Hash the in-memory buffer before uploading.
          const hash = generateFileHash(file.buffer);
          const duplicate = await findDuplicateByHash(
            hash,
            req.user.id
          );

          const extension = path.extname(file.originalname).toLowerCase();
          const safeName = path
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 80) || "file";

          // Unique ID avoids collisions between files with the same name.
          const publicId = `${randomUUID()}-${safeName}${extension}`;

          cloudAsset = await uploadToCloudinary(file.buffer, publicId);
          uploadedAssets.push(cloudAsset.public_id);

          const record = await prisma.files.create({
            data: {
              filename: cloudAsset.public_id,
              original_name: file.originalname,
              size: BigInt(file.size),
              type: file.mimetype,
              hash,
              duplicate_flag: Boolean(duplicate),
              userId: req.user.id,
            },
          });

          await logActivity("UPLOAD", file.originalname);

          fileDetails.push({
            id: record.id,
            filename: record.filename,
            originalname: file.originalname,
            status: duplicate ? "duplicate" : "uploaded",
            message: duplicate
              ? `Duplicate of file ID ${duplicate.id}`
              : "Uploaded successfully",
          });
        } catch (error) {
          // If DB insertion fails after upload, clean up the cloud asset.
          if (cloudAsset) {
            try {
              await cloudinary.uploader.destroy(cloudAsset.public_id, {
                resource_type: "raw",
                type: "authenticated",
              });
            } catch (cleanupError) {
              console.error("Cloudinary cleanup failed:", cleanupError);
            }
          }

          fileDetails.push({
            originalname: file.originalname,
            status: "error",
            message: "File processing failed",
            error: error.message,
          });
        }
      }

      const hasErrors = fileDetails.some((file) => file.status === "error");

      res.status(hasErrors ? 207 : 200).json({
        success: !hasErrors,
        message: "Files processed",
        totalFiles: fileDetails.length,
        files: fileDetails,
      });
    } catch (error) {
      console.error("Upload error:", error);

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 5MB limit",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while uploading files",
      });
    }
  }
);

module.exports = router;
