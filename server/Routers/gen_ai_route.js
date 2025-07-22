import express from "express"
import { translatecontroller,imagedescriptor,videodescriptor } from "../Controllers/genaicontroller.js";
import { requiredsignin } from "../Middlewares/authmiddleware.js";
const router=express.Router();
router.post('/translate',requiredsignin,translatecontroller);
router.post("/describeimage",requiredsignin,imagedescriptor);
router.post("/describevideo",requiredsignin,videodescriptor);
export default router
