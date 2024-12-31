import React,{useState} from "react";

import { useDispatch,useSelector } from "react-redux"

export default function ImageOptionsModal({closeopt,handleuploadphoto,handleremovephoto,user}){


    
    
   
    


    return(
        <div  onClick={closeopt} id="iopt" className="fixed absolute z-20 inset-0  flex justify-end">
        <div className=" popup-form bg-slate-300 absolute mt-32 mr-4 text-black ">
        <div className="px-6 py-1 bg-slate-300 hover:bg-slate-400 ">
        <label type="button" > 
            {user.profile_pic==="" ?  "Add photo"  : "Edit Photo"}
            <input name="photo" style={{display:"none"}} accept="images/*" type="file" onChange={handleuploadphoto}/>
            </label>
            </div>
            {
                user.profile_pic!=="" &&
            <div onClick={handleremovephoto} className="px-6 py-1 bg-slate-300 hover:bg-slate-400" >
            Remove Photo
            </div>
            }
        </div>
        </div>
    )
}