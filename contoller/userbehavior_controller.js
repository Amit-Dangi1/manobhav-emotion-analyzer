import { validationResult } from "express-validator";
import { UserBehaviorData } from "../model/userbehaviordata_model.js";

export const userbehaviordata = async(request,response,next)=>{
    try {
        // console.log("userbehaviordata = ",request.user._id);

         
        let{moodlevel,sleepHours,stressLevel,peerInfluence,dailyActivity} = request.body;
        let errorValidator = validationResult(request);
        let _id1 = request.user._id;
        
        if(!errorValidator.isEmpty())
            return response.status(401).json({message:"Bad request",error:errorValidator.array()[0].msg});
         let userbehavior = await UserBehaviorData.create({moodlevel,sleepHours,stressLevel,peerInfluence,dailyActivity,userId:_id1});
         return response.status(201).json({message:"Form Submitted"});
        
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"})
        
    }
};

export const getAll = async(request,response,next)=>{
    try {
        let alldata = await UserBehaviorData.find({userId:request.user._id}).populate("userId");
        if(!alldata)
            return response.status(404).json({message:"No Data Found"});
            return response.status(201).json({message:"Data Found",alldata});
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};