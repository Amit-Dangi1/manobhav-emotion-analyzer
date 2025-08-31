import { request, response } from "express";
import { validationResult } from "express-validator";
import { DailyJournal } from "../model/dailyjournal_model.js";


export const create = async(request,response,next)=>{
    try {
    let _id1 = request.user._id;
    let validator = validationResult(request);
    if(!validator.isEmpty())
        return response.status(400).json({error:validator.array()[0].msg})
    let{entry} = request.body;
    let dailyentry = await DailyJournal.findOneAndUpdate({userId:_id1},{$push:{entry}},{upsert:true,new:true})
    return response.status(201).json({message:"Entry Added"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
        

    }
};

export const getAll = async(request,response,next)=>{
    try {
        let _id = request.user._id;
        console.log("_id jornl fecth= ",_id);
        
        let entrydata = await DailyJournal.findOne({userId:_id});
        if(!entrydata)
        return response.status(200).json({message:"No Entry Found"})

        console.log(entrydata);
        
        return response.status(201).json({data:entrydata.entry})
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};

export const deleteEntry = async(request,response,next)=>{
    try {
        let index1 =Number(request.params.index);
           let id = request.user._id;


        let isLength = await DailyJournal.findOne({userId:id});
        let validateLength =  isLength.entry.length-1;
         
        if(index1>validateLength)
            return response.json({message:"Length is Invalid"})
        
        
         let isDelete = await DailyJournal.findOneAndUpdate(
            { userId: id },
              [
        {
          $set: {
            entry: {
              $concatArrays: [
                { $slice: ["$entry", index1] }, // before
                { 
                  $slice: [
                    "$entry", 
                    index1 + 1, 
                    { $subtract: [ { $size: "$entry" }, index1 + 1 ] } // remaining length
                  ] 
                }
              ]
            }
          }
        }
      ],
            { new: true }
        );

    if(!isDelete)
return response.status(404).json({message:"No Data Found"});
return response.status(201).json({message:"Data Removed",data:isDelete});        

    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
}