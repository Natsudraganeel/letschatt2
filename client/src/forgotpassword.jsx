import React,{useState,useRef} from "react";
import {NavLink,useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { settoken } from "./redux/userslice";
import { useSelector } from "react-redux";
import axios from "axios"
export default function Forgotpassword(){
    const dispatch = useDispatch();
    const inputRefs = useRef([]);
    const [email,setemail]=useState("");
    const [otpinput, setotpinput] = useState(["","","",""]);
    const [sentotp,setsentotp]=useState();
    const [click,setclick]=useState("");
    
    var ox;
    const nav=useNavigate();
   

        async function sendEmail(event){

            event.preventDefault();
    console.log(email);
            try{
               const res=await axios.post("https://letschatt2-backend.onrender.com/api/auth/emailcheck",{
                email
              })
              console.log(res.data);
              // console.log(res.data);
            if(res.data.success===false){
                // alert(res.data.message);
                toast.error(res.data.message);
            }
            else{
                ox=Math.random();
                ox=ox*9000;
                ox=Math.floor(ox)+1000;
              
               // console.log(ox);
                  setsentotp(ox);
                 // console.log(sentotp);
                const config={
                  Username : process.env.REACT_APP_USERNAME,
                  Password : process.env.REACT_APP_SMTP_PASSWORD,
                  Host : process.env.REACT_APP_SMTP_HOST,
                  Port:process.env.REACT_APP_PORT,
                  To : email,
                  From : process.env.REACT_APP_MY_EMAIL,
                  Subject : "OTP for login purpose",
                  Body : `Your otp  is ${ox}`,
                  
              }
              if(window.Email){
                window.Email.send(config).then(
                  () =>{
                    toast('OTP has been sent.Check your mail', {
                      icon: '👏',
                    });
                 
              
                    
                     
                  }
                ); 
              }
            }
            }
              catch(err){
                console.log(err);
              }
            
  
        

    }
    const handleChange = (index,e) => {
        const value = e.target.value;
        if (isNaN(value)) return;
    
        const newOtp = [...otpinput];
        // allow only one input
        newOtp[index] = value;
        console.log(newOtp);
        setotpinput(newOtp);
    
        
    
        // Move to next input if current field is filled
        if (value && index < 3 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
        const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otpinput[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
  
      inputRefs.current[index - 1].focus();
    }
  }
    
    async function handlesubmit(e){
            e.preventDefault();
            try{
                   let ans=otpinput[0]+otpinput[1]+otpinput[2]+otpinput[3];
            //  console.log(res.data);
            //  console.log(sentotp);
              if(sentotp==ans){
               const res=await axios({
                method:"post",
                url:"https://letschatt2-backend.onrender.com/api/auth/forgotpassword",
                data:{
                  email,
                  
                },
                withCredentials:true
               })
               if(res.data.success===true){
                console.log(typeof(res.data.token));
                // document.cookie="token="+res.data.token;
                localStorage.setItem("token",res.data.token);
                dispatch(settoken(res.data.token));
                //alert("success");
                nav("/");
               }
                  else{
                alert(res.data.message);
              }
              }
              else{
                 setclick("The otp entered is wrong.Try resending the otp");
              }
            }
            catch(err){
              console.log(err);
                alert("Error in react")
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
             Forgot password?
           </p>
           <p className="my-2 text-sm leading-4 text-slate-600">
             Enter Your Email
           </p>
         </div>
        
         <form onSubmit={sendEmail} className="w-full">
           <label htmlFor="email" className="sr-only">Email address</label>
           <input onChange={(e)=>{setemail(e.target.value)}} name="email" type="email" autoComplete="email" required className="block mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1" placeholder="Email Address"  />
           
           <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
             Submit
           </button>
         </form>
        
       </div>
       <div>
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
          <p className="font-semibold text-3xl">Enter OTP</p>
        </div>
        <form onSubmit={handlesubmit} className="w-full p-5" method="post">
          <div className="flex flex-col space-y-16">
            <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
            {
                otpinput.map((value,index)=>{
                    return (
                        <>
                        <div className="w-16 h-16 ">
                <input  key={index}  
                ref={(input)=>{inputRefs.current[index]=input}}
                value={value}
                onChange={(e)=>{handleChange(index,e)}}
                onKeyDown={(e)=>{handleKeyDown(index,e)}}
                 className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-300  text-lg bg-gray-50 focus:bg-gray-50 focus:ring-1 ring-slate-700" type="text" name="" minLength="1" maxLength="1" required />
              </div>
             
              </>
                    )
                })
             
            }
            </div>

            <div className="flex flex-col space-y-5">
              <div>
              <h1 style={{color:"red"}}>{click}</h1>
                  <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400">
             Verify Account
           </button>
              </div>

              <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                <p>Didn't recieve OTP?</p> <a onClick={sendEmail} className="flex flex-row items-center text-blue-600"  target="_blank" rel="noopener noreferrer">Resend OTP</a>
              </div>
            </div>
          </div>
        </form>
      </div>
     </div>
   </div>
   <Toaster />
 </div>
 
 
 
        
 
)
} 
