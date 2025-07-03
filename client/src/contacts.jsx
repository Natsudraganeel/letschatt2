import React, { useEffect, useState,useMemo } from "react";
import { FaImage } from "react-icons/fa6";
import { useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { IoVideocam } from "react-icons/io5";
import axios from "axios"
import Avatar from "./Avatar";
export default function Contacts({setmsg,setfriend,hide,sethide,allmessage}){
    
        const clone={
            width:"450px",
            height:"100vh"
           }

           const clone2={
             width:"749px",
            height:"100vh"
           }

           const user=useSelector(state=>state.user);
           const [allcon,setallcon]=useState([]);
           
           const socketConnection=useSelector(state=>state?.user?.socketConnection);
           
           
        //    const getconversedusers=async()=>{
                 
        //     const res=await axios.get(`http://localhost:3000/api/auth/conversed/${user._id}`);
        //     if(res.data.success==true){
        //         console.log(res.data.conusers);
        //         setmessagedusers(res.data.conusers);
                
             
        //     }

                    
        //    }
           
        //    useEffect(()=>{
        //       getconversedusers();
              
        //    },[])
           
           useEffect(()=>{
               if(socketConnection){
                socketConnection.emit('contacts',user._id);
                socketConnection.on("contactsres",(data)=>{
                  setallcon(data);
                  console.log("the data",data);
                  console.log("saare con",allcon);
                })
               }
           },[socketConnection,allmessage])

           

         
        
            return (
                <div  className={hide===true ?  "contacts max-[750px]:hidden" : "contacts" } >
                    <div className="flex justify-center my-4">
                        <p className="font-sans font-black text-2xl">Chats</p>
                    </div>
                    <div className="h-100vh">
                    {
                     allcon.length>0 &&
                     allcon.map((see)=>{
                        return(
                            <>
                             <div onClick={()=>{  
                            //     if(!document.cookie){
                            // toast.error("session expired.Relogin!");
                            // return ;
                            //     }   
   sethide(true);setmsg(true);setfriend(see.conuser)}} className="flex my-1 py-1 bg-slate-300">
                             <div className="relative w-12 h-12 flex items-center justify-center hover:bg-slate-400 ">
                             <Avatar theuser={see.conuser}  />
                             </div>
                             <div>
                                <p className="mt-0.5 ">{see.conuser.name}</p>
                                <div className="flex mt-0.5">
                                {see.mix.lastmsg.imageurl &&
                                <FaImage size={14}/>}
                                {see.mix.lastmsg.videourl &&
                                    <IoVideocam size={14}/>}{
                                        see.mix.lastmsg.text.length > 30 ? (see.mix.lastmsg.msgByUserId!== user._id ? <p className="ml-0.5 font-black text-xs">{see.mix.lastmsg.text.substr(0,30)+"..."}</p> : 
                                        <p className="ml-0.5  text-xs">{see.mix.lastmsg.text.substr(0,30)+"..."}</p>) :
                                (see.mix.lastmsg.msgByUserId!== user._id ? <p className="ml-0.5 font-black text-xs">{see.mix.lastmsg.text}</p> : 
                                        <p className="ml-0.5  text-xs">{see.mix.lastmsg.text}</p>)
                                    }
                                </div>
                                </div>
                             </div>
                            
                            </>
                        )
                     })

                    }


                    </div>
                    <Toaster />
                </div>
            )
    
}
