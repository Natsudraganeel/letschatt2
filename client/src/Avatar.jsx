import React, { useState }  from "react";
import { useDispatch,useSelector } from "react-redux"
import { setuser } from "./redux/userslice";
import toast, { Toaster } from 'react-hot-toast';
import EditPhotoModal from "./Editphotomodal";

export default function Avatar({theuser}){
    const user = useSelector(state => state.user);
    const online=useSelector(state => state?.user?.onlineusers)
    const isOnline=online.includes(theuser._id);
       const dispatch=useDispatch();

    const [click,setclick]=useState(false);
    const [jet,setjet]=useState(false)
    function closeForm(e){
        if(e.target.id ==="hello"){
       console.log(e.target);
        // console.log("close")
        setclick(!click);
        // console.log(click);
        if(user.profile_pic==="abc"){
            dispatch(setuser({...user,profile_pic:""}))
        }
        
    }
}

    function openForm(){
        if(!document.cookie){
      toast.error("session expired.Relogin!");
   
   return ; }
        setclick(!click);
         setjet(true);
    }
    function handlejet(){
        setjet(false);
    }


 return (

   
        
          <>
          
             { theuser.profile_pic==="" ? 
                <div onClick={()=>{jet===false && theuser._id===user._id?  openForm() : handlejet()}} className=" w-10 h-10 bg-yellow-400  text-xl font-extrabold flex items-center justify-center border-black border-2 text-white rounded-full">
                {theuser.name.charAt(0).toUpperCase()}
                
                </div>
               :
               <div onClick={()=>{jet===false && theuser._id===user._id ? openForm() : handlejet()}}>
               <img  src={theuser.profile_pic} className="w-10 h-10 rounded-full" ></img>
           
               </div>}
               {click && <EditPhotoModal closeForm={closeForm} />}
               
               {
                isOnline && <div className="absolute bottom-1.5 right-1.5   w-2 h-2 bg-green-700 rounded-full ">

                </div>
               }
                <Toaster />
              </>
    
   
 )
}