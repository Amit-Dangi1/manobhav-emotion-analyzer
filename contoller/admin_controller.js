import { validationResult } from "express-validator";
import { Admin } from "../model/admin_model.js";
import jwt from "jsonwebtoken";
import brypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
import { request, response } from "express";
import { User } from "../model/user_model.js";
import {MoodLevel } from "../model/moodlevels_model.js";
 dotenv.config();

export const create = async(request,response,next)=>{
    try {
        let{name,email,password,role} = request.body;
        const errorValidator = validationResult(request);
        if(!errorValidator.isEmpty())
            return response.status(401).json({message:"Bad request",error:errorValidator.array()[0].msg});
        sendEmail(email,name,usertokengenerate(name,email,password,role))
        return response.status(201).json({message:"We send email on your mail"});
    } catch (error) {
        console.log(error);
        
        
    }
};

export const login = async(request,response,next)=>{
    try {
        let{email,password} = request.body;
        let errorValidator = validationResult(request);
        if(!errorValidator.isEmpty())
            return response.status(401).json({message:"Bad request",error:errorValidator.array()[0].msg});
        let isEmail = await Admin.findOne({email});
        if(!isEmail)
            return response.status(404).json("Invalid Email")
          let isPassword = brypt.compareSync(password,isEmail.password);
          if(!isPassword)
        return response.status(404).json({message:"Invalid Password"});
      response.cookie("token",usertokengenerate(isEmail.name,isEmail.email,isEmail.password,isEmail.role))
        return response.status(201).json({message:"Login Successfull..."});
        
    } catch (error) {
        console.log(error);

        
    }

};

export const verified = async(request,response,next)=>{
    try {
        let{token} = request.query;
        let decode = jwt.verify(token,process.env.Admin_Key);
        let{name,email,password,role} = decode;

        let salt = await brypt.genSalt(12);
        password = brypt.hashSync(password,salt);
        let admin = await Admin.create({name,email,password,role});
        if(!admin)
        return response.status(201).json({message:"Admin Signup  Failed"})
        return response.status(201).json({message:"Admin Signup Succesfull"})
         
     } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Errro"})
        
    }
};

export const getAllUser = async(request,response,next)=>{
  try {
    let isAll = await User.find();
    if(!isAll)
      return response.status(404).json({message:"No User"});
      return response.status(201).json({users:isAll});
  } catch (error) {
    console.log(error);
    response.status(500).json({message:"Internal Server Error"});
    
  }
}
let sendEmail = (email,name,token)=>{
     return new Promise((resolve,reject)=>{
let transporter = nodemailer.createTransport({
    
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

let mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'Account Verification',
  html: `<div style = "border:2px solid silver;border-radius:10px;padding:20px;">
  <p style="color: #333;text-align: center;font-family: 'Segoe UI', sans-serif ;margin-bottom: 20px;">Dear <span style="font-family: 'Helvetica Neue', Arial, sans-serif;font-weight: 700;color:purple;font-size:20px"> ${name}</span> <br>Thank you for registration. <br> To verify account please click on below button</p>
      
  <a  style="
  padding: 12px 24px;
  background-color: #007bff;
  text-align: center;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;"
 href="http://localhost:3000/admin/verification?token=${token}">Verifcation</a>
 <br><br></div>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    reject(error)
  } else {
    console.log('Email sent: ' + info.response);
    resolve(true);
  }
})})};

function usertokengenerate(name,email,password,role){
    let payload = {name,email,password,role}
    let token =  jwt.sign(payload,process.env.Admin_Key);
    return token;
}

export let addmoodelevel = async(request,response,next)=>{
  try {
    let{moodlevel,feeling,suggestions,quote,activity} = request.body;
    let errorValidator = validationResult(request);
    if(!errorValidator.isEmpty())
      return response.status(401).json({message:errorValidator.array()[0].msg});
     let MoodLevel1 = await MoodLevel.create({moodlevel,feeling,suggestions,quote,activity});
     if(!MoodLevel1)
      return response.status(402).json({message:"No Data Add"})
      return response.status(201).json({message:"Data Add"})
  } catch (error) {
    console.log(error);
    return response.status(500).json({message:"Internal Server Error"});
    
  }
};

