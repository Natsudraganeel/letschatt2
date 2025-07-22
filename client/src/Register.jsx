import React from "react";
import axios from "axios"
import { useState } from "react";
import {NavLink, useNavigate } from "react-router-dom"
import {upload} from "./helpers/uploadfile.js";
import { ImCross } from "react-icons/im";
import toast, { Toaster } from 'react-hot-toast';

export default function Register(){
  const nav=useNavigate();
    const [data,setdata]=useState({name:"",email:"",password:"",profile_pic:""})
    const [photo,setphoto]=useState("");
    const handleChange=(e)=>{
setdata({...data,[e.target.name]:e.target.value});

    }
    const handleuploadphoto=async(e)=>{
      const file = e.target.files[0]
      
     
      setphoto(file);
    

    }
    const handleClearUploadPhoto = ()=>{
      
      setphoto(null)
    }
    const handlesubmit=async(e)=>{
           e.preventDefault();
         
          const uploadPhoto = await upload(photo);
          console.log(uploadPhoto.url);
          // setdata(prevData => ({
          //   ...prevData,
          //   profile_pic: uploadPhoto?.url
          // }));
          console.log(uploadPhoto);

          try{
      const res=await axios.post("https://letschatt2-backend.onrender.com/api/auth/register",{
       name:data.name,
       password:data.password,
       email:data.email,
       profile_pic:uploadPhoto.url
      })
      if(res.data.success===true){
       
        nav("/login");

      }
      
      else{
        toast.error(res.data.message);
      }
          }
          catch(err){
            console.log(err.message);
          }
           
    }
    return (
    <div id="login-popup" tabIndex={-1} className="bg-blur overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
   <div className="relative p-4 w-full max-w-md h-full md:h-auto">
     <div className="relative bg-white rounded-lg shadow">
       
       <div className="p-5">
         <h3 className="text-2xl mb-0.5 font-medium" />
         <p className="mb-4 text-sm font-normal text-gray-800" />
         <div className="text-center">
           <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
             Sign Up
           </p>
           <p className="my-4 text-sm leading-4 text-slate-600">
             You must sign up to move further
           </p>
         </div>
         
         <form className="w-full" onSubmit={handlesubmit}>
        
           
           <label htmlFor="email" className="sr-only">Email address</label>
           <input onChange={handleChange} name="email" type="email" autoComplete="email" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1" placeholder="Email Address"  />
           
           <label htmlFor="name" className="sr-only">Name</label>
           <input onChange={handleChange} name="name" type="name" autoComplete="name" required className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1" placeholder="Name"  />

           <label htmlFor="password" className="sr-only">Password</label>
           <input onChange={handleChange} name="password" type="password" autoComplete="current-password" required className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1" placeholder="Password"  />
          
           <div className="my-3 h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-blue-400 cursor-pointer">
          {photo ? <button onClick={handleClearUploadPhoto} className="mx-3" >
           <ImCross />
           </button> : 
           <button className=" hidden" >
           <ImCross />
           </button>  }
                <label type="button" >  
                {photo ? photo.name :"Upload Image"}
                <input name="photo" style={{display:"none"}} accept="images/*" type="file" onChange={handleuploadphoto}/>
                </label>
              
                </div>
             

          
           <div className="mt-4">
           <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
             Sign up
           </button>
           </div>
         </form>
         <div className="mt-6 text-center text-sm text-slate-600">
           Already have an account?
           <NavLink to="/login" className="mx-2 font-medium text-[#4285f4]">Sign in</NavLink>
         </div>
       </div>
     </div>
   </div>
   <Toaster />
 </div>
 
 
    )
        
} 
