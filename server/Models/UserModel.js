import mongoose from "mongoose"

const regschema=new  mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true,
    unique:true
  },
  password:
  {
    type:String,
    required:true,

  },
  email:{
    type: String,
    unique : true,
  },
  profile_pic:{
    type:String,
    default:""
  }
},{
    timestamps:true       // created time will be added
});
const  User = mongoose.model("users",regschema)
export default User;