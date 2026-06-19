// const express=require('express');
// const router=express.Router();
// const upload=require('../controllers/fileController');
// const fs = require("fs");
// const crypto = require("crypto");
// const db = require("../db.js");
// router.post('/upload',upload.array('file',5),(req,res)=>{
//     try{
//         if(!req.files||req.files.length===0){
//             return res.status(400).json({
//                 success:false,
//                 message:"No file uploaded",
//             });
//         }
//         const fileDetails = req.files.map(file => {

//     const fileBuffer = fs.readFileSync(file.path);

//     const hash = crypto
//         .createHash("sha256")
//         .update(fileBuffer)
//         .digest("hex");

//     const query = `
//         INSERT INTO files (filename, original_name, size, type, hash)
//         VALUES (?, ?, ?, ?, ?)
//     `;

//    db.query(
//   query,
//   [
//     file.filename,
//     file.originalname,
//     file.size,
//     file.mimetype,
//     hash
//   ],
//   (err) => {
//     if (err) {
//       console.error(err);
//     }
//   }
// );

//     return {
//         filename: file.filename,
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//         hash: hash
//     };

// });
//        res.status(200).json({
//     success: true,
//     message: "File uploaded successfully",
//     totalFiles: fileDetails.length,
//     files: fileDetails
// });
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"Server error while uploading file",
//             error:error.message,
//         });
//     }
// });
// module.exports=router;


// const express = require("express");
// const router = express.Router();
// const upload = require("../controllers/fileController");
// const fs = require("fs");
// const crypto = require("crypto");
// const db = require("../db.js");
// const logActivity = require("../services/logService");


// //  GET all files
// router.get("/files", (req, res) => {
//  const query = "SELECT id, filename, original_name, size, type, upload_date FROM files";
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: "Database error while fetching files",
//         error: err.message,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Files fetched successfully",
//       files: results,
//     });
//   });
// });


// //  POST upload with duplicate check + ERROR HANDLING (YOUR PART)
// router.post("/upload", upload.array("file", 5), (req, res) => {
//   try {

//     // ❌ No file uploaded
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     const fileDetails = [];
//     let processed = 0;

//     req.files.forEach((file) => {

//       const filePath = file.path;

//       // ❌ File not found
//       if (!fs.existsSync(filePath)) {
//         fileDetails.push({
//           filename: file.filename,
//           originalname: file.originalname,
//           status: "error",
//           message: "File not found on server",
//         });

//         processed++;

//         if (processed === req.files.length) {
//           return res.status(500).json({
//             success: false,
//             message: "File processing error",
//             files: fileDetails,
//           });
//         }

//         return;
//       }

//       const fileBuffer = fs.readFileSync(filePath);

//       const hash = crypto
//         .createHash("sha256")
//         .update(fileBuffer)
//         .digest("hex");

//       // Check duplicate
//       const checkQuery = "SELECT * FROM files WHERE hash = ?";

//       db.query(checkQuery, [hash], (err, results) => {

//         // ❌ DB error
//         if (err) {
//           return res.status(500).json({
//             success: false,
//             message: "Database error while processing file",
//             error: err.message,
//           });
//         }

//         // 🔁 Duplicate file
//         if (results.length > 0) {

//           fileDetails.push({
//             filename: file.filename,
//             originalname: file.originalname,
//             status: "duplicate",
//             message: "Duplicate file",
//           });

//           processed++;

//           if (processed === req.files.length) {
//             return res.status(200).json({
//               success: true,
//               message: "Files processed successfully",
//               totalFiles: fileDetails.length,
//               files: fileDetails,
//             });
//           }

//         } else {

//           // Insert new file
//           const insertQuery = `
//             INSERT INTO files (filename, original_name, size, type, hash)
//             VALUES (?, ?, ?, ?, ?)
//           `;

//           db.query(
//             insertQuery,
//             [
//               file.filename,
//               file.originalname,
//               file.size,
//               file.mimetype,
//               hash,
//             ],
//             (err) => {

//               if (err) {
//                 fileDetails.push({
//                   filename: file.filename,
//                   originalname: file.originalname,
//                   status: "error",
//                   message: "Database insert failed",
//                 });
//               } else {

//   logActivity("UPLOAD", file.originalname);

//   fileDetails.push({
//     filename: file.filename,
//     originalname: file.originalname,
//     status: "uploaded",
//     message: "Uploaded successfully",
//   });

// }
//  processed++;

