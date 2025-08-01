import express from "express";
import { addmoodelevel, create, login, verified } from "../contoller/admin_controller.js";

let router  = express.Router();

router.post("/create",create);
router.get("/verification",verified);
router.post("/login",login);
router.post("/addmoodlevel",addmoodelevel);


export default router;