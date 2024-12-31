
import mongoose from "mongoose"

const connectDB=async()=>{
try{
const connect=await  mongoose.connect(process.env.MONGO_LINK);
    console.log("succes");
}
catch(err){
console.log(err);
}
}
export  default connectDB;