import mongoose, { mongo } from "mongoose";

let userbehaviordataSchema = new mongoose.Schema({
     userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
     }, 
  moodlevel: Number,      
  sleepHours: Number,
  stressLevel: Number,    
  peerInfluence: Number,   
  dailyActivity: String,
},{ timestamps: true });

export const UserBehaviorData = mongoose.model("userbehaviordata",userbehaviordataSchema);