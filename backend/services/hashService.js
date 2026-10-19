
const crypto = require("crypto");
const prisma = require("../utils/prismaClient");

const generateFileHash = (fileBuffer) => {
  return crypto
    .createHash("sha256")
    .update(fileBuffer)
    .digest("hex");
};

const findDuplicateByHash = async (hash, userId) => {
  if (!hash) return null;

  return prisma.files.findFirst({
    where: {
      hash,
      is_deleted: { not: true },
      ...(userId ? { userId } : {}),
    },
  });
};

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

const calculateDuplicateWaste = async (userId) => {
  const files = await prisma.files.findMany({
    where: {
      hash: { not: null },
      is_deleted: { not: true },
      ...(userId ? { userId } : {}),
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
