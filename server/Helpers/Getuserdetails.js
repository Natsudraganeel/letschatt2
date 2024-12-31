import jwt from "jsonwebtoken"
import User from "../Models/UserModel.js"
export const getuserdetails=async(token)=>{
 if(!token){
    return {
        message:"session out",
        logout:true
    }
 }
 else{
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decode.id).select("-password");
    return user;
 }
}