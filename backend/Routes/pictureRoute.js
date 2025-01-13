import { upload } from "../middleware/pictureUpload.js";
import express from "express"
import { addPicture ,allPictures, deletePicture} from "../Controller/pictureController.js";

export const pictureRoute = express.Router()
pictureRoute.post("/add-picture",upload.single("picture"),addPicture)
pictureRoute.get("/all-pictures",allPictures)
pictureRoute.delete("/delete-pictures",deletePicture)