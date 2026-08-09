const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const { calculateDuplicateWaste } = require("../services/hashService");

const OLD_FILE_DAYS = 180;
const LARGE_FILE_BYTES = 50 * 1024 * 1024;

function categorizeType(mime) {
  if (!mime) return "file";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return "doc";
  if (
    mime === "application/zip" ||
    mime === "application/x-rar-compressed" ||
    mime === "application/x-7z-compressed" ||
    mime === "application/x-tar" ||
    mime === "application/gzip"
  ) return "archive";
  return "file";
}

const ACTION_MAP = {
  UPLOAD: "upload",
  DELETE: "delete",
  DOWNLOAD: "upload",
  ARCHIVE: "archive",
};

const ACTION_LABEL = {
  UPLOAD: "Uploaded",
  DELETE: "Deleted",
  DOWNLOAD: "Downloaded",
  ARCHIVE: "Archived",
};

// GET /api/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      where: {
        is_deleted: { not: true },
        is_archived: { not: true },
      },
      select: {
        id: true,
        original_name: true,
        type: true,
        size: true,
        upload_date: true,
      },
      orderBy: { upload_date: "desc" },
    });

    const totalFiles = files.length;
    const totalStorage = files.reduce(
      (sum, f) => sum + Number(f.size || 0),
      0
    );

    const now = Date.now();
    let oldUnusedFiles = 0;
    let oldBytes = 0;
    let largeFiles = 0;
    let largeBytes = 0;
    let normalBytes = 0;

    files.forEach((f) => {
      const size = Number(f.size || 0);
      const ageDays = f.upload_date
        ? (now - new Date(f.upload_date).getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      const isOld = ageDays > OLD_FILE_DAYS;
      const isLarge = size > LARGE_FILE_BYTES;

      if (isOld) {
        oldUnusedFiles += 1;
        oldBytes += size;
      }
      if (isLarge) {
        largeFiles += 1;
        largeBytes += size;
      }
      if (!isOld && !isLarge) {
        normalBytes += size;
      }
    });

    const { totalDuplicateFiles, wastedBytes } =
      await calculateDuplicateWaste();

    const recentUploads = files.slice(0, 8).map((f) => ({
      id: f.id,
      name: f.original_name || "Untitled",
      type: categorizeType(f.type),
      size: Number(f.size || 0),
      uploadedAt: f.upload_date,
    }));

    const recentLogs = await prisma.activity_logs.findMany({
      orderBy: { created_at: "desc" },
      take: 10,
    });

    const activity = recentLogs.map((log) => ({
      id: log.id,
      type: ACTION_MAP[log.action] || "flag",
      message: `${ACTION_LABEL[log.action] || log.action} "${
        log.file_name || "a file"
      }"`,
      timestamp: log.created_at,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalFiles,
        totalStorage,
        duplicateFiles: totalDuplicateFiles,
        oldUnusedFiles,
        largeFiles,
        wastedStorage: wastedBytes,
      },
      breakdown: {
        normal: normalBytes,
        duplicate: wastedBytes,
        old: oldBytes,
        large: largeBytes,
      },
      recentUploads,
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;