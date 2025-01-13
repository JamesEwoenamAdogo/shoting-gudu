import { userSchema } from "../Model/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const signUp = async(req,res)=>{
    try{
        // console.log(req.body)
        const {firstName, userName, D_O_B,password,confirm_Password,phoneNumber}= req.body
        const passwordMatch = confirm_Password==password
        const allFields = firstName && userName && userName && D_O_B&& password && confirm_Password && phoneNumber
        const existingUserName = await userSchema.find({userName})
        const checkPhoneNumber = await userSchema.find({phoneNumber})
        console.log(existingUserName)
        if(!(checkPhoneNumber.length == 0)){
            return res.json({success:false, message:"Phone Number already registered"})
        }
        if(!(existingUserName.length==0)){
            return res.json({success:false,message:"username already existing"})
        }
        if(!allFields){
            return res.json({success:false,message:"please enter all fields"})
        }
        if(!passwordMatch){
            return res.json({success:false,message:"Passwords mismatch"})
        }
        
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new userSchema({firstName,userName,D_O_B, password:hashedPassword,phoneNumber})
        newUser.save()
        return res.json({success:true, newUser})




    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }
}
export const login = async(req,res)=>{
    try{
        const {userName,password}= req.body
        console.log(req.body)
        if(!(userName && password)){
            return res.json({success:false, message: "Please enter all fields"})
        }
        const findExisting = await userSchema.find({userName})
        if(!(findExisting.length==1)){
            return res.json({success:false, message:"User not existing"})
        }
        
        console.log(findExisting)
        const comparePasswords = await bcrypt.compare(password,findExisting[0].password)
        if(!comparePasswords){
            return res.json({success:false, message:"Invalid credentials"})
        }
        const token = jwt.sign({id:findExisting[0]._id,userName}, process.env.TOKEN_SECRET)
        return res.json({success:true,token,message:"Login successful",userId:findExisting[0]._id, user: findExisting[0].Scores,fullName:findExisting[0].firstName,userName:findExisting[0].userName,D_O_B: findExisting[0].D_O_B, phoneNumber:findExisting[0].phoneNumber})



    }catch(error){
        console.log(error)
        return res.json({success:false})
    }
}
export const getUser = async(req,res)=>{
    try{
        const {id} = req.params
        const userDetails = await userSchema.findById(id)
        return res.json({success:true,fullName:userDetails.firstName,userName:userDetails.userName,D_O_B:userDetails.D_O_B, phoneNumber:userDetails.phoneNumber,overAllCoins:userDetails.Scores.overallCoins,currentToken:userDetails.Scores.currentToken, overallToken:userDetails.Scores.overallToken,balance: userDetails.Scores.balance,shield:userDetails.powerUps.Shield,magnet:userDetails.powerUps.magnet, life:userDetails.powerUps.life})
    }catch(error){
        console.log(error)
        return res.json({success:false})
    }
}



export const deleteUser = async(req,res)=>{
    try{
        const id= req.userId
        await userSchema.findByIdAndDelete(id)
        return res.json({success:true,message:"Account deleted successfully"})

    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }
}


export const updateUser = async(req,res)=>{
    try{
        const id = req.userId
        if(req.body['currentPassword']){
            const {currentPassword,newPassword, confirmPassword} = req.body
            const existingUser = await userSchema.findById(id)
            const comparePassword = await bcrypt.compare(currentPassword, existingUser.password)
            if(!(comparePassword)){
                console.log(existingUser.password)
                return res.json({success:false, message:"Current Password Incorrect"})
            }
            if(!(newPassword==confirmPassword)){
                return res.json({success:false, message:"Password mismatch"})
            }
            const hashedNewPassword = await bcrypt.hash(newPassword,10)
            const upadatePasswordBody = {password:hashedNewPassword}
            const updatedPassword = await userSchema.findByIdAndUpdate(id, upadatePasswordBody, {new: true})
            return res.json({success: true, message: "Password Updated"})

        }
        const updateData= req.body
        delete updateData.token
        console.log(updateData)
        const updated = await userSchema.findByIdAndUpdate(id, updateData, {new:true})
        return res.json({success:true, data:updated}) 

    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }

}

