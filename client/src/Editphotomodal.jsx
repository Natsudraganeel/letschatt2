import React,{useState} from "react";
import { useDispatch,useSelector } from "react-redux"
import { setuser } from "./redux/userslice";
import toast, { Toaster } from 'react-hot-toast';
import {upload} from "./helpers/uploadfile.js";
import axios from "axios";

import ImageOptionsModal from "./imageoptionsmodal";
export default function EditPhotoModal({closeForm}){
  
    
      const formdiv = {
        border: "2px solid black",
        padding: "20px 20px 50px 20px",
        borderRadius: "5%",
    
        marginBottom:"0.5%",
        marginLeft:"0.5%"
        
    
      }
   
      const user = useSelector(state => state.user);
      const dispatch=useDispatch();
      const [photo,setphoto]=useState(user.profile_pic);
      const [name,setname]=useState(user.name);
      const [ioptions,setioptions]=useState(false);
      function openopt(){
        setioptions(!ioptions);
    }
    function closeopt(e){
      // console.log(e.target.id)
      if(e.target.id === "iopt"){
    //  console.log(e.target);
      // console.log("close")
      setioptions(!ioptions);
      // console.log(ioptions);
      }

  }
  const handleuploadphoto=async(e)=>{
    console.log(user);
    if( user.profile_pic===""){
      const updatedUser = { ...user, profile_pic: "abc" };
      dispatch(setuser(updatedUser));
      const file = e.target.files[0];
      console.log(file);
      setphoto(file);
    }
     else{
    const file = e.target.files[0];
    console.log(file);
    setphoto(file);
     }
     console.log(user);
  }
  const handleremovephoto=async()=>{
   setphoto("");
    const updatedUser = { ...user, profile_pic: "" };
    dispatch(setuser(updatedUser));
    console.log(user);
  }
  const handlesubmit=async(e)=>{
    e.preventDefault();
  

   try{
    let x="";
    console.log(photo);
console.log(user.profile_pic);
  if(photo===""){
x="abcd";
  }

    else if(   photo!==user.profile_pic){
      const uploadPhoto = await upload(photo);
   console.log(uploadPhoto.url);
   x=uploadPhoto.url
   // setdata(prevData => ({
   //   ...prevData,
   //   profile_pic: uploadPhoto?.url
   // }));
   console.log(uploadPhoto);
}
console.log("x="+x);
const res=await axios.put("https://letschatt2-backend.onrender.com/api/auth/updateinfo",{
id:user._id,
name:name,
profile_pic:x
})
if(res.data.success===true){
 console.log(res.data.updateduser);
 dispatch(setuser(res.data.updateduser));
 console.log(user)
 

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
    <div onClick={closeForm} id="hello" className=" fixed z-20 inset-0 flex items-end" >

    <form className=" w-80 h-100 popup-form absolute mt-12 text-black bg-white" style={formdiv} onSubmit={handlesubmit}>
    <div className="flex justify-center mb-5">
    <h1>Edit Profile</h1>
    </div>
     <div className=" flex justify-center">
     {
        user.profile_pic===""
        ?
           <div onClick={openopt} className="  w-28 h-28 bg-yellow-400  text-xl font-extrabold flex items-center justify-center border-black border-2 text-white rounded-full">
                {user.name.charAt(0).toUpperCase()}
                
                </div>
        :
        <div className="w-28">
     <img  onClick={openopt} src={photo!==user.profile_pic && photo!==""  ? URL.createObjectURL(photo) : user.profile_pic  } className="  border-black border-2 p-2 h-28 rounded-full "/>
      </div>
     }
    

            </div>
            { ioptions && <ImageOptionsModal closeopt={closeopt} handleuploadphoto={handleuploadphoto} handleremovephoto={handleremovephoto} user={user} />}
            <div className=" w-full mt-10">
            
            <label htmlFor="username" className=" flex justify-center my-2 w-full">Username</label>
            
            <input
         onChange={(e)=>setname(e.target.value)}
         id="username"
         name="username"
         type="text"
         value={name}
         required
        
          className="my-4 py-8 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 px-2"
       />
            </div>
            <div className="h- flex items-end justify-end">
            
            <button type="submit" className="inline-flex  items-end justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
             Save
           </button>
           
            </div>
     </form>

    
    
  </div>
)
}
