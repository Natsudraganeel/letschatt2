import { GoogleGenAI } from "@google/genai";
import axios from "axios"
export const translatecontroller=async(req,res)=>{
  try{
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
const {content}=req.body;
// console.log("content",content);
if(!content.text){
 return  res.send({
    success:false,
    message:"No content to show"
  })
}
     const prompt = `translate the following text into English.
return only the translated text and nothing else.donot add any explanation.
Text: ${content.text}`
const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",//2.5 was giving typefetch error sometimes.so we can also use 1.5 model or 2.0
    contents: {text:prompt},
  });
  // console.log("response",response.text);


  res.send({
    success:true,
    message:response.text
  })
  }
  catch(err){
    res.send({
      success:false,
    message:err.message
    })
  }
}
export const imagedescriptor=async(req,res)=>{
  try{
    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
   let {content}=req.body;
   content=content.substring(0,4)+'s'+content.substring(4);
   const response=await axios.get(content,{responseType:'arraybuffer'});// responseType:arraybuffer gives us binary data
   const base64 = Buffer.from(response.data, 'binary').toString('base64');// binary data encoded to base64 so that the data can be passed over to gemini api.
   const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64,
    },
  },
  { text: "Give me a brief context of this image in 4-5 lines only" },
];
const ans= await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
console.log(content,ans);
   res.send({
    success:true,
    message:ans.text
   })
  }
  catch(err){
    res.send({
      success:false,
      message:err.message
    })
  }
}
export const videodescriptor=async(req,res)=>{
  try{
   const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
 let {content}=req.body;
   content=content.substring(0,4)+'s'+content.substring(4);
   const response=await axios.get(content,{responseType:'arraybuffer'});// responseType:arraybuffer gives us binary data
   const base64 = Buffer.from(response.data, 'binary').toString('base64');// binary data encoded to base64 so that the data can be passed over to gemini api.
   const contents = [
  {
    inlineData: {
      mimeType: "video/mp4",
      data: base64,
    },
  },
  { text: "Please summarize this video in atleast 4-5 lines." },
];
const ans= await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
   res.send({
    success:true,
    message:ans.text
   })
  }
  catch(err){
    res.send({
      success:false,
      message:err.message
    })
  }
}
