import express from "express";
import { getAll, userbehaviordata } from "../contoller/userbehavior_controller.js";
import { auth , authuser} from "../middleware/auth.js";
import { body } from "express-validator";

let router = express.Router();

router.post("/",authuser,
  body("moodlevel", "moodLevel is required").notEmpty(),
  body("moodlevel", "MoodLevel must be a number between 1 and 10").isInt({ min: 1, max: 10 }),

  
  body("sleepHours", "sleepHours is required").notEmpty(),
  body("sleepHours", "sleepHours must be a number between 1 and 10").isInt({ min: 1, max: 10 }),

  body("stressLevel", "stressLevel is required").notEmpty(),
  body("stressLevel", "stressLevel must be a number between 1 and 10").isInt({ min: 1, max: 10 }),

  body("peerInfluence", "peerInfluence is required").notEmpty(),
  body("peerInfluence", "peerInfluence must be a number between 1 and 10").isInt({ min: 1, max: 10 }),

 
  userbehaviordata
);

router.get("/all",authuser,getAll);

export default router;