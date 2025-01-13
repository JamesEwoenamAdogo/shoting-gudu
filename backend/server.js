import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import { userRoutes } from "./Routes/userRoutes.js"
import { pictureRoute } from "./Routes/pictureRoute.js"


dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 9000

app.listen(port, ()=>{
    console.log("Database connected at "+port)
})
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database connected")
})
app.use("/api/v1",userRoutes)
app.use("/api/v1",pictureRoute)
app.use("/images",express.static("uploads"))

