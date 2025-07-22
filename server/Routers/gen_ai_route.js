import express from "express"
import { translatecontroller,imagedescriptor,videodescriptor } from "../Controllers/genaicontroller.js";
const router=express.Router();
router.post('/translate',translatecontroller);
router.post("/describeimage",imagedescriptor);
router.post("/describevideo",videodescriptor);
export default router