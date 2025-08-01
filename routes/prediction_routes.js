import express from 'express';
import { predictBehavior } from '../contoller/prediction_controller.js';
import { auth, authuser } from '../middleware/auth.js'; 

const router = express.Router()
// router.get('/', predictBehavior);
router.get('/', authuser, predictBehavior);

export default router;
