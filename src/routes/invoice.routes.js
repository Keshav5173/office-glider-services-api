// import express from 'express';
import { Router } from 'express';
import invoiceController from '../controller/invoice.controller.js';

const router = Router();

router.get('/create', invoiceController.getInvoices);



export default router;