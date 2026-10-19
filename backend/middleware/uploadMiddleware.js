
const multer = require("multer");
const path = require("path");

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
  ".doc",
  ".docx",
  ".zip",
  ".ppt",
  ".pptx",
];

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedExtensions.includes(extension) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Allowed files: JPG, JPEG, PNG, PDF, DOC, DOCX, ZIP, PPT, PPTX."
    ),
    false
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = upload;
