// src/controllers/encounter.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface for request body when creating an Encounter
interface CreateEncounterRequestBody {
  patientId: string;
  date: string; // Date string (e.g., "YYYY-MM-DD")
  type: string;
  description?: string;
}

// --- GET All Encounters ---
export const getEncounters = async (_: Request, res: Response) => {
  try {
    const encounters = await prisma.encounter.findMany({
      include: {
        patient: { // Include related patient data
          select: { id: true, name: true, nik: true }
        }
      },
      orderBy: {
        createdAt: 'desc' // Order by creation date, newest first
      }
    });
    res.json(encounters);
  } catch (error) {
    console.error("Error fetching encounters:", error);
    res.status(500).json({ error: 'Failed to retrieve encounter data', detail: error });
  }
};

// --- CREATE New Encounter ---
export const createEncounter = async (req: Request<any, any, CreateEncounterRequestBody>, res: Response) => {
  const { patientId, date, type, description } = req.body;
  try {
    // Basic input validation
    if (!patientId || !date || !type) {
      return res.status(400).json({ error: 'Patient ID, Date, and Type are required.' });
    }

    // Ensure the patient exists
    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId }
    });
    if (!patientExists) {
      return res.status(404).json({ error: 'Patient with the provided ID not found.' });
    }

    const newEncounter = await prisma.encounter.create({
      data: {
        patientId,
        date: new Date(date), // Convert date string to Date object
        type,
        description,
      },
      include: {
        patient: { // Include related patient data in the response
          select: { id: true, name: true, nik: true }
        }
      }
    });
    res.status(201).json(newEncounter);
  } catch (error: any) {
    console.error("Error creating encounter:", error);
    res.status(400).json({ error: 'Failed to add encounter', message: error.message, detail: error });
  }
};
