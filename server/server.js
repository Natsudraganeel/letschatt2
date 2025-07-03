import express from "express"
import cors from "cors"
import morgan from "morgan"
import connectDB from "./db.js";
import dotenv from "dotenv"
import authroutes from "./Routers/Authroute.js"
import cookieParser from "cookie-parser";
import {app,server} from "./socket/index.js"
dotenv.config();

app.use(cors({
    origin : "https://letschatt2.onrender.com", // to allow cookies to be sent from origin (frontend url ) to backend
    credentials : true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const port =process.env.port || 3000
app.use("/api/auth",authroutes);

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
