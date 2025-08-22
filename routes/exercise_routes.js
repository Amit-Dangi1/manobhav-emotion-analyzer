import express from "express";
import { addexcercise, getExcercise } from "../contoller/excercise_controller.js";
 import { body } from "express-validator";
import { auth } from "../middleware/auth.js";

let router = express.Router();

router.post("/add",auth,body("name","name is required").notEmpty(),body("description","description is required").notEmpty(),
            body("imgurl","img is required").notEmpty(),body("quote","quote is required").notEmpty(),addexcercise);
router.get("/allexcercise",getExcercise)
export default router;