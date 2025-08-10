import mongoose from "mongoose"

const Conversationschema=new  mongoose.Schema({
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"users"
  },
  receiver:
  {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"users"
  },
  message:[
    
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'messages'
        }
    
      ]

},{
    timestamps:true ,// created time will be added
     
});
const  Conversation = mongoose.model("conversations",Conversationschema)
export default Conversation ;
