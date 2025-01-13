import { userSchema } from "../Model/userModel.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.body
        if(!token){
            return res.json({success:false, message:"no token"})
        }
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
        const verifyUser = await userSchema.findById(decoded.id)
        // console.log(token,decoded)
        if(!verifyUser){
            return res.json({message:"User not found"})
        }
        req.userId = decoded.id
        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }
}
