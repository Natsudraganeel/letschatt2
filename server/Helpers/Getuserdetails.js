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
    try{
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    console.log("the decode",decode);
    const user=await User.findById(decode.id).select("-password");
    return user;
    }
    catch(err){
            if(err.name==="TokenExpiredError"){
        return {success:false,message:"Session Expired.Relogin!"};
      }
      return {success:false,message:err.message};
    }
 }
}
