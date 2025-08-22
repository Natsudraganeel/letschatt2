import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { IoAddCircle } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { PiTranslate } from "react-icons/pi";
import { SiGooglegemini } from "react-icons/si";
import { MdFileDownload } from "react-icons/md";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import {upload} from "./helpers/uploadfile.js";
import fileDownload from 'js-file-download' //https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
import axios from "axios"
import moment from "moment"
export default function Message({friend,sethide,hide,setmsg,allmessage,setallmessage,openemoji,setopenemoji}){
   const formdiv={
      border:"0.5px solid black",
      padding :"30px 20px 20px 20px",
      borderRadius:"20px",
      backdropFilter: "blur(2px)",
      marginBottom:"20px"
     
  
    }
    const cross={
      //border :"1px solid black",
      position: "absolute",
      right:"4px",
      top:"3px"
   }
   const user=useSelector(state=>state.user)
   const online=useSelector(state => state?.user?.onlineusers);
   const isOnline=online.includes(friend._id);
const socketConnection=useSelector(state=>state?.user?.socketConnection);
const [muser,setmuser]=useState({});
const [add,setadd]=useState(false);
const [msggenai,setmsggenai]=useState("");
const [translatepage,settranslatepage]=useState(false);
const [describepage,setdescribepage]=useState(false);
const [loading,setloading]=useState("");
const [message,setmessage]=useState({
   text:"",
   medianame:"",
   imageurl:"",
   videourl:""
})

const handleallmessages=async()=>{
   try{
   const res=await axios.get(`https://letschatt2-backend.onrender.com/api/auth/conversation/${user._id}/${friend._id}`, {
    headers: {
      Authorization: user.token,
    },
  });
   if(res.data.success===true){
      setallmessage(res.data.converse);
   }
   else{
      toast.error(res.data.message);
   }
   }
   catch(err){
      console.log(err.message);
   }
}
const handleDownload = (url, filename) => {
   var lake=url.substring(0,4)+"s"+url.substring(4);
   console.log("lake:-",lake);
   console.log("url:-",url);
   axios.get(lake, {
     responseType: 'blob',
   })
   .then((res) => {
     fileDownload(res.data, filename)
   })
 }
useEffect(()=>{
   handleallmessages();
},[friend])

// useEffect(()=>{
//     if(socketConnection){
//       socketConnection.emit("allmessages",{userid:user._id,friendid:friend._id});
//       socketConnection.on("allmessagesres",(data)=>{
//          setallmessage(data);
//       })
//     }
// },[socketConnection])

const handleimage=(e)=>{
   
   console.log("hello")
   console.log("the image",e.target.files[0]);
setmessage((pre)=>{
   return {
      ...pre,
      medianame:e.target.files[0].name,
      imageurl:e.target.files[0]
   }
})
setadd(!add)
console.log(message)

}
const handleemoji=(emojiData,e)=>{
   console.log(emojiData.emoji);
   console.log(message.text)
   var x=emojiData.emoji;

   setmessage((pre)=>{
      return {
         ...pre,
         text:pre.text+x
      }
   })
}
const handletext=(e)=>{

   setmessage((pre)=>{
      return {
         ...pre,
         text:e.target.value
      }
   })
}
const handlevideo=(e)=>{
    
   console.log("hello")
   console.log(e.target.files[0]);
setmessage((pre)=>{
   return {
      ...pre,
       medianame:e.target.files[0].name,
      videourl:e.target.files[0]
   }
})
setadd(!add)
console.log(message)
}
const closeform=()=>{
   setmessage((pre)=>{
      return {
         ...pre,
         text:"",
         medianame:"",
         imageurl:"",
         videourl:"",
      }
   })
   console.log(message)
}

const handlesubmit=async(e)=>{
   e.preventDefault();
   // if(!document.cookie){
   //    toast.error("session expired.Relogin!");
   //    return ;
   // }
   try{
   const res=await axios.get("https://letschatt2-backend.onrender.com/api/auth/user-details",{
                 withCredentials:true
               });
               console.log(res.data);
               if(res.data.data.success===false){
                 return  toast.error("Session Expired.Relogin Please!")
               }
               else{
   const uploadedphoto=await upload(message.imageurl);
     
   
   const uploadedvideo=await upload(message.videourl);
      console.log(message.text)
   if(message.imageurl || message.videourl || message.text ){
   if(socketConnection){
      socketConnection.emit('new message',{
         sender : user?._id,
         receiver : friend._id,
         text : message?.text,
         medianame:message?.medianame,
         imageurl : uploadedphoto?.url,
         videourl : uploadedvideo?.url,
         msgByUserId : user?._id
       })
   }
   setmessage({
      text : "",
      imageurl : "",
      videourl : ""
    })
   }

}

   }
   catch(err){
      toast.error(err.message);
   }

}
//handle translation only///////////////////////////////////////////////////////////////////////////////
const handletranslate=async(msgai)=>{
   try{
      // setmsggenai(msgai);
      if(!msgai.text){
        return  toast.error("No content to show ");
      }
      settranslatepage(true);
      setloading("Loading....");
       const res=await axios.post("https://letschatt2-backend.onrender.com/api/genai/translate",{content:msgai},
         {
    headers: {
      Authorization: user.token,
    },
  });
       console.log(res.data);
       if(res.data.success===true){
         // setmsggenai(res.data.message);
         setloading("");
         setmsggenai(res.data.message);
         console.log(res.data.message);
       }
       else{
       
           
         toast.error("Gemini not responding!!")
  
                   
}
   }
   catch(err){
        toast.error("Client side error")
   }
}

const handleaimedia=async(msgai)=>{
   setdescribepage(true);
     setloading("Loading....");
      if(msgai.imageurl){
         try{
         const res=await axios.post("https://letschatt2-backend.onrender.com/api/genai/describeimage",{content:msgai.imageurl},
            {
    headers: {
      Authorization: user.token,
    },
  }
         );
         if(res.data.success===true){
              setloading("");
            setmsggenai(res.data.message);
         }
         else{
           toast.error(res.data.message)
         }
      }
      catch(err){
         toast.error("Client side error")
      }
   }
      else{
          try{
         const res=await axios.post("https://letschatt2-backend.onrender.com/api/genai/describevideo",{content:msgai.videourl},
   {            
    headers: {
      Authorization: user.token,
    },
  });
         if(res.data.success===true){
              setloading("");
            setmsggenai(res.data.message);
         }
         else{
           toast.error(res.data.message)
         }
      }
      catch(err){
         toast.error("Client side error")
      }
      }
   // setmsggenai("hello")
   }















function handleai(){
   settranslatepage(false);
   setdescribepage(false);
   setloading("");
   setmsggenai("");
}
function handledate(msgtime){
   let currtime=new Date();
   let thistime=new Date(msgtime);
   console.log(msgtime);
   console.log(thistime);
   let time=currtime.getTime()-thistime.getTime();
   console.log(time);
   if(time<2*60*1000){// less than 2mis then show a min ago or a few a sec ago
      return moment(msgtime).fromNow();
   }
   // if(time>=24*60*60*1000){
   
   //    return moment(msgtime).format('D/M/YY,HH:mm')
   // }
      if(moment(currtime).format('D/MM/YY')!=moment(thistime).format('D/MM/YY')){
      return moment(msgtime).format('D/M/YY,HH:mm')
   }
   return moment(msgtime).format('HH:mm');
}





        useEffect(()=>{
            if(socketConnection){
               console.log(typeof(friend._id));
         socketConnection.emit("messagepage",friend._id);
         socketConnection.on("messageuser",(data)=>{
            setmuser(data);
            
         })
         socketConnection.on("message",(data)=>{
            console.log(data);
            setallmessage(data);
            console.log(allmessage)
         })
            }
        },[socketConnection,friend])
        
            return (
                <div className={hide==false ? "w-full bg-slate-300 grid hidden" : "w-full bg-slate-300 grid" }>
                {
                  (translatepage===true) && (
                   <div  className="fixed z-20 inset-0 flex items-center justify-center " >
                   
                   <div className="max-w-xs min-w-[300px]  bg-slate-100 rounded-lg h-96 ">
                   <div className="mr-4 mt-4 flex justify-end" onClick={handleai}><ImCross /></div>
                   <div>
                   <h1 className="ml-4 font-sans font-black">This translates to:-</h1>
                     </div>
                     <div className="h-92 grid overflow-y-scroll ">
                     <p className="ml-4 text-red-700">{loading}</p>
                    <div className="ml-4 self-center mr-2">
                         <div className="text-wrap">
                              {msggenai}
                          </div>
                      </div>
                      </div>
                     </div>
                     </div>
                    
                  )
                }

                   {
                  (describepage===true) && (
                   <div  className="fixed z-20 inset-0 flex items-center justify-center " >
                   
                   <div className="max-w-xs min-w-[300px]  bg-slate-100 rounded-lg h-96 ">
                   <div className="mr-4 mt-4 flex justify-end" onClick={handleai}><ImCross /></div>
                   <div>
                   <h1 className="ml-4 font-sans font-black">The description is:-</h1>
                     </div>
                     <div className="h-80 grid overflow-y-scroll ">
                     <p className="ml-4 text-red-700">{loading}</p>
                    <div className="ml-4 self-center mr-2">
                         <div className="text-wrap">
                              {msggenai}
                          </div>
                      </div>
                      </div>
                     </div>
                     </div>
                    
                  )
                }


                     <div className="w-full h-20 bg-slate-100 flex items-center justify-between">
                     <div className="flex items-center">
                     <div className="relative">
                     { muser?.profile_pic==="" ? 
                <div  className=" ml-4 w-10 h-10 bg-yellow-400  text-xl font-extrabold flex items-center justify-center border-black border-2 text-white rounded-full">
                {muser.name.charAt(0).toUpperCase()}
                
                </div>
               :
               <div >
               <img  src={muser?.profile_pic} className="ml-4 w-10 h-10 rounded-full" ></img>
           
               </div>}
               
               
               {
                isOnline && <div className="  absolute bottom-1.5 left-12 w-2 h-2 bg-green-700 rounded-full ">

                </div>
               }
               </div>
                <div className="ml-4">
               <p className="font-semibold">{muser?.name}</p>
               <p className="text-xs text-green-600">{isOnline ? "online" : "offline"}</p>
               </div>
               </div>
               <div onClick={()=>{sethide(false);setmsg(false)}} className="mr-4 min-[750px]:hidden" >
               <FaArrowCircleLeft size={20}/>
               </div>
              
                     </div> 
                     <div className="h-[calc(80vh-64px)]  overflow-y-scroll  grid mx-2">
                     {allmessage.map((msg,index)=>{
                        return (


                        <div className={`  p-2 m-1 rounded-lg max-w-[280px] w-fit ${msg.msgByUserId=== user._id ? "bg-yellow-200 justify-self-end self-center" :"bg-white self-center" }`}>
                         
                       {msg.imageurl && 
                       (<div>
                       <div className="flex justify-between">
                       <div className="flex">
                       <div >
                         <PiTranslate  className=" hover:bg-slate-400 " onClick={()=>{handletranslate(msg)}}/>
                         </div>
                        <div className="px-2"  onClick={()=>{handleaimedia(msg)}}>
                         <SiGooglegemini  className=" hover:bg-slate-400 " />
                         </div>
                         </div>
                        <div  onClick={() => {handleDownload(msg.imageurl, msg.medianame)}}>
                         <MdFileDownload size={20} className=" hover:bg-slate-400 "/>
                         </div>
                        
                         </div>
                        <a href={msg.imageurl} target="_blank"  ><img className="object-scale-down " src={msg?.imageurl}  /></a>
                         

                       </div>)

                       }
                       {
                        msg.videourl && 
                       (<div>
                       <div className="flex justify-between">
                       <div className="flex">
                       <div >
                         <PiTranslate  className=" hover:bg-slate-400 " onClick={()=>{handletranslate(msg)}}/>
                         </div>
                        <div className="px-2" onClick={()=>{handleaimedia(msg)}}>
                         <SiGooglegemini  className=" hover:bg-slate-400 " />
                         </div>
                         </div>
                        <div  onClick={() => {handleDownload(msg.videourl, msg.medianame)}}>
                         <MdFileDownload size={20} className=" hover:bg-slate-400 "/>
                         </div>
                        
                         </div>
                        <a href={msg.videourl} target="_blank" ><video className="object-scale-down" src={msg?.videourl} controls/>
                        </a></div>)
                       }
                       {!msg.imageurl && !msg.videourl && (
                        <div >
                         <PiTranslate  className=" hover:bg-slate-400 " onClick={()=>{handletranslate(msg)}}/>
                         </div>
                       )}
                       {<div className="text-wrap">{msg.text}</div> /*why? As allmessage is an array of arrays of size 1 and each of thos array consist of a message objcet*/ }
                     <div className="flex justify-end"><p className="text-xs">{handledate(msg.createdAt)}</p></div>
                       </div>)
                     })}
                    
                       
                        </div>
                  
                     
                     <div className="my-4 place-self-center self-end w-10/12 relative flex  items-center">
                     {add && <div  className=" fixed z-10 rounded absolute bottom-24  bg-white w-36 h-36 ">
                  
                        <label htmlFor="uploadimage" className="h-1/2 flex items-center p-2 gap-3 hover:bg-slate-200">
                           <div>
                           <FaImage size={28} color={"#95b87d"}/>
                           </div>
                           <p>Image</p>
                           
                        </label>
                        <input  accept="image/*" type="file" id="uploadimage" className="hidden" onChange={handleimage}/>
                        {/*accept=image/* only image files are acceptable*/ }
                        <label htmlFor="uploadvideo" className="h-1/2 flex items-center p-2 gap-3 hover:bg-slate-200">
                        <input  accept="video/*" type="file" id="uploadvideo" className="hidden" onChange={handlevideo}/>
                        <div>
                        <IoVideocam size={32} color={"#a476b8"}/>
                              </div>
                              <p>Video</p>
                         </label>
                         
                     </div>
                     }
         { 
       openemoji &&       
      <div id="emojipage" className="fixed inset-0 z-30 flex items-end justify-center left-4 bottom-28 " onClick={(e)=>{if(e.target.id==="emojipage"){setopenemoji(false)}}}>
      <EmojiPicker width={300} height={400} onEmojiClick={handleemoji}/>
      </div>
                     
                }
                    
                     
                     
                     {
                      message.imageurl || message.videourl ?
                      <div className="absolute z-20  bottom-2 flex items-end justify-center " >
         
         <div className="popup-form  bg-slate-800 text-black" style={formdiv}>
         <svg style={cross} onClick={closeform} className="h-8 w-8 text-white cursor-pointer"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
                     {message.imageurl ?
                        <img className=" w-80 h-48 p-4" src={URL.createObjectURL(message.imageurl)} />
                        :
                        <video 
                              src={URL.createObjectURL(message.videourl)} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />}
                     <form onSubmit={handlesubmit} className="relative">
                     <div className="absolute left-2 top-7  text-gray-400" onClick={()=>{setopenemoji(true)}}>
                     <MdOutlineEmojiEmotions  size={20}  />
                     </div>
                     <input value={message.text} onChange={handletext} type="text" placeholder="Type here ...." className="pl-2  bg-slate-100  rounded-2xl w-10/12 h-10 "/>
                     <button type="submit"  className=" w-50 h-50 p-2 rounded-full hover:bg-slate-400">
                     <RiSendPlaneFill size={35} color={"yellow"}/>
                     </button>
                     </form>
                     </div>
                     </div>
                     :
                     <form className="mb-4  w-full  flex justify-center items-center relative" onSubmit={handlesubmit}>
                     <button onClick={()=>{setadd(!add)}} className="w-50 h-50  ">
                     <IoAddCircle size={45}/>
                     </button>
                     <MdOutlineEmojiEmotions  size={20} className="absolute left-12 text-gray-400" onClick={()=>{setopenemoji(!openemoji)}}/>
                     <input value={message.text} onChange={handletext} type="text" placeholder="Type here ...." className="pl-2 pr-2  bg-slate-100  rounded-2xl w-11/12 h-10 "/>
                     <button type="submit"  className=" w-50 h-50 p-2 rounded-full hover:bg-slate-400">
                     <RiSendPlaneFill size={35}/>
                     </button>
                     
                     </form>
                     }
                    </div>
                       <Toaster />
                     
                </div>
            )
    
}
