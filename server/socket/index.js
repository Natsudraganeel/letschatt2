import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { getuserdetails } from "../Helpers/Getuserdetails.js";
import User from "../Models/UserModel.js";
import Conversation from "../Models/ConversationModel.js"
import MessageModel from "../Models/MessageModel.js"
// socket.io website very helpful
// 
const app = express();
const server = createServer(app);
const io = new Server(server, { 
    cors:{
        origin : "https://letschatt2.onrender.com", 
        credentials : true 
    }
 });
var online=new Set();
io.on("connection", async(socket) => {
    try{
    console.log("connect",socket.id);
    const token=socket.handshake.auth.token;
    const user=await getuserdetails(token);
    socket.join(user?._id?.toString());// adds all the users in the socket   // if we dont toString() isonline will be shown false.why?as userid is string and user._id is integer. .has() wont work unless 
    online.add(user?._id?.toString());       // array of users in socket
    io.emit("online",Array.from(online));
// console.log(online);
    socket.on("messagepage",async(userid)=>{
        console.log("userid",typeof(userid));//type of userid sent is string
        // console.log(online);
        const userdetails=await User.findById(userid).select("-password");
        socket.emit("messageuser",{
            _id:userdetails?._id,
            email:userdetails?.email,
            name:userdetails?.name,
            profile_pic:userdetails?.profile_pic,
            
        })
       
    })
    socket.on("contacts",async(userid)=>{
        const allusers=await Conversation.find( {"$or":[{ sender:userid },
            {receiver:userid }]}).populate('message');

            const theusers=new Set();
            const ans=new Set();
            for(let i=0;i<allusers.length;i++){
                const k=allusers[i].message;
                if(userid!=allusers[i].sender){
                
                    ans.add(allusers[i].sender.toString());
                    theusers.add({friend:allusers[i].sender.toString(),lastmsg:k[k.length-1]});
                }
                if(userid!=allusers[i].receiver){
                    ans.add(allusers[i].receiver.toString());
                    theusers.add({friend:allusers[i].receiver.toString(),lastmsg:k[k.length-1]});
                    }
            }
            const usersarr=Array.from(ans);
            const conusers=await User.find({ _id: { $in: usersarr } }).select("-password");
            const mixed=Array.from(theusers);
            conusers.sort((a,b)=>{return a._id.toString().localeCompare(b._id.toString())});// return dena imp.otherwise sort will not happen.also _id is object so to be converted to string
            mixed.sort((a,b)=>{return a.friend.localeCompare(b.friend)});
            // console.log("consusers",conusers);
            // console.log("mixed",mixed);
            const realans=[];
            let i=0;
            let j=0;
            while(i<conusers.length && j<mixed.length){
                realans.push({conuser:conusers[i],mix:mixed[j]});
                i++;
                j++
            }
            // console.log(realans);
           socket.emit("contactsres",realans);
            

    })
    socket.on("allmessages",async(user)=>{
        const id=user.userid;
        const rid=user.friendid;
        const getconversation=await Conversation.findOne({
            "$or":[{ sender:id,receiver:rid },
                    {sender:rid,receiver:id }
                ]
        }).populate('message');
        socket.emit("allmessagesres",getconversation?.message || []);
    })

    socket.on("new message",async(data)=>{
        // console.log(data);
        let conversation=await Conversation.findOne({
            "$or":[
                {sender:data?.sender,receiver:data?.receiver},
                {sender:data?.receiver,receiver:data?.sender}
            ]
        })
        if(!conversation){
            let createaconversation=await  Conversation({
                sender:data?.sender,
                receiver:data?.receiver
            })
            conversation=await createaconversation.save();
        }
        const msg=await MessageModel({
            text:data?.text,
            medianame:data?.medianame,
            imageurl:data?.imageurl,
            videourl:data?.videourl,
            msgByUserId :data?.msgByUserId
        })
        const savedmessage =await msg.save();
        const updatedconversation=await Conversation.updateOne({_id:conversation?._id},{
            "$push": {message: savedmessage._id}}
        );
        const getconversation=await Conversation.findOne({
            "$or":[{ sender:data?.sender,receiver:data?.receiver },
                {sender:data?.receiver,receiver:data?.sender }
            ]
        }).populate('message');
        io.to(data?.sender).emit("message",getconversation?.message || []);
        io.to(data?.receiver).emit("message",getconversation?.message || []);
    })



    // console.log(token);               //on refreshing each time a current socket disconnects and a new socket is created and therefore a new id.
    socket.on("disconnect",()=>{
        online.delete(user?._id?.toString());
        io.emit("online",Array.from(online));      // removes user from array of users in socket when the user disconnects
        console.log("disconnect",socket.id);
    })
}
catch(err){
    console.log(err.message);
}
});
export {app,server}
