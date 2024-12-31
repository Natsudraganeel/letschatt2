import React from "react";
import img1 from "./images/chat.svg"
export default function DefaultMessage(){
    
       
        
        
            return (
                <div className=" w-full bg-slate-300 flex justify-center items-center max-[750px]:hidden" >
                     <div className="grid">
                     <img src={img1} className="w-20 h-20 mb-2 justify-self-center"/>
                     <p className="text-slate-500 font-style: italic ">ChatBox for Web</p>
                     </div>
                </div>
            )
    
}