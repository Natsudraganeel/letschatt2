import bcrypt from "bcrypt"

export  const hashPassword = async (password)=>{
    try{
     const salt=8;
     const hashedpassword=bcrypt.hash(password,salt)
return hashedpassword;
    }
    catch(err){
        console.log(err);
    }
}
export const comparePassword=async(password,hashedpasswordpassword)=>{
    return   bcrypt.compare(password,hashedpasswordpassword);
}