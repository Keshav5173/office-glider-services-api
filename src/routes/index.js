import invoiceRouter from './invoice.routes.js';
import smsRouter from './sms.routes.js';
import fcmNotificationRouter from "./fcmNotification.routes.js"
// import express from 'express';
import { Router } from 'express';

const router = Router();




router.use('/invoice', invoiceRouter);
router.use('/sms', smsRouter);
router.use("/fcm", fcmNotificationRouter);

export default router;


