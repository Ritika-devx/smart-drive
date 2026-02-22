const express=require('express');
const router=express.Router();
const upload=require('../controllers/fileController');
router.post('/upload',upload.single('file'),(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"No file uploaded",
            });
        }
        res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            fileDetails:{
                filename:req.file.filename,
                originalname:req.file.originalname,
                mimetype:req.file.mimetype,
                size:req.file.size,
            },
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