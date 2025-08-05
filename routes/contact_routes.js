import express from "express";
import { contactus } from "../contoller/contact_controller.js";
import { authuser } from "../middleware/auth.js";

let router = express.Router();

router.post("/",authuser,contactus);

export default router;