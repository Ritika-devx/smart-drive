
const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const fs = require("fs");
const path = require("path");
const logActivity = require("../services/logService");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// New Cloudinary uploads use the smart-drive folder.
// Older files remain in the local uploads folder.
const isCloudinaryFile = (file) =>
  typeof file.filename === "string" &&
  file.filename.startsWith("smart-drive/");

const deleteStoredFile = async (file) => {
  if (isCloudinaryFile(file)) {
    const result = await cloudinary.uploader.destroy(file.filename, {
      resource_type: "raw",
      type: "authenticated",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return;
  }

  const filePath = path.join(__dirname, "../uploads", file.filename);

  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
};

// PATCH /api/archive/:id
router.patch("/archive/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid file ID" });

    const file = await prisma.files.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ success: false, message: "File not found" });
    if (file.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "File is in trash — restore it before archiving",
      });
    }

    await prisma.files.update({
      where: { id },
      data: { is_archived: true, archived_at: new Date() },
    });

    await logActivity("ARCHIVE", file.original_name);
    return res.status(200).json({ success: true, message: "File archived" });
  } catch (error) {
    console.error("Archive error:", error);
    return res.status(500).json({ success: false, message: "Failed to archive file" });
  }
});

// PUT /api/unarchive/:id
router.put("/unarchive/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid file ID" });

    const file = await prisma.files.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    await prisma.files.update({
      where: { id },
      data: { is_archived: false, archived_at: null },
    });

    await logActivity("UNARCHIVE", file.original_name);
    return res.status(200).json({ success: true, message: "File unarchived" });
  } catch (error) {
    console.error("Unarchive error:", error);
    return res.status(500).json({ success: false, message: "Failed to unarchive file" });
  }
});

// GET /api/archived
router.get("/archived", authMiddleware, async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      where: {
        userId: req.user.id,
        is_archived: true,
        is_deleted: { not: true },
      },
      orderBy: { archived_at: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Archived files fetched successfully",
      files: files.map((file) => ({
        ...file,
        size: Number(file.size || 0),
      })),
    });
  } catch (error) {
    console.error("Fetch archived files error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch archived files" });
  }
});

// DELETE /api/delete/:id — soft delete
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid file ID" });

    const file = await prisma.files.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ success: false, message: "File not found" });
    if (file.is_deleted) {
      return res.status(400).json({ success: false, message: "File is already in trash" });
    }

    await prisma.files.update({
      where: { id },
      data: { is_deleted: true, deleted_at: new Date() },
    });

    await logActivity("TRASH", file.original_name);
    return res.status(200).json({ success: true, message: "File moved to trash" });
  } catch (error) {
    console.error("Move to trash error:", error);
    return res.status(500).json({ success: false, message: "Failed to move file to trash" });
  }
});

// GET /api/trash
router.get("/trash", authMiddleware, async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      where: { userId: req.user.id, is_deleted: true },
      orderBy: { deleted_at: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Trash fetched successfully",
      files: files.map((file) => ({
        ...file,
        size: Number(file.size || 0),
      })),
    });
  } catch (error) {
    console.error("Fetch trash error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch trash" });
  }
});

// PUT /api/restore/:id
router.put("/restore/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid file ID" });

    const file = await prisma.files.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ success: false, message: "File not found" });
    if (!file.is_deleted) {
      return res.status(400).json({ success: false, message: "File is not in trash" });
    }

    await prisma.files.update({
      where: { id },
      data: { is_deleted: false, deleted_at: null },
    });

    await logActivity("RESTORE", file.original_name);
    return res.status(200).json({ success: true, message: "File restored successfully" });
  } catch (error) {
    console.error("Restore error:", error);
    return res.status(500).json({ success: false, message: "Failed to restore file" });
  }
});

// DELETE /api/trash/:id — permanently delete one trashed file
router.delete("/trash/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid file ID" });

    const file = await prisma.files.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ success: false, message: "File not found" });
    if (!file.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "File must be in trash before it can be permanently deleted",
      });
    }

    await deleteStoredFile(file);

    await prisma.files.delete({ where: { id } });
    await logActivity("DELETE", file.original_name);

    return res.status(200).json({ success: true, message: "File permanently deleted" });
  } catch (error) {
    console.error("Permanent delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to permanently delete file",
    });
  }
});

// DELETE /api/trash — empty trash
router.delete("/trash", authMiddleware, async (req, res) => {
  try {
    const trashedFiles = await prisma.files.findMany({
      where: { userId: req.user.id, is_deleted: true },
    });

    const deletedIds = [];
    const failedIds = [];

    for (const file of trashedFiles) {
      try {
        await deleteStoredFile(file);
        deletedIds.push(file.id);
      } catch (error) {
        console.error(`Could not delete file ${file.id}:`, error.message);
        failedIds.push(file.id);
      }
    }

    if (deletedIds.length > 0) {
      await prisma.files.deleteMany({
        where: { id: { in: deletedIds }, userId: req.user.id },
      });
    }

    if (deletedIds.length > 0) {
      await logActivity("DELETE", `${deletedIds.length} file(s) from trash`);
    }

    return res.status(failedIds.length ? 207 : 200).json({
      success: failedIds.length === 0,
      message: failedIds.length
        ? "Some files could not be deleted. Remaining records were preserved."
        : "Trash emptied successfully",
      deletedCount: deletedIds.length,
      failedCount: failedIds.length,
    });
  } catch (error) {
    console.error("Empty trash error:", error);
    return res.status(500).json({ success: false, message: "Failed to empty trash" });
  }
});

// GET /api/download/:id
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid file ID" });

    const file = await prisma.files.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    await logActivity("DOWNLOAD", file.original_name);

    await prisma.files.update({
      where: { id },
      data: { last_accessed: new Date() },
    });

    // Cloudinary authenticated raw asset.
    if (isCloudinaryFile(file)) {
      const extension = path.extname(file.original_name).replace(/^\./, "");

      const downloadUrl = cloudinary.utils.private_download_url(
        file.filename,
        extension,
        {
          resource_type: "raw",
          type: "authenticated",
          attachment: file.original_name,
        }
      );

      return res.redirect(downloadUrl);
    }

    // Backwards compatibility for files uploaded before cloud migration.
    const filePath = path.join(__dirname, "../uploads", file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found in cloud storage or local disk",
      });
    }

    return res.download(filePath, file.original_name);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ success: false, message: "Failed to download file" });
  }
});

// GET /api/activity
router.get("/activity", authMiddleware, async (req, res) => {
  try {
    const ACTION_MAP = {
      UPLOAD: "upload",
      DELETE: "delete",
      DOWNLOAD: "upload",
      ARCHIVE: "archive",
      UNARCHIVE: "archive",
      RESTORE: "archive",
      TRASH: "delete",
    };

    const ACTION_LABEL = {
      UPLOAD: "Uploaded",
      DELETE: "Deleted",
      DOWNLOAD: "Downloaded",
      ARCHIVE: "Archived",
      UNARCHIVE: "Unarchived",
      RESTORE: "Restored",
      TRASH: "Trashed",
    };

    const logs = await prisma.activity_logs.findMany({
      orderBy: { created_at: "desc" },
      take: 50,
    });

    const activity = logs.map((log) => ({
      id: log.id,
      type: ACTION_MAP[log.action] || "flag",
      message: `${ACTION_LABEL[log.action] || log.action} "${log.file_name || "a file"}"`,
      timestamp: log.created_at,
    }));

    return res.status(200).json({ success: true, activity });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch activity" });
  }
});

module.exports = router;
