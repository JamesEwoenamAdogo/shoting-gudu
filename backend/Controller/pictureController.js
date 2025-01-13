import { pictureModel } from "../Model/pictureUpload.js";
import fs from "fs"
import cloudinary from "../utils/cloudinaryConfig.js";


export const addPicture = async(req,res)=>{
    try{
        // const fileName = req.files.filename
        // console.log(req.file)
        let publicId
        await cloudinary.uploader.upload(req.file.path, (err, result)=>{
            if(err){
                console.log(err)
                return  res.status(500).json({sucess:false,message:"Error"})
                
            }
            res.json({success:true,message:"Picture uploaded",data: result})
           
            publicId = result.public_id
           

        });

        const optimizeUrl = cloudinary.url(publicId,{
            fetch_format: "auto",
            quality:"auto"
        })
        console.log(optimizeUrl)
        const newPicture =  new pictureModel({picture: optimizeUrl})
        newPicture.save()
        // return res.json({file:req.file.filename})
        



    }catch(error){
        console.log(error)
        return res.status(500).json({success: false})
    }

    
}

export const allPictures = async(req,res)=>{
    try{
        const allImages = await pictureModel.find({})
        let numberIndex = allImages.length -1
        let displayIndex = Math.floor(Math.random()*numberIndex)
        let pictureURLs = []
        for(let url of allImages){
            pictureURLs.push(url.picture)
        }
        return res.json({success:true,image:allImages[displayIndex].picture, allImages:pictureURLs})



    }catch(error){
        console.log(error)
        return res.json({success:false})
    }
}


export const deletePicture = async(req,res)=>{

    try{
        const {id}= req.body
        await pictureModel.findByIdAndDelete(id)
        fs.unlink("./upload",()=>{

        })
        return res.json({success:true})



    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }
}