import React, { useState } from "react";
import axios from 'axios'
import Cookies from 'js-cookie';
import { AiFillMessage } from "react-icons/ai";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { logout } from "./redux/userslice";
import { IoPersonAddSharp } from "react-icons/io5";
import { BiSolidLogOut } from "react-icons/bi";
import { useDispatch,useSelector } from "react-redux"
import Search from "./searchuser";
import Avatar from "./Avatar";
export default function Leftbar({setmsg,setfriend,sethide}){
   const clone={
    width:"70px",
    height:"100vh"
   }
   const user = useSelector(state => state.user);
   const [opensearch,setopensearch]=useState(false);
   
   const dispatch=useDispatch();
   const nav=useNavigate()


    const handleopensearch=()=>{
   //      if(!document.cookie){
   //    toast.error("session expired.Relogin!");
   
   // return ; }
              setopensearch(!opensearch);
   }
   const handleclosesearch=(e)=>{
           if(e.target.id==="search"){
    setopensearch(!opensearch);
           }
   }



const handlelogout=async(e)=>{
    e.preventDefault();
    try{
   
//         var Cookies = document.cookie.split(';');
//  // set past expiry to all cookies
// for (var i = 0; i < Cookies.length; i++) {
//    document.cookie = Cookies[i] + "=; expires="+ new Date(0).toUTCString(); // source:- https://www.tutorialspoint.com/how-to-clear-all-cookies-with-javascript 
// }
// Cookies.remove('token');
     const res= await axios.get("http://localhost:3000/api/auth/logout", {
  withCredentials: true
});      
         if(res.data.success===true){
        dispatch(logout());
    localStorage.clear();
              nav("/login");
         }
       
       else{
        toast.error(res.data.message);
       }
    }
    catch(err){
         toast.error(err.message);
    }
}




    return (
        <div  style={clone} className="bg-slate-200 flex flex-col justify-between   ">
        <div >
        <button  className="mt-10 w-12 h-12 flex items-center justify-center hover:bg-slate-400 ">
         <AiFillMessage size={25} />
         </button>
         <div className="w-12 h-12 flex items-center justify-center hover:bg-slate-400 " onClick={handleopensearch} >
         <IoPersonAddSharp size={25} />
         </div>
         {opensearch && <Search handleclosesearch={handleclosesearch} setmsg={setmsg} setfriend={setfriend}   sethide={sethide}/>}
         </div>
         <div>
         <div className="relative w-12 h-12 flex items-center justify-center hover:bg-slate-400 ">
         <Avatar theuser={user} />
         </div>
         <div onClick={handlelogout} className="w-12 h-12 flex items-center justify-center hover:bg-slate-400 ">
         <BiSolidLogOut size={20} />
         </div>
         </div>
            <Toaster />
        </div>
    )
}
