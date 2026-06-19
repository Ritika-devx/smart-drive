const fs = require("fs");
const crypto = require("crypto");
const prisma = require("../utils/prismaClient");

/**
 * Generate a SHA-256 hash for a file on disk.
 * @param {string} filePath - absolute path to the file
 * @returns {string} hex-encoded SHA-256 hash
 */
const generateFileHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

/**
 * Check if a given hash already exists in the files table.
 * @param {string} hash
 * @returns {Promise<object|null>} the existing matching file record, or null
 */
const findDuplicateByHash = async (hash) => {
  if (!hash) return null;

  const existing = await prisma.files.findFirst({
    where: { hash },
  });

  return existing;
};

/**
 * Classify a file into a category based on its mimetype/extension.
 * Categories: Image, Video, PDF, Document, Other
 * @param {string} mimetype
 * @param {string} originalname
 * @returns {string}
 */
const classifyFileType = (mimetype = "", originalname = "") => {
  const type = mimetype.toLowerCase();
  const ext = originalname.split(".").pop()?.toLowerCase() || "";

  if (type.startsWith("image/")) return "Image";
  if (type.startsWith("video/")) return "Video";
  if (type === "application/pdf" || ext === "pdf") return "PDF";

  const documentExts = ["doc", "docx", "txt", "rtf", "odt", "csv"];
  const documentTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/csv",
  ];

  if (documentTypes.includes(type) || documentExts.includes(ext)) {
    return "Document";
  }

  return "Other";
};

/**
 * Calculate how much storage is wasted by duplicate files.
 * For each hash group with more than 1 file, every file after the
 * first (oldest) one is considered "wasted" duplicate storage.
 * @returns {Promise<{ totalDuplicateFiles: number, wastedBytes: number }>}
 */
const calculateDuplicateWaste = async () => {
  const files = await prisma.files.findMany({
    where: {
      hash: { not: null },
    },
    orderBy: { upload_date: "asc" },
    select: { id: true, hash: true, size: true },
  });

  const seenHashes = new Set();
  let totalDuplicateFiles = 0;
  let wastedBytes = BigInt(0);

  for (const file of files) {
    if (seenHashes.has(file.hash)) {
      totalDuplicateFiles += 1;
      wastedBytes += BigInt(file.size || 0);
    } else {
      seenHashes.add(file.hash);
    }
  }

  return {
    totalDuplicateFiles,
    wastedBytes: Number(wastedBytes),
  };
};

module.exports = {
  generateFileHash,
  findDuplicateByHash,
  classifyFileType,
  calculateDuplicateWaste,
};