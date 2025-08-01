import express from "express";
import { create, getUser, login, logout, userdelete, userupdate } from "../contoller/user_controller.js";
import { body } from "express-validator";
import { auth, authuser } from "../middleware/auth.js";

const router = express.Router();

router.post("/create",body("name","name required").notEmpty(),body("email","email required").notEmpty(),
body("email","Invalid email").isEmail(),body("age","age required").notEmpty(),body("password","password required").notEmpty(),create);

router.post("/login",login);
router.get("/logout",authuser ,logout);

router.get("/:userId",authuser,getUser);

router.put("/:userId",body("name","name required").notEmpty(),body("email","email required").notEmpty(),
body("email","Invalid email").isEmail(),body("age","age required").notEmpty(),authuser,userupdate);

router.delete("/:userId",authuser,userdelete);

export default router;