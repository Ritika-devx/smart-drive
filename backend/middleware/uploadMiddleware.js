const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload folder path
const uploadPath = path.join(__dirname, "../uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|pdf|doc|docx|zip/;

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedMimeTypes.includes(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, PDF, DOC, DOCX, and ZIP files are allowed."
      ),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});

module.exports = upload;