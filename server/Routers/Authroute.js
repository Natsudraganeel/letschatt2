import express from "express"
import {registercontroller,logincontroller,userdetails,googleauth,updateinfocontroller,searchcontroller,conversationcontroller,
    forgotcontroller} from "../Controllers/authcontroller.js"
const router=express.Router();
router.post("/register",registercontroller);
router.post("/login",logincontroller);
router.get("/user-details",userdetails)
router.get("/google",googleauth);
router.put("/updateinfo",updateinfocontroller);
router.get("/search/:id/:keyword",searchcontroller);
router.get("/conversation/:id/:rid",conversationcontroller);

// router.get("/conversed/:id",conversedcontroller);
router.post("/forgotpassword",forgotcontroller);

export default router
