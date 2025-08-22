// controllers/scoreController.js

import { Score } from "../model/Score.js";

 
 
export const getAllScores = async (req, res) => { 
  try {
    const scores = await Score.find(); 
    return res.status(200).json({message: 'Data Fetched',results: scores.length,data:{scores}});
  } catch (err) {
    return res.status(500).json({error: 'Internal Server Error'});
  }
};

 export const getScoreByRange = async (req, res) => {  
  try {
    let total_score = Number(req.params.range)
     
     if (total_score >= 0 && total_score <= 4) {
      total_score = "0 – 4"; 
    } else if (total_score >= 5 && total_score <= 9) {
      total_score = "5 – 9"; 
    } else if (total_score >= 10 && total_score <= 14) {
      total_score = "10 – 14"; 
    } else if (total_score >= 15 && total_score <= 19) {
      total_score = "15 – 19"; 
    } else if (total_score >= 20 && total_score <= 27) {
      total_score = "20 – 27";  
    } else if (total_score > 27) {
      total_score = "Above 27";
    } else {
      console.error("Invalid numerical score provided.");
      return res.status(400).json({ message: "Invalid numerical score provided. Please provide a valid number." });
    }
 
    const score = await Score.findOne({ total_score});  
    
    if (!score) {
      return res.status(404).json({error: 'fail', message: 'No score found with that range'
      });
    }

    return res.status(200).json({message: 'Score Matched',score});
  } catch (err) {
    console.log(err);    
    return res.status(500).json({message: 'Internal Server Error'});
  }
};

 
export const createScore = async (req, res) => { 
  try {
    const newScore = await Score.insertMany(req.body);
    return res.status(201).json({message: 'Data Added'});
  } catch (err) {
    return res.status(400).json({message: "Internal Server Error"});
  }
};

