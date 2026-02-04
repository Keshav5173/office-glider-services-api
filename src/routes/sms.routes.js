import { Router } from "express";
import smsController from "../controller/sms.controller.js";


const router = Router();

router.post("/otp", smsController.sendOtp);


export default router;