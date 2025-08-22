import { validationResult } from "express-validator";
import { Excercise } from "../model/excercise_model.js";

export const addexcercise = async(request,response,next)=>{
    try {
        let validator = validationResult(request)
        if(!validator.isEmpty())
            return response.status(400).json({message:"Bad request",error:validator.array()[0].msg})
        let{name,description,imgurl,quote} = request.body;
        let create = await Excercise.create({description,imgurl,quote});
        if(!create)
            return response.json({message:"Excercise not Add"})
            return response.status(201).json({message:"Excercise Added"})


    } catch (error) {
        console.log(error);
        return response.status(500).json("Internal Server Error");
        
    }
}
export const getExcercise = async(request,response,next)=>{
    try {
        let data = await Excercise.find();
        return response.status(200).json({message:"All Data Fetched",data})
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Erorr"})
        
    }
}