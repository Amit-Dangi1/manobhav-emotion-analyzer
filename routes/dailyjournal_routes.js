import express from "express";
 import { authuser } from "../middleware/auth.js";
import { create, deleteEntry, getAll } from "../contoller/dailyjournal_controller.js";

let router = express.Router();

router.post("/add",authuser, create);
router.get("/find",authuser,getAll);
router.delete("/remove/:index",authuser,deleteEntry);

export default router;