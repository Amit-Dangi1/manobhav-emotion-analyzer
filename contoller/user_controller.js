import { validationResult } from "express-validator";
import { User } from "../model/user_model.js";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";
import nodemailer from "nodemailer";

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

        sendEmail(email,name,usertokengenerate(name,email,password,age))
         return response.status(201).json({message:"We’ve sent a verification email to your email Id. Please check your inbox"});
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

// -----------------------------------------------


export const verified = async(request,response,next)=>{
    try {
        let{token} = request.query;
        let decode = jwt.verify(token,process.env.SECRET_KEY);
        let{name,email,password,age} = decode;

        let salt = await bcrypt.genSalt(12);
        password = bcrypt.hashSync(password,salt);
        let user = await User.create({name,email,password,age});
        if(!user)
        return response.status(201).json({message:"User Signup  Failed"})
        return response.status(201).json({message:"User Signup Succesfull"})
         
     } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Errro"})
        
    }
};

let sendEmail = (email,name,token)=>{
     return new Promise((resolve,reject)=>{
let transporter = nodemailer.createTransport({
    
       service: "gmail",
  auth: {
    user: process.env.EMAIL,          // dhyaan: case sensitive ENV
    pass: process.env.EMAIL_PASSWORD
  }
});
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Connection Error:", err);
  } else {
    console.log("SMTP Server is ready to take our messages ✅");
  }
});
let mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'Account Verification',
  html:  `<div style="font-family: 'Segoe UI', sans-serif; max-width:600px; margin:auto; padding:20px; border:2px solid silver; border-radius:10px; background-color:#f9f9f9;">
  
  <!-- Greeting -->
  <p style="color:black; text-align:center; margin-bottom:20px; font-size:16px;">
    Dear <span style="font-family:'Helvetica Neue', Arial, sans-serif; font-weight:700; color:#3dbec4; font-size:20px;">
      ${name}
    </span>,<br>
    Thank you for registering with <strong>MANOBHAV</strong>! 🎉<br>
    To verify your account, please click the button below:
  </p>

  <!-- Verification Button -->
  <p style="text-align:center; margin:30px 0;">
    <a href="https://manobhav-emotion-analyzer.onrender.com/user/verification?token=${token}" 
       style="
         padding:12px 24px;
         background-color:#3dbec4;
         color:white;
         text-decoration:none;
         border-radius:20px;
         font-size:16px;
         font-weight:500;
         box-shadow:0 4px 10px rgba(0,0,0,0.1);
         display:inline-block;
         transition: background-color 0.3s ease;
       "
       onmouseover="this.style.backgroundColor='#35a9b0'" 
       onmouseout="this.style.backgroundColor='#3dbec4'">
      Verify Account
    </a>
  </p>

 

  <!-- Additional Info -->
  <p style="color:#555; font-size:14px; text-align:center;">
    By verifying your account, you can securely access your personalized dashboard, track your progress, and use all features MANOBHAV offers.
  </p>

  <p style="color:#555; font-size:14px; text-align:center;">
    If you did not register for MANOBHAV, please ignore this email.
  </p>

  <!-- Signature -->
  <p style="color:#888; font-size:14px; text-align:center; margin-top:30px;">
    Best regards,<br>
    <strong>MANOBHAV Team</strong>
  </p>

</div>
`
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

function usertokengenerate(name,email,password,age){
    let payload = {name,email,password,age}
    let token =  jwt.sign(payload,process.env.SECRET_KEY);
    return token;
}

export const passwordSet = async(request,response,next)=>{
  try {
    let{email,password} = request.body;
    let validator = validationResult(request);
    if(!validator.isEmpty())
      return response.status(402).json({message:"Bad",error:validator.array()[0].msg});

    let isUser = await User.findOne({email});
    if(!isUser)
      return response.json({message:"Invalid email"});
    let token = passwordSetToken(isUser._id,isUser.email,password);
    await sendEmailPassword(isUser.email,isUser.name,token)
    console.log("email send token = ",token);
    
      return response.status(201).json({message:"We send email on email Id to set your password",token});
    
  } catch (error) {
    console.log(error);
    return response.status(500).json({message:"Internal Server Error"});
    
  }
};

