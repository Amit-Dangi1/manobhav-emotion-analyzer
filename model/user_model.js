import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    name:String,
  
    email:{
        type:String,
        unique:true,
        required:true
    },
    age:{
        type:Number,
    },
    password:{
        type:String,
        required:true
    },
    // role:{
    //     type:String,
    //     required:true
    // }
});

export const User = mongoose.model("user",userSchema);