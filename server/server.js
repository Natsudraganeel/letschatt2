import express from "express"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./db.js";
import dotenv from "dotenv"
import authroutes from "./Routers/Authroute.js"
import gen_ai_routes from "./Routers/gen_ai_route.js"
import cookieParser from "cookie-parser";
import {app,server} from "./socket/index.js"
dotenv.config();

app.use(cors({
    origin : "http://localhost:3001", // to allow cookies to be sent from origin (frontend url ) to backend
    credentials : true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const port =process.env.port || 3000
app.use("/api/auth",authroutes);
app.use("/api/genai",gen_ai_routes);

app.get("/",(req,res)=>{
    res.send({
        message:"working ....."
    });
})
connectDB().then(server.listen(port,()=>{
    console.log(
    "server running on port 3000"
    )
})
)
