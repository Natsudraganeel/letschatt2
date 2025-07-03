import React, { useState } from "react"
import {NavLink,useNavigate} from "react-router-dom"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { settoken } from "./redux/userslice";
import { useGoogleLogin } from '@react-oauth/google';
export default function Home(){
  
  const dispatch = useDispatch();
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  const nav=useNavigate();
   
const responseGoogle=async(authres)=>{
try{

if(authres.code){
  const res=await axios({
    method:"get",
    url:`https://letschatt2-backend.onrender.com/api/auth/google?code=${authres.code}`,
    withCredentials:true
  });// withCredentials:true na korle browser e application e cookies  sectione store hobe na/By default withCredentials:false
  console.log(res.data);
  if(res.data.success===true){
    console.log("res.data.token",res.data.token);

    dispatch(settoken(res.data.token));
    // document.cookie="token="+res.data.token+";sameSite=none;secure=true";
        nav("/");
   }
   else{
    toast.error(res.data.message);
   }
}
}
catch(err){
console.log(err.message)
}
}
  const googlelogin = useGoogleLogin({// did according to documentation
    onSuccess: responseGoogle,// on success responseGoogle function is called and an object is sent automatically which has code.the code is sent to backend
    onError:responseGoogle,
    flow: 'auth-code',
  });



  const handlesubmit=async(e)=>{
    e.preventDefault();
    try{
         const res=await axios({
          method:"post",
          url:"https://letschatt2-backend.onrender.com/api/auth/login",
          data:{
            email,
            password
          },
          withCredentials:true
         })
         if(res.data.success===true){
          console.log(res.data.token);
          dispatch(settoken(res.data.token));
         
          //  localStorage.setItem("token", res.data.token);
           //  document.cookie="token="+res.data.token+";sameSite=none;secure=true";
              nav("/");
         }
         else{
          toast.error(res.data.message);
         }
    }
    catch(err){
console.log(err.message);
    }
  }

       return <>
   <div id="login-popup" tabIndex={-1} className="bg-blur overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
  <div className="relative p-4 w-full max-w-md h-full md:h-auto">
    <div className="relative bg-white rounded-lg shadow">

      <div className="p-5">
        <h3 className="text-2xl mb-0.5 font-medium" />
        <p className="mb-4 text-sm font-normal text-gray-800" />
        <div className="text-center">
          <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
            Login to your account
          </p>
          <p className="mt-2 text-sm leading-4 text-slate-600">
            You must be logged in to perform this action.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-2">
          
          <button onClick={googlelogin} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[18px] w-[18px] " />Continue with
            Google
          </button>
       
        </div>
        <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
          <div className="h-px w-full bg-slate-200" />
          OR
          <div className="h-px w-full bg-slate-200" />
        </div>
        <form onSubmit={handlesubmit} className="w-full">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input onChange={(e)=>setemail(e.target.value)} name="email" type="email" autoComplete="email" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1" placeholder="Email Address"  />
          <label htmlFor="password" className="sr-only">Password</label>
          <input onChange={(e)=>setpassword(e.target.value)} name="password" type="password" autoComplete="current-password" required className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1" placeholder="Password"  />
          <p className="mb-3 mt-2 text-sm text-gray-500">
            <NavLink to="/forgot-password" className="text-blue-800 hover:text-blue-600">Forgot your password?</NavLink>
          </p>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
            Continue
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?
          <NavLink to="/register" className="mx-2 font-medium text-[#4285f4]">Sign up</NavLink>
        </div>
      </div>
    </div>
  </div>
  <Toaster />
</div>



       </>
}