export const updatepassword = async(request,response,next)=>{
  try {
       let{token} = request.query;
        let decode = jwt.verify(token,process.env.SECRET_KEY);
        let{email,password} = decode;
    // console.log("updatepassword token = ",request.query.token);
    if(request.query==undefined)
      return response.status(401).json({message:" This link is expire. Try again",});

     
     if(token==undefined || !token)
      return response.status(401).json({message:" This link is expire. Try again",});
   
    let isUser = await User.findOne({email});
    if(!isUser)
      return response.status(401).json({message:"Invalid email"});

    password = await bcrypt.hash(password, 12);

   let isUser1 = await User.findOneAndUpdate({ email},{ $set: { password}},{ new: true});
if(!isUser1)
    return response.json({message:"Password Not Update || Invalid email"})
    return response.status(201).json({message:"Password Updated"})

     
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(401).json({message: "Link has expired. Please request a new password reset link.",
      });
    }
    console.log(error);
    
    return response.status(500).json({message:"Internal Server Error"});
    
  }
};


let sendEmailPassword = (email,name,token)=>{
     return new Promise((resolve,reject)=>{
let transporter = nodemailer.createTransport({

       service: "gmail",
         auth: {
    user: process.env.EMAIL,          
    pass: process.env.EMAIL_PASSWORD
  }
});

let mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'Set Your Password - MANOBHAV',
  html:  `<div style="font-family: 'Segoe UI', sans-serif; max-width:600px; margin:auto; padding:20px; border:2px solid silver; border-radius:10px; background-color:#f9f9f9;">
  
  <!-- Greeting -->
  <p style="color:black; text-align:center; margin-bottom:20px; font-size:16px;">
    Hello <span style="font-family:'Helvetica Neue', Arial, sans-serif; font-weight:700; color:#3dbec4; font-size:20px;">
      ${name}
    </span>,<br>
    Welcome to <strong>MANOBHAV</strong>! 🎉<br>
    To activate your account, please set your password by clicking the button below:
  </p>

  <!-- Password Setup Button -->
            
             <input type="hidden" name="token" value=${token}" />

  <p style="text-align:center; margin:30px 0;">
    <a href="https://manobhav-emotion-analyzer.onrender.com/user/password/set-password2?token=${token}" 
       style="
         padding:12px 24px;
         background-color:#3dbec4;
         color:white;
         text-decoration:none;
         border-radius:20px;
         font-size:16px;
         font-weight:500;
         box-shadow:0 4px 10px rgba(0,0,0,0.1);
         display:inline-block;
         transition: background-color 0.3s ease;
       "
       onmouseover="this.style.backgroundColor='#35a9b0'" 
       onmouseout="this.style.backgroundColor='#3dbec4'">
      Set Password
    </a>
  </p>

  <!-- Additional Info -->
  <p style="color:#555; font-size:14px; text-align:center;">
    This link is valid for <strong>5 minutes</strong> for security reasons.  
    After setting your password, you can log in and start using all the features of MANOBHAV.
  </p>

  <p style="color:#555; font-size:14px; text-align:center;">
    If you did not request this, please ignore this email or contact our support team immediately.
  </p>

  <!-- Signature -->
  <p style="color:#888; font-size:14px; text-align:center; margin-top:30px;">
    Best regards,<br>
    <strong>MANOBHAV Team</strong>
  </p>

</div>
`
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


function passwordSetToken(_id,email,password){
  let payload = {_id,email,password};
  let token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"5m"})
  return token;
};

// export const passwordSetDone = async(request,response,next)=>{
//   try {
//     let{email,password} = request.body;
// password = await bcrypt.hash(password, 12);

// let isUser = await User.findOneAndUpdate({ email},{ $set: { password}},{ new: true});
// if(!isUser)
//     return response.json({message:"Password Not Update || Invalid email"})
//     return response.status(201).json({message:"Password Updated"})

//   } catch (error) {
//     console.log(error);
//     return response.status(500).json({message:"Internal Server Error"})
    
//   }
// }