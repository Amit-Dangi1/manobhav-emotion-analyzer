import express from "express"
import { createScore, getScoreByRange } from "../contoller/score_controller.js";

let router = express.Router();

router.post("/add",createScore);
router.get("/check_score/:range",getScoreByRange);
export default router;
