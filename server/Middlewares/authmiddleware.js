import JWT from "jsonwebtoken"

export const requiredsignin = async (req, res, next) => {
    try {
         console.log(req.headers.authorization);
      const decode = JWT.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      console.log(req.headers.authorization);// token
      console.log(decode);
     req.user = decode;
      next();
    } catch (error) {
      if(error.name==="TokenExpiredError"){
        return res.send({succes:false,message:"Session Expired.Relogin!"});
      }
     return res.send({succes:false,message:error.message});
    }
  };
