import mongoose from "mongoose";

let dailyjournalSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"user",
         unique:true
    },
   entry:[{type:String}]
})

export const DailyJournal = mongoose.model("dailyjournal",dailyjournalSchema);