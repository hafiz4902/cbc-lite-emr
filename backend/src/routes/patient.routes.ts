// src/routes/patient.routes.ts
import { Router } from 'express';
import { getPatients, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';

const router = Router();

router.get('/', getPatients); // GET all patients
router.post('/', createPatient); // CREATE a new patient
router.put('/:id', updatePatient); // UPDATE a patient by ID
router.delete('/:id', deletePatient); // DELETE a patient by ID

export default router;
