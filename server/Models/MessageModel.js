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
  seen:{
    type:Boolean,
    default:false
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