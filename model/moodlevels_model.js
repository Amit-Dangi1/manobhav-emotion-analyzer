import mongoose from "mongoose";

const moodlevelsSchema = new mongoose.Schema({
    moodlevel:{
        type:Number
    },
    feeling:{
        type:String
    },
    suggestions:{
        type:String
    },
    quote:{
        type:String
    },
    activity:{
        type:String
    }
})

export const MoodLevel = mongoose.model("moodlevel",moodlevelsSchema);