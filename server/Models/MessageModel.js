import mongoose from "mongoose"

const Messageschema=new  mongoose.Schema({
  text:{
    type:String,
    default:""
  }
  ,
  imageurl:{
    type:String,
    default:""
  },
  videourl:{
    type:String,
    default:""
  },
  medianame:{
    type:String,
    default:""
  },
  msgByUserId:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:"User"
  }


},{
    timestamps:true       // created time will be added
});
const  MessageModel = mongoose.model("messages",Messageschema)
export default MessageModel ;