const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const { classifyFileType, calculateDuplicateWaste } = require("../services/hashService");

/**
 * GET /api/analysis
 * Overall analysis: total files, total size, category breakdown,
 * duplicate count and wasted storage in one combined payload.
 */
router.get("/analysis", async (req, res) => {
  try {
    const files = await prisma.files.findMany();

    const totalFiles = files.length;
    const totalSize = files.reduce((sum, f) => sum + Number(f.size || 0), 0);

    const categoryBreakdown = {};
    files.forEach((file) => {
      const category = classifyFileType(file.type, file.original_name || file.filename || "");
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    const { totalDuplicateFiles, wastedBytes } = await calculateDuplicateWaste();

    res.status(200).json({
      success: true,
      message: "Analysis fetched successfully",
      data: {
        totalFiles,
        totalSize,
        categoryBreakdown,
        duplicateFiles: totalDuplicateFiles,
        wastedStorageBytes: wastedBytes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while generating analysis",
      error: error.message,
    });
  }
});

/**
 * GET /api/duplicates
 * Returns groups of duplicate files (same hash, more than one record).
 */
router.get("/duplicates", async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      where: { hash: { not: null } },
      orderBy: { uploaded_at: "asc" },
    });

    const groups = {};
    files.forEach((file) => {
      if (!groups[file.hash]) groups[file.hash] = [];
      groups[file.hash].push(file);
    });

    const duplicateGroups = Object.entries(groups)
      .filter(([, group]) => group.length > 1)
      .map(([hash, group]) => ({
        hash,
        count: group.length,
        files: group.map((f) => ({
          id: f.id,
          filename: f.filename,
          original_name: f.original_name,
          size: Number(f.size || 0),
          uploaded_at: f.uploaded_at,
        })),
      }));

    res.status(200).json({
      success: true,
      message: "Duplicate files fetched successfully",
      totalDuplicateGroups: duplicateGroups.length,
      duplicates: duplicateGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching duplicates",
      error: error.message,
    });
  }
});

/**
 * GET /api/storage-stats
 * Total storage used, duplicate waste, and category-wise size breakdown.
 */
router.get("/storage-stats", async (req, res) => {
  try {
    const files = await prisma.files.findMany();

    const totalSize = files.reduce((sum, f) => sum + Number(f.size || 0), 0);

    const categorySize = {};
    files.forEach((file) => {
      const category = classifyFileType(file.type, file.original_name || file.filename || "");
      categorySize[category] = (categorySize[category] || 0) + Number(file.size || 0);
    });

    const { totalDuplicateFiles, wastedBytes } = await calculateDuplicateWaste();

    res.status(200).json({
      success: true,
      message: "Storage statistics fetched successfully",
      data: {
        totalFiles: files.length,
        totalSizeBytes: totalSize,
        categorySizeBytes: categorySize,
        duplicateFiles: totalDuplicateFiles,
        wastedStorageBytes: wastedBytes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching storage statistics",
      error: error.message,
    });
  }
});

/**
 * GET /api/file-summary
 * Count of files per category (Image, Video, PDF, Document, Other).
 */
router.get("/file-summary", async (req, res) => {
  try {
    const files = await prisma.files.findMany();

    const summary = {
      Image: 0,
      Video: 0,
      PDF: 0,
      Document: 0,
      Other: 0,
    };

    files.forEach((file) => {
      const category = classifyFileType(file.type, file.original_name || file.filename || "");
      summary[category] = (summary[category] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      message: "File summary fetched successfully",
      totalFiles: files.length,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching file summary",
      error: error.message,
    });
  }
});

/**
 * GET /api/recent-files
 * Most recently uploaded files, newest first.
 * Optional query param: ?limit=10 (default 10)
 */
router.get("/recent-files", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentFiles = await prisma.files.findMany({
      orderBy: { uploaded_at: "desc" },
      take: limit,
    });

    const formatted = recentFiles.map((f) => ({
  id: f.id,
  filename: f.filename,
  original_name: f.original_name,
  size: Number(f.size || 0),
  type: f.type,
  category: classifyFileType(f.type, f.original_name || f.filename || ""),
  uploaded_at: f.uploaded_at,
}));

    res.status(200).json({
      success: true,
      message: "Recent files fetched successfully",
      totalFiles: formatted.length,
      files: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching recent files",
      error: error.message,
    });
  }
});

module.exports = router;