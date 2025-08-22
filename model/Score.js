 import mongoose from "mongoose";
 
 
 const scoreSchema = new mongoose.Schema({
  total_score: {
    type: String,
    required: true,
   },
  what_it_means: {
    type: String,
    required: true
  },
  detailed_meaning_and_actions: {
    type: String,
    required: true
  },
  inspiring_quote: {
    type: String,
    required: true
  },
  call_to_action: {
    type: String,
    required: true
  }
});

 
export const Score = mongoose.model('score', scoreSchema);

 