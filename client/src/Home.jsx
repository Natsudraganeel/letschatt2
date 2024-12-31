import React, { useEffect, useState } from "react"
import axios from "axios"
import Cookies from 'js-cookie';
import { useDispatch,useSelector } from "react-redux"
import { setuser,logout,setonlineusers,setsocketConnection } from "./redux/userslice";
import { useNavigate,useParams } from "react-router-dom";
import Leftbar from "./leftbar";
import DefaultMessage from "./defaultmessage"
import Contacts from "./contacts";
import Message from "./message";
import Spinner from "./spinner";
import  io  from "socket.io-client";

export default function Home(){
  const [click,setclick]=useState(false);
  const [allmessage,setallmessage]=useState([]);
  const [msg,setmsg]=useState(false);
  const [jet,setjet]=useState(false);
const [hide,sethide]=useState(false);
  const [friend,setfriend]=useState();
       const user = useSelector(state => state.user);
       
      
  useEffect(()=>{
console.log(msg);
  },[msg])
       
       const dispatch=useDispatch();
       const nav=useNavigate()
       const details=async()=>{
             try{
            const res=await axios({
           
              url:"https://letschatt2-backend.onrender.com/api/auth/user-details",
              withCredentials:true// the credential is token saved in browser in cookie section
            })
            dispatch(setuser(res.data.data));
        console.log(res.data.data);
            if(res.data.data.logout===true){
              dispatch(logout());
       
              nav("/login");
            }
     
            //console.log(res.data);
          
             }
             catch(err){
                 console.log(err.message);
             }
       }
       useEffect(()=>{
              details();
       },[])


       useEffect(()=>{
        // var tok=Cookies.get('token');
         var tok=localStorage.getItem('token');
        console.log("tok=",tok);
        const socketconnection=io("https://letschatt2-backend.onrender.com",{
          auth:{
            token:tok
          }
        })
        socketconnection.on("online",(data)=>{
          console.log(data);
          dispatch(setonlineusers(data));
          console.log(user);
        })
        dispatch(setsocketConnection(socketconnection))

        return ()=>{
          socketconnection.disconnect();
        }
       },[])


       return (
        <pre >
        {user.email!="" ? 
        (
          <div className="flex ">
          <Leftbar click={click}  setmsg={setmsg} setclick={setclick} setfriend={setfriend} jet={jet} setjet={setjet} sethide={sethide}/>
          <Contacts  setmsg={setmsg} setfriend={setfriend} hide={hide} sethide={sethide} allmessage={allmessage}/>
          {
            msg===true ?
            <Message  friend={friend} sethide={sethide} hide={hide} setmsg={setmsg} allmessage={allmessage} setallmessage={setallmessage} />
            :
         <DefaultMessage click={click} setclick={setclick}/>
          

          }
          </div>
        )
        :
        (
          <Spinner/>
        )
        }
      
       
       </pre>)
}
