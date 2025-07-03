import express from "express"
import { requiredsignin } from "../Middlewares/authmiddleware.js";
import {registercontroller,logincontroller,userdetails,googleauth,updateinfocontroller,searchcontroller,conversationcontroller,
    forgotcontroller,emailcheck,logoutcontroller} from "../Controllers/authcontroller.js"
const router=express.Router();
router.post("/register",registercontroller);
router.post("/login",logincontroller);
router.get("/logout",logoutcontroller);
router.get("/user-details",userdetails);
router.get("/google",googleauth);
router.put("/updateinfo",requiredsignin,updateinfocontroller);
router.get("/search/:id/:keyword",requiredsignin,searchcontroller);
router.get("/conversation/:id/:rid",requiredsignin,conversationcontroller);
// router.delete("/deletemessage",DeleteAllMessagesController);
// router.get("/conversed/:id",conversedcontroller);
router.post("/forgotpassword",forgotcontroller);
router.post("/emailcheck",emailcheck);

export default router
