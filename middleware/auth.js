import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


export const auth = (request,response,next)=>{
    try {
        let{token} = request.cookies;
   
        if(!token)
            return response.status(404).json({message:"Invalide Admin"});
    
       let decode = jwt.verify(token,process.env.Admin_Key);
    //    console.log("\n\ndecode = ",decode);
       
       request.user=decode;
       next();
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};
export const authuser = (request,response,next)=>{
    try {
        let{token} = request.cookies;
        console.log("auth token = ",token);
        console.log("Key = ",process.env.SECRET_KEY)
        
        if(!token)
            return response.status(401).json({message:"Invalide user"});
    
       let decode = jwt.verify(token,process.env.SECRET_KEY);
    //    console.log("\n\ndecode = ",decode);
       
       request.user=decode;
       next();
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};