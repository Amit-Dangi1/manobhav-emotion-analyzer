import mongoose from "mongoose";

let predictionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    result:String,
    predictionaccuracy:Number
});

export const Prediction = mongoose.model("prediction",predictionSchema);