export const updateScores = async(req,res)=>{
    try{
        const id = req.userId
        const {coins} = req.body
        const currentCoins = parseInt(coins.split(" ")[1], 10)
        const existing = await userSchema.findById(id)
        let currentToken = existing.Scores.currentToken
        let overallToken = existing.Scores.overallToken
        let overallCoins = existing.Scores.overallCoins
        let balance = existing.Scores.balance
        console.log(existing)

        balance = currentCoins
        overallCoins+=balance
        currentToken = parseFloat((currentCoins/5000).toFixed(3))
        overallToken = parseFloat((overallCoins/5000).toFixed(3))
        const scoreUpdate = {overallCoins,currentToken,overallToken,balance} 
        console.log(scoreUpdate)
        const updateScores = await userSchema.findByIdAndUpdate(id,{Scores:scoreUpdate,powerUps:{Shield:5,life:5,magnet:5}},{new:true})
        console.log(updateScores)
        return res.json({message:"success", success: true, overAllCoins:updateScores.Scores.overallCoins,overAllToken:updateScores.Scores.overallToken, currentTokens:updateScores.Scores.currentToken, Balance:updateScores.Scores.balance})







    }catch(error){
        console.log(error)
        res.status(500).json({success:false, message:"error"})
    }
}

export const updateAssets = async(req,res)=>{
    try{
        const id = req.userId
        const assetToChange = req.body.asset
        if(assetToChange =="shield"){
            const userDetails = await userSchema.findById(id)
            let Shield = userDetails.powerUps.Shield
            Shield+=-1
            let magnet = userDetails.powerUps.magnet
            let life = userDetails.powerUps.life
            let powerUps = {Shield,magnet,life}
            const updatePowerUps = await userSchema.findByIdAndUpdate(id,{powerUps},{new:true})
            return res.json({success:true, shield: updatePowerUps.powerUps.Shield})

        }
        if(assetToChange =="magnet"){
            const userDetails = await userSchema.findById(id)
            let Shield = userDetails.powerUps.Shield
            let magnet = userDetails.powerUps.magnet
            magnet+=-1
            let life = userDetails.powerUps.life
            let powerUps = {Shield,magnet,life}
            const updatePowerUps = await userSchema.findByIdAndUpdate(id,{powerUps},{new:true})
            return res.json({success:true,magnet: updatePowerUps.powerUps.magnet})
            
        }
        if(assetToChange =="life"){
            const userDetails = await userSchema.findById(id)
            let Shield = userDetails.powerUps.Shield
            let magnet = userDetails.powerUps.magnet
            let life = userDetails.powerUps.life
            life+=-1
            let powerUps = {Shield,magnet,life}
            const updatePowerUps = await userSchema.findByIdAndUpdate(id,{powerUps},{new:true})
            return res.json({success:true, life: updatePowerUps.powerUps.life})
            
        }



    }catch(error){
        console.log(error)
        res.status(500).json({success:false})
    }
}

export const verifyAccount = async(req,res)=>{
    try{
        const {OTPCode,phoneNumber}= req.body
        // const id = req.userId
        const accountDetails = await userSchema.find({phoneNumber})
        if(!(OTPCode== accountDetails[0].OTP)){
            return res.json({success:false, message:"invalid code"})
        }
        else if(phoneNumber==accountDetails[0].phoneNumber){
            const user = await userSchema.findByIdAndUpdate( accountDetails[0]._id , {verified:true,OTP:""}, {new:true})
            
            return res.json({success:true, message:"signup success"})
        }
        





    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }
}

export const checkNumber = async(req,res)=>{
    try{
       const {phoneNumber,OTP} = req.body;
        const existingPhoneNumber = await userSchema.find({phoneNumber})
        if(existingPhoneNumber.length==0){
            return res.json({success:false, message:"Invalid phoneNumber"})
        }
        await userSchema.findByIdAndUpdate(existingPhoneNumber[0]._id,{OTP}, {new:true})
        return res.json({success:true})

    }catch(error){
        console.log(error)
        return res.status(500).json({success:false})
    }
}

export const checkOTP = async(req,res)=>{
    try{
        const {OTP,phoneNumber}= req.body
        const OTPexisting = await userSchema.find({OTP})
        if(!(OTPexisting[0].OTP==OTP)){
            return res.json({success:false})
        }
        if(phoneNumber== OTPexisting[0].phoneNumber){
            return res.json({success:true,id:OTPexisting[0]._id})
        }




    }catch(error){
        console.log(error)
        return res.json({success:false})
    }
}

export const resetPassword = async (req,res)=>{
    try{
        const {id,password}= req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await userSchema.findByIdAndUpdate(id,{password:hashedPassword}, {new:true})
        return res.json({success:true,message:"Password updated successfully"})


    }catch(error){
        console.log(error)
        return res.json({success:false})
    }
}

export const deleteAccount = async(req,res)=>{
    try{
        const {phone} = req.params
        const findAccount = await userSchema.find({phoneNumber:phone})
        if(!(findAccount.length==1)){
            return res.json({success:false,message:"Account not existing"})

        }
        console.log(findAccount)
        await userSchema.findByIdAndDelete(findAccount[0]._id) 
        return res.json({success:true, message:"Account data deleted"})  

    }catch(error){
        console.log(error)
        res.status(500).json({success:false}) 
    }
}