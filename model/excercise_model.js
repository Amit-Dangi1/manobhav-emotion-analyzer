import mongoose from "mongoose"

let excerciseSchema = new mongoose.Schema({
    namw:{
        type:String
    },
    description:{
        type:String
    },
    imgurl:{
        type:String
    },
    quote:{
        type:String
    },
   
})

export const Excercise = mongoose.model("excercise",excerciseSchema);