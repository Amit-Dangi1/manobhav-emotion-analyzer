import bodyParser from "body-parser";
import express from  "express";
import mongoose from "mongoose";
 import cookieParser from "cookie-parser";
import cors from "cors";
 import UserRouter from "./routes/user_routes.js";
import UserBehaviorRouter from "./routes/userbehavior_routes.js";
import AdminRouter from "./routes/admin_routes.js";
import PredictRouter from "./routes/prediction_routes.js";
let app = express();
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.DB_URL).then(()=>{
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(cookieParser());   
    app.use(cors({
  origin: "http://localhost:5173",  // your frontend
  credentials: true                 // This allows cookies to be sent
}))

    app.use("/admin",AdminRouter);
    app.use("/user",UserRouter);
    app.use("/userbehaviour",UserBehaviorRouter);
    app.use("/predict",PredictRouter)
   
    app.listen(process.env.PORT,()=>{
        console.log("Server Started...");        
    })
    

}).catch(err=>{
    console.log(err);
    
})