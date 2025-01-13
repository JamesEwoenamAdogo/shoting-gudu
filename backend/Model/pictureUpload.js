import mongoose from "mongoose"

const pictureSchema = new mongoose.Schema({

    picture:{
        type:String
    }
},{timestamps:true})


export const pictureModel = mongoose.model("picture",pictureSchema)