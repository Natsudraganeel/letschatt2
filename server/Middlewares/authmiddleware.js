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
      if(error.name==="TokenExpiredError"){// token expired
        return res.send({succes:false,message:"Session Expired.Relogin!"});
      }
      if(error.message==="jwt must be provided"){// the user is not logged in
        return res.send({succes:false,message:"Please Login!!"});
      }
     return res.send({succes:false,message:error.message});
    }
  };
