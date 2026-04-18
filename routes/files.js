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


//  GET all files
router.get("/files", (req, res) => {
  const query = "SELECT id, filename, original_name, size, type, uploaded_at FROM files";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database error while fetching files",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files: results,
    });
  });
});


//  POST upload with duplicate check
router.post("/upload", upload.array("file", 5), (req, res) => {
  try {

    //  No file uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileDetails = [];
    let processed = 0;

    req.files.forEach((file) => {

      const fileBuffer = fs.readFileSync(file.path);

      const hash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      // Check duplicate
      const checkQuery = "SELECT * FROM files WHERE hash = ?";

      db.query(checkQuery, [hash], (err, results) => {

        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: "Database error",
          });
        }

        //  If duplicate
        if (results.length > 0) {

          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            message: "Duplicate file",
          });


        } else {

          // Insert new file
          const insertQuery = `
            INSERT INTO files (filename, original_name, size, type, hash)
            VALUES (?, ?, ?, ?, ?)
          `;

          db.query(
            insertQuery,
            [
              file.filename,
              file.originalname,
              file.size,
              file.mimetype,
              hash,
            ],
            (err) => {
              if (err) {
                console.error("Insert error:", err);
              }
            }
          );

          fileDetails.push({
            filename: file.filename,
            originalname: file.originalname,
            message: "Uploaded successfully",
          });
        }

        processed++;

        // Send response after all files processed
        if (processed === req.files.length) {
          return res.status(200).json({
            success: true,
            message: "Upload process completed",
            totalFiles: fileDetails.length,
            files: fileDetails,
          });
        }

      });

    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while uploading file",
      error: error.message,
    });
  }
});
router.get("/files/:id",(req,res)=>{
  const {id}=req.params;
  const query="SELECT * FROM files WHERE id=?";
  db.query(query,[id],(err,results)=>{
    if(err){
      return res.status(500).json({

        success:false,
        message:"Database error while fetching file",
        error:err.message,
      });
    }
    if(results.length==0){
      return res.status(404).json({
        sucess:false,
        message:"File not found",
      });
    }
    res.status(200).json({
      success:true,
      message:"File fetched successfully",
      file:results[0],
    });
  });
});

router.delete("/files/:id",(req,res)=>{
  const {id}=req.params;
  const query="SELECT *FROM files WHERE id=?";
  db.query(query,[id],(err,results)=>{
    if(err){
      return res.status(500).json({
        success:false,
        message:"Database error while deleting file",
        error:err.message,
      });
    }
    if(results.length==0){
      return res.status(404).json({
        success:false,
        message:"File not found",
      });
    }
    const file=results[0];
    const deleteQuery="DELETE FROM files WHERE id=?";
    db.query(deleteQuery,[id],(err)=>{
      if(err){
        return res.status(500).json({
          success:false,
          message:"Database error while deleting file",
          error:err.message,
        })
      }
      return res.status(200).json({
        success:true,
        message:"File deleted successfully",
        deletedFile: file.original_name,
      })
    })

      })
    
  });
module.exports = router;