// src/routes/encounter.routes.ts
import { Router } from 'express';
import { getEncounters, createEncounter } from '../controllers/encounter.controller';

const router = Router();

router.get('/', getEncounters); // GET all encounters
router.post('/', createEncounter); // CREATE a new encounter

export default router;
