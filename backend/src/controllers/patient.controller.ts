// src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- GET All Patients ---
export const getPatients = async (_: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
    });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: 'Failed to retrieve patient data', detail: error });
  }
};

// --- CREATE New Patient ---
export const createPatient = async (req: Request, res: Response) => {
  const { name, nik, birthDate, gender, phone } = req.body;
  try {
    // Frontend handles 16-digit NIK validation.
    // NIK uniqueness is handled by @unique in Prisma schema.

    const newPatient = await prisma.patient.create({
      data: { name, nik, birthDate: new Date(birthDate), gender, phone },
    });
    res.status(201).json(newPatient);
  } catch (error: any) {
    console.error("Error creating patient:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('nik')) {
        // Handle unique constraint violation for NIK
        return res.status(409).json({ message: 'NIK is already registered in the system. Please enter a different NIK.', detail: error });
    }
    res.status(400).json({ error: 'Failed to add patient', message: error.message, detail: error });
  }
};

// --- UPDATE Patient by ID ---
export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, nik, birthDate, gender, phone } = req.body;

  try {
    // Frontend handles 16-digit NIK validation.
    // NIK uniqueness is handled by @unique in Prisma schema.

    const updatedPatient = await prisma.patient.update({
      where: { id: String(id) },
      data: {
        name,
        nik,
        birthDate: birthDate ? new Date(birthDate) : undefined, // Only update if provided
        gender,
        phone,
      },
    });
    res.json(updatedPatient);
  } catch (error: any) {
    console.error("Error updating patient:", error);
    if (error.code === 'P2025') {
      // Handle record not found error
      return res.status(404).json({ error: 'Patient not found.', detail: error });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('nik')) {
        // Handle unique constraint violation for NIK during update
        return res.status(409).json({ message: 'NIK is already registered for another patient. Please enter a different NIK.', detail: error });
    }
    res.status(400).json({ error: 'Failed to update patient data', message: error.message, detail: error });
  }
};

// --- DELETE Patient by ID ---
export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.patient.delete({
      where: { id: String(id) },
    });
    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    console.error("Error deleting patient:", error);
    if (error.code === 'P2025') {
      // Handle record not found error
      return res.status(404).json({ error: 'Patient not found.', detail: error });
    }
    res.status(500).json({ error: 'Failed to delete patient', message: error.message, detail: error });
  }
};
