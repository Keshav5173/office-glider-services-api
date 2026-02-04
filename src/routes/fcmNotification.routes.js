import { Router } from "express";
import controller from "../controller/notification.controller.js"

const router = Router();

router.post("/sendNotification", controller.sendMultiNotification);


export default router;