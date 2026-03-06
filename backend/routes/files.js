const express=require('express');
const router=express.Router();
const upload=require('../controllers/fileController');
const fs = require("fs");
const crypto = require("crypto");
const db = require("../db.js");
router.post('/upload',upload.array('file',5),(req,res)=>{
    try{
        if(!req.files||req.files.length===0){
            return res.status(400).json({
                success:false,
                message:"No file uploaded",
            });
        }
        const fileDetails = req.files.map(file => {

    const fileBuffer = fs.readFileSync(file.path);

    const hash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

    const query = `
        INSERT INTO files (filename, original_name, size, type, hash)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [
        file.filename,
        file.originalname,
        file.size,
        file.mimetype,
        hash
    ]);

    return {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        hash: hash
    };

});
        res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            files:fileDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Server error while uploading file",
            error:error.message,
        });
    }
});
module.exports=router;