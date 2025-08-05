import { validationResult } from "express-validator";
import { User } from "../model/user_model.js";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";
import dotenv from 'dotenv';
dotenv.config();

 

export const create = async(request,response,next)=>{
    try {
        let{name,email,password,age} = request.body;
        let errorValidator = validationResult(request);

        if(!errorValidator.isEmpty())
            return response.status(401).json({error:"Bad request",message:errorValidator.array()[0].msg});

        let isEmail = await User.findOne({email});
        if(isEmail)
            return response.status(409).json({message:"Email already exists"});

        let salt = await bcrypt.genSalt(12);
        password = await bcrypt.hash(password,salt);
        const user = await User.create({name,email,password,age});
         return response.status(201).json({message:"SignUp Successfull"});
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};

export const login = async(request,response,next)=>{
    try {
        let{email,password} = request.body;
        let errorValidator = validationResult(request);
        if(!errorValidator.isEmpty())
            return response.status(401).json({error:"Bad request",message:errorValidator.array()[0].msg});

        let isEmail = await User.findOne({email});
        if(!isEmail)
            return response.status(401).json({message:"Invalid email | Incorrect email"})
       let isMatch = bcrypt.compareSync(password,isEmail.password);
       if(!isMatch)
        return response.status(401).json({message:"Invalid Password | Incorrect password"});
       response.cookie("token",generateToken(isEmail._id,email),{
  httpOnly: true,
  secure: false, // use true in production with https
  sameSite: "lax"
});
// console.log("isEmail = ",isEmail);

       return response.status(201).json({message:"Login Successful",user:isEmail});

    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};

export const getUser = async(request,response,next)=>{
    try {
        let{userId} = request.params;
console.log("getUser = ",request.user._id);

        let isUser = await User.findOne({_id:userId});
        if(!isUser)
        return response.status(404).json({message:"No User Found"});
        return response.status(201).json({message:"User Found",data:isUser});
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};

export const userupdate = async(request,response,next)=>{
    try {
        
        let{userId} = request.params;
        let{name,email,age} = request.body;
        let errorValidator = validationResult(request);
        if(!errorValidator.isEmpty())
            return response.status(401).json({error:"Bad request",message:errorValidator.array()[0].msg});

        let isUser = await User.findOne({_id:userId});
        if(!isUser)
            return response.status(404).json({message:"No User Found"});
        let updateuserdata = await User.updateOne({_id:userId},{name,email,age});
        if(!updateuserdata.modifiedCount>0)
            return response.status(201).json({message:"No Data Update"});
            return response.status(201).json({message:"Data Update"});
         

    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};

export const userdelete = async(request,response,next)=>{
  try {
    let{userId} = request.params;
    let isUser = await User.findOne({_id:userId});
    if(!isUser)
        return response.status(404).json({message:"No User Found"});
    let isDelete = await User.deleteOne({_id:userId});
    return response.status(201).json({message:"Deleted Successful"});
  } catch (error) {
    console.log(error);
    return response.status(500).json({message:"Internal Server Error"});
    
  }
};

export const logout = (request,response,next)=>{
    try {
        response.clearCookie("token");
        return response.status(201).json({message:"LogOut Successful"});
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
}

function generateToken(_id,email){
    let payload = {_id,email};
    let token = jwt.sign(payload,process.env.SECRET_KEY);

    return token;
};