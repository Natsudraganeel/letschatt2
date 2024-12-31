import User from "../Models/UserModel.js"
import axios from "axios"
import { hashPassword,comparePassword } from "../Helpers/authhelper.js";
import JWT from "jsonwebtoken"
import { google } from "googleapis";
import { getuserdetails } from "../Helpers/Getuserdetails.js";
import Conversation from "../Models/ConversationModel.js";
export const registercontroller=async(req,res)=>{
    try{
      console.log(req.body);
       const {name,password,email,profile_pic}=req.body;
       //checking if the user already exists or not  
        let user = await User.findOne({ email: email }); 
        //console.log(user);
        if (user) {return res.send({success:false,message:"already registred"});}
        //creating a new user and saving it to the database
        const hashedpassword=await hashPassword(password);
        user =await new User({ name, password:hashedpassword, email, profile_pic}).save();
        //sending back the response with status code and json data of the created user
        res.status(201).send({success:true,
           message: 'User has been created',
           user});
    }catch(err){
        res.send({
           success:false,
           message:"error  in registration",
        })
    }
    }

    export const  logincontroller=async(req,res)=> {
        try{
           const {email,password}= req.body;
         //  if(!email && !password ) return res.status(400).send({success :false, message:'YOU are not registered'});
           
           //verifying the password using the helpers function
           let user = await User.findOne({ email: email });
           if (!user){ return res.send({success:false,message:'Email does not exist'})}
   else{
           let match=await comparePassword(password,user.password);
           if(!match) {return res.send({success:false,message:'Invalid Password'})}
           else{
           //create token for authentication
           const token= JWT.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});//signing the payload which contains _id of the user
           // didnot do await JWT as await has no effect on it
           
           res.cookie('token',token,{http:true,secure:true}).send({// .cookie i found in gfg cookie-parser article
            success:true,
            message: 'login successful',
         token:token});}
         }
           // http:true -Ensures the cookie is only sent over HTTP(S) and not accessible via JavaScript
// secure:true  // Ensures the cookie is only sent over HTTPS
           
        }
        catch(err){
           res.send({
               success:"false",
               message:err.message
           })
       }
   
    }
    
    
export const userdetails=async (req,res)=>{
    try{
    const token=req.cookies.token || "";
    // console.log("token:-",req.cookies);
    const user=await getuserdetails(token);
    res.send({
        success:true,
        data:user
    })
    }
    catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
}
export const googleauth=async(req,res)=>{
    
    try{
       const {code}=req.query;
       const x=process.env.GOOGLE_CLIENT_ID;
       const y=process.env.GOOGLE_CLIENT_SECRET
       const oauth2Client = new google.auth.OAuth2(
        x,y,
        
        "postmessage"
      );
       const tokenres = await oauth2Client.getToken(code)// from the code sent token is get
        oauth2Client.setCredentials(tokenres.tokens);
    //    console.log(tokenres.tokens);
       const info=await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenres.tokens.access_token}`);// from the token we get info about the user that we mentioned in scopes in google cloud 
       //console.log(info);
       const {email}=info.data
       let user = await User.findOne({ email: email });
       if (!user){ return res.send({success:false,message:'Email does not exist'})}
else{
 
       
       //create token for authentication
       let token= JWT.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});//signing the payload which contains _id of the user
       // didnot do await JWT as await has no effect on it
       
       res.cookie('token',token,{http:true,secure:true}).send({// .cookie i found in gfg cookie-parser article
        success:true,
        message: 'login successful',
        token:token});
     }

     
       
    }
    catch(err){
        res.send({
            success:false,
            message:err.message,
           })
    }
}
export const updateinfocontroller=async (req,res)=> {
    try{
      const {id,name,profile_pic}=req.body;
      //console.log(req.body);
      let user=await User.findById(id);
      //console.log(user);
      let updateduser="";
      if(profile_pic==="abcd"){
        updateduser=await User.findByIdAndUpdate(id,{
            name:name || user.name,
            profile_pic:""
          },
          {new:true});
      }
      else{ 
        updateduser=await User.findByIdAndUpdate(id,{
        name:name || user.name,
        profile_pic:profile_pic || user.profile_pic
      },
      {new:true});
    }
     // console.log(updateduser)
      res.send({
        success:true,
        message:"Update successful",
        updateduser
      })
    }
    catch(err){
        res.send({
            success:false,
            message:"update not successful"
        })
    }
}
export const searchcontroller=async(req,res)=>{
  const {id,keyword}=req.params;
  try{
const users=await User.find({_id:{$ne:id},
    $or : [{name: {$regex:keyword,$options:"i"} }//regex means regular expression,searches according to the keyword ,$options:i says case insensitive
    
    ]}).select("-password")
   // console.log(users)
    res.send({
        success:true,
        message:"searched",
        users
    })
}
catch(err){
    res.send({
        success:false,
        message:err.message
    })
}
}
export const conversationcontroller=async(req,res)=>{
    try{
    const {id,rid}=req.params;
    const getconversation=await Conversation.findOne({
        "$or":[{ sender:id,receiver:rid },
                {sender:rid,receiver:id }
            ]
    });
    res.send({success:true,
        converse:getconversation?.message || []});
}
catch(err){
    res.send({
        success:false,
        message:err.message
    })
}
}

// export const conversedcontroller=async(req,res)=>{
//     try{
//     const {id}=req.params;
//     // console.log(id);
//     const allusers=await Conversation.find( {"$or":[{ sender:id },
//     {receiver:id }
//     ]}).select("-message");
//     // console.log(allusers);
//     const theusers=new Set();
//     for(let i=0;i<allusers.length;i++){
//         if(id!=allusers[i].receiver){
//         theusers.add(allusers[i].receiver.toString());
//         }
//         if(id!=allusers[i].sender){
//         theusers.add(allusers[i].sender.toString());
//         }
//     }
   
//     // console.log("the set",theusers);
//     const usersarr=Array.from(theusers);
//     const conusers=await User.find({ _id: { $in: usersarr } });

//     // console.log("the arr",conusers);
//     res.send({
//         success:true,
//         conusers
//     })
//     }
//     catch(err){
//         res.send({
//             success:false,
//             message:err.message,
//         })
//     }
// }
export const forgotcontroller=async(req,res)=>{
    try{
      
    const {email}=req.body;
    let user= await User.findOne({email:email}).select("-password");  // i forgot to write await here.The problem i faced was that the user was not found.
    // console.log(user);
    if(!user){
      return res.send({success:false,message:"You are not registered"});
    }
    
    else{
      //create token for authentication
      const token= JWT.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1d'});
      res.send({
       success:true,
       message: 'successful',
       token:token,
      user}
    );}
  }
  catch(err){
    res.send({
        success:false,
        message:"login error"
    })
  }
  
  }