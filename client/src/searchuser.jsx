import React, { useState } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "./Avatar";
import toast from "react-hot-toast";
export default function Search({handleclosesearch,setmsg,setfriend,sethide}){
     
    const formdiv = {
        border: "2px solid black",
        padding: "20px 20px 50px 20px",
        borderRadius: "5%",
       
        margin: "20% 30% 20% 30%"
    
      }
      const bg={
        backdropFilter: "blur(10px)",
      }
      const nav=useNavigate();
      const user = useSelector(state => state.user);
      const [keyword,setkeyword]=useState("");
      const [search,setsearch]=useState([]);
      const handlesearch=async(e)=>{
        e.preventDefault();
        console.log("hello")
        const res=await axios.get(`http://localhost:3000/api/auth/search/${user._id}/${keyword}`,
          {
    headers: {
      Authorization: user.token,
    },
  }
        );
        if(res.data.success===true){
            setsearch(res.data.users);
        }
        else{
          toast.error(res.data.message);
        }
      }
    return (
       
        <div id="search" onClick={handleclosesearch} className="fixed z-20 inset-0 flex items-center justify-center bg-opacity-50" style={bg}>

        <div className="popup-form absolute mt-12 text-black" style={formdiv}>
         
          <form  className="space-y-6 mb-3" action="#" method="POST" onSubmit={handlesearch}>
  
          <div class="w-full max-w-sm min-w-[200px]">
  <div class="relative">
    <input
      class="w-full bg-slate-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
      placeholder="Search User By Name" 
      onChange={(e)=>{setkeyword(e.target.value)}}
    />
    <button
      class="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="submit"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 ">
        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
      </svg>
 
      
    </button> 
  </div>
</div>
          </form>
          <div >
          {search.length>0 && 
              search.map((s)=>{
                return <>
                <div onClick={()=>{sethide(true);setmsg(true);setfriend(s)}} className="w-full h-12 bg-slate-100 flex items-center hover:outline outline-blue-500 cursor-pointer ">
            <div className="ml-2">
            <div className="relative w-12 h-12 flex items-center justify-center  ">
            <Avatar theuser={s} />
            
            </div>
            
              </div>
              <div className="mx-2">
              <p>{s.name}</p>
              </div>
            </div>
            </>
              })
            
          }
          </div>
        </div>
       
      </div>
  
    )
}
