import mongoose from "mongoose"

const Conversationschema=new  mongoose.Schema({
  sender:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:"User"
  },
  receiver:
  {
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:"User"
  },
  message:[
    {
        type:Array,
        
        default:[]
    }
  ]

},{
    timestamps:true ,// created time will be added
     
});
const  Conversation = mongoose.model("conversations",Conversationschema)
export default Conversation ;