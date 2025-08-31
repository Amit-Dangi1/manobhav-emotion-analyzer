import bodyParser from "body-parser";
import express from  "express";
import mongoose from "mongoose";
 import cookieParser from "cookie-parser";
import cors from "cors";
 import UserRouter from "./routes/user_routes.js";
import UserBehaviorRouter from "./routes/userbehavior_routes.js";
import AdminRouter from "./routes/admin_routes.js";
import PredictRouter from "./routes/prediction_routes.js";
import ContactRouter from "./routes/contact_routes.js";
import JournalRouter from "./routes/dailyjournal_routes.js";
import ExcerciseRouter from "./routes/exercise_routes.js";
import ScoreRouter from "./routes/score_routes.js";
let app = express();
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.DB_URL).then(()=>{
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(cookieParser());   
    app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true                 // This allows cookies to be sent
}))

    app.use("/admin",AdminRouter);
    app.use("/admin/excercise",ExcerciseRouter)
    app.use("/user",UserRouter);
    app.use("/userbehaviour",UserBehaviorRouter);
    app.use("/predict",PredictRouter);
    app.use("/contact",ContactRouter);
    app.use("/journal",JournalRouter)
    app.use("/score",ScoreRouter)
    app.listen(process.env.PORT,()=>{
        console.log("Server Started...");        
    })
    

}).catch(err=>{
    console.log(err);
    
})