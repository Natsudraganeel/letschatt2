
export const  upload=async(file)=>{
const formData=new FormData();
formData.append("file",file);
formData.append("upload_preset","chat-app");
const url=`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/auto/upload` 

//https://cloudinary.com/documentation/upload_images#landingpage
 const ans=await fetch(url,{
    method:"post",
    body:formData
 })
const data=await ans.json();
return data;
}