//   if (processed === req.files.length) {
//    return res.status(200).json({
//     success: true,
//    message: "Files processed successfully",
//    totalFiles: fileDetails.length,
//     files: fileDetails,
//                 });
//               }

//             }
//           );
//         }

//       });

//     });

//   } catch (error) {

//     // ❌ File size error
//     if (error.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({
//         success: false,
//         message: "File size exceeds 5MB limit",
//       });
//     }

//     // ❌ File type error
//     if (error.message.includes("Only images")) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid file type (only jpg, png, pdf allowed)",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: "Server error while uploading file",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;




// const express=require('express');
// const router=express.Router();
// const upload=require('../controllers/fileController');
// const fs = require("fs");
// const crypto = require("crypto");
// const db = require("../db.js");
// router.post('/upload',upload.array('file',5),(req,res)=>{
//     try{
//         if(!req.files||req.files.length===0){
//             return res.status(400).json({
//                 success:false,
//                 message:"No file uploaded",
//             });
//         }
//         const fileDetails = req.files.map(file => {

//     const fileBuffer = fs.readFileSync(file.path);

//     const hash = crypto
//         .createHash("sha256")
//         .update(fileBuffer)
//         .digest("hex");

//     const query = `
//         INSERT INTO files (filename, original_name, size, type, hash)
//         VALUES (?, ?, ?, ?, ?)
//     `;

//    db.query(
//   query,
//   [
//     file.filename,
//     file.originalname,
//     file.size,
//     file.mimetype,
//     hash
//   ],
//   (err) => {
//     if (err) {
//       console.error(err);
//     }
//   }
// );

//     return {
//         filename: file.filename,
//         originalname: file.originalname,
//         mimetype: file.mimetype,
//         size: file.size,
//         hash: hash
//     };

// });
//        res.status(200).json({
//     success: true,
//     message: "File uploaded successfully",
//     totalFiles: fileDetails.length,
//     files: fileDetails
// });
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"Server error while uploading file",
//             error:error.message,
//         });
//     }
// });
// module.exports=router;

const express = require("express");
const router = express.Router();
const upload = require("../controllers/fileController");
const fs = require("fs");
const prisma = require("../utils/prismaClient");
const logActivity = require("../services/logService");
const {
  generateFileHash,
  findDuplicateByHash,
} = require("../services/hashService");

// ==========================
// GET ALL FILES
// ==========================
router.get("/files", async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      select: {
        id: true,
        filename: true,
        original_name: true,
        size: true,
        type: true,
        upload_date: true,
      },
    });

    // Convert BigInt to Number
    const formattedFiles = files.map((file) => ({
      id: file.id,
      filename: file.filename,
      original_name: file.original_name,
      size: Number(file.size || 0),
      type: file.type,
      upload_date: file.upload_date,
    }));

    res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files: formattedFiles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database error while fetching files",
      error: err.message,
    });
  }
});

// ==========================
// UPLOAD FILES
// ==========================
router.post("/upload", upload.array("file", 5), async (req, res) => {
  try {
    // No file uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileDetails = [];

    for (const file of req.files) {
      const filePath = file.path;

      // File missing
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
        // Generate SHA-256 hash
        const hash = generateFileHash(filePath);

        // Check duplicate
        const duplicate = await findDuplicateByHash(hash);

        if (duplicate) {
          await prisma.files.create({
            data: {
              filename: file.filename,
              original_name: file.originalname,
              size: BigInt(file.size),
              type: file.mimetype,
              hash: hash,
              duplicate_flag: true,
            },
          });

          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            status: "duplicate",
            message: `Duplicate of file ID ${duplicate.id}`,
          });
        } else {
          await prisma.files.create({
            data: {
              filename: file.filename,
              original_name: file.originalname,
              size: BigInt(file.size),
              type: file.mimetype,
              hash: hash,
              duplicate_flag: false,
            },
          });

          await logActivity("UPLOAD", file.originalname);

          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            status: "uploaded",
            message: "Uploaded successfully",
          });
        }
      } catch (innerErr) {
        fileDetails.push({
          filename: file.filename,
          originalname: file.originalname,
          status: "error",
          message: "Database insert failed",
          error: innerErr.message,
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
    // Multer file size error
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }

    // Invalid file type
    if (error.message && error.message.includes("Only images")) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type (Only JPG, PNG and PDF allowed)",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while uploading file",
      error: error.message,
    });
  }
});

module.exports = router;