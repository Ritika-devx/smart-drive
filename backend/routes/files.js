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
const crypto = require("crypto");
const db = require("../db.js");

router.get("/files",(req,res)=>{
    const query="Select id ,filename,original_name,size,type,uploaded_at from files";
    db.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({
                success:false,
                message:"Database error while fetching files",
                error:err.message,
            });
        }
        res.status(200).json({
            success:true,
            message:"Files fetched successfully",
            files:results,
        });
    })
})

router.post("/upload", upload.array("file", 5), (req, res) => {
  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileDetails = [];

    req.files.forEach((file) => {

      const fileBuffer = fs.readFileSync(file.path);

      const hash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      const query = `
        INSERT INTO files (filename, original_name, size, type, hash)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [
          file.filename,
          file.originalname,
          file.size,
          file.mimetype,
          hash,
        ],
        (err) => {
          if (err) {
            console.error("Database insert error:", err);
          }
        }
      );

      fileDetails.push({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        hash: hash,
      });

    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      totalFiles: fileDetails.length,
      files: fileDetails,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while uploading file",
      error: error.message,
    });
  }
});

module.exports = router;