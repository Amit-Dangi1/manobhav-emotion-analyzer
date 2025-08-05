import { validationResult } from "express-validator";
import { Contact } from "../model/contact_model.js";

export const contactus = async(request,response,next)=>{
    try {
        let userId = request.user._id
        let{name,email,subject,message} = request.body;
        let errorValidator = validationResult(request);
        if(!errorValidator.isEmpty())
            return response.status(401).json({message:errorValidator.array()[0].msg})
          let isContact = await Contact.create({userId,name,email,subject,message});
          if(!isContact)
            return response.json({message:"Oops! Somthing went wrong"})
            return response.json({message:"Thanks! We’ll be in touch soon."})
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
}