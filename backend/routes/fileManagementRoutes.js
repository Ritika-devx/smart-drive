const express = require("express");
const router = express.Router();
const prisma = require("../utils/prismaClient");
const fs = require("fs");
const path = require("path");
const logActivity = require("../services/logService");
const authMiddleware = require("../middleware/authMiddleware");

// PATCH /api/archive/:id
// Archives a file (hides it from the main list without touching disk).
router.patch("/archive/:id", authMiddleware, async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const file = await prisma.files.findUnique({
      where: { id: id }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    if (file.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "File is in trash — restore it before archiving"
      });
    }

    await prisma.files.update({
      where: { id: id },
      data: {
        is_archived: true,
        archived_at: new Date()
      }
    });

    await logActivity("ARCHIVE", file.original_name);

    res.status(200).json({
      success: true,
      message: "File archived"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// PUT /api/unarchive/:id
// Brings a file back out of the archive into the main list.
router.put("/unarchive/:id", authMiddleware, async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const file = await prisma.files.findUnique({
      where: { id: id }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    await prisma.files.update({
      where: { id: id },
      data: {
        is_archived: false,
        archived_at: null
      }
    });

    await logActivity("UNARCHIVE", file.original_name);

    res.status(200).json({
      success: true,
      message: "File unarchived"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// GET /api/archived
// Lists all currently archived files.
router.get("/archived", authMiddleware, async (req, res) => {

  try {

    const files = await prisma.files.findMany({
      where: {
        is_archived: true,
        is_deleted: { not: true }
      },
      orderBy: {
        archived_at: "desc"
      }
    });

    const formattedFiles = files.map((file) => ({
      ...file,
      size: Number(file.size || 0)
    }));

    res.status(200).json({
      success: true,
      message: "Archived files fetched successfully",
      files: formattedFiles
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});
// Moves a file to trash (soft delete). The physical file and DB row
// stay in place until it's either restored or permanently deleted
// from the trash.
router.delete("/delete/:id", authMiddleware, async (req, res) => {

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

    if (file.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "File is already in trash"
      });
    }

    // soft delete: just flag it, don't touch disk or the row
    await prisma.files.update({
      where: {
        id: id
      },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    });

    await logActivity("TRASH", file.original_name);

    res.status(200).json({
      success: true,
      message: "File moved to trash"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// GET /api/trash
// Lists all files currently sitting in trash.
router.get("/trash", authMiddleware, async (req, res) => {

  try {

    const files = await prisma.files.findMany({
      where: {
        is_deleted: true
      },
      orderBy: {
        deleted_at: "desc"
      }
    });

    const formattedFiles = files.map((file) => ({
      ...file,
      size: Number(file.size || 0)
    }));

    res.status(200).json({
      success: true,
      message: "Trash fetched successfully",
      files: formattedFiles
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// PUT /api/restore/:id
// Restores a file out of trash back into the main file list.
router.put("/restore/:id", authMiddleware, async (req, res) => {

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

    if (!file.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "File is not in trash"
      });
    }

    await prisma.files.update({
      where: {
        id: id
      },
      data: {
        is_deleted: false,
        deleted_at: null
      }
    });

    await logActivity("RESTORE", file.original_name);

    res.status(200).json({
      success: true,
      message: "File restored successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// DELETE /api/trash/:id
// Permanently deletes a file that is already in trash — removes the
// physical file from disk and the database row. Cannot be undone.
router.delete("/trash/:id", authMiddleware, async (req, res) => {

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

    if (!file.is_deleted) {
      return res.status(400).json({
        success: false,
        message: "File must be in trash before it can be permanently deleted"
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      file.filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.files.delete({
      where: {
        id: id
      }
    });

    await logActivity("DELETE", file.original_name);

    res.status(200).json({
      success: true,
      message: "File permanently deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// DELETE /api/trash
// Empties the entire trash in one go — permanently deletes every
// file currently flagged is_deleted.
router.delete("/trash", authMiddleware, async (req, res) => {

  try {

    const trashedFiles = await prisma.files.findMany({
      where: {
        is_deleted: true
      }
    });

    for (const file of trashedFiles) {
      const filePath = path.join(
        __dirname,
        "../uploads",
        file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.files.deleteMany({
      where: {
        is_deleted: true
      }
    });

    await logActivity("DELETE", `${trashedFiles.length} file(s) from trash`);

    res.status(200).json({
      success: true,
      message: "Trash emptied successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});



// GET /api/download/:id
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
  return res.status(400).json({
    success: false,
    message: "Invalid file ID"
  });
}

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