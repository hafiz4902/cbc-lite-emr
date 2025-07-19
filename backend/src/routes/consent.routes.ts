// src/routes/consent.routes.ts
import { Router } from 'express';
import { createConsentForm, getConsentForms } from '../controllers/consent.controller';

const router = Router();

router.post('/', createConsentForm); // CREATE a new consent form
router.get('/', getConsentForms);   // GET all consent forms

export default router;
