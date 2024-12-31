import React, { useState }  from "react";
import { useSelector } from "react-redux"
import EditPhotoModal from "./Editphotomodal";

export default function Avatar({theuser,jet,setjet}){
    const user = useSelector(state => state.user);
    const online=useSelector(state => state?.user?.onlineusers)
    const isOnline=online.includes(theuser._id);
    
    const [click,setclick]=useState(false);
    function closeForm(e){
        if(e.target.id ==="hello"){
       console.log(e.target);
        // console.log("close")
        setclick(!click);
        // console.log(click);
        
    }
}

    function openForm(){
      
        setclick(!click);
         setjet(true);
    }
    function handleset(){
        setjet(false);
    }


 return (

   
        
          <>
          
             { theuser.profile_pic==="" ? 
                <div onClick={()=>{jet===false ? openForm() : handleset()}} className=" w-10 h-10 bg-yellow-400  text-xl font-extrabold flex items-center justify-center border-black border-2 text-white rounded-full">
                {theuser.name.charAt(0).toUpperCase()}
                
                </div>
               :
               <div onClick={()=>{jet===false ? openForm() : handleset()}}>
               <img  src={theuser.profile_pic} className="w-10 h-10 rounded-full" ></img>
           
               </div>}
               {click && <EditPhotoModal closeForm={closeForm} />}
               
               {
                isOnline && <div className="absolute bottom-1.5 right-1.5   w-2 h-2 bg-green-700 rounded-full ">

                </div>
               }
              </>
    
   
 )
}