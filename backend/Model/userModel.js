import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required: true
    },
    D_O_B:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    Scores:{
        type:Object,
        default:{overallCoins:0, currentToken:0,overallToken:0, balance:0}
    },
    powerUps:{
        type:Object,
        default:{Shield:5,life:5,magnet:5}
    },
    OTP:{
        type: String
    },
    verified:{
        type:Boolean,
        default: false
    }
},{timestamps:true})


export const userSchema = mongoose.model("user",userModel)
