import invoiceRouter from './invoice.routes.js';
import smsRouter from './sms.routes.js';
// import express from 'express';
import { Router } from 'express';

const router = Router();




router.use('/invoice', invoiceRouter);
router.use('/sms', smsRouter);

export default router;


