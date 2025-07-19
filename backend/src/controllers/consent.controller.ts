// src/controllers/consent.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const prisma = new PrismaClient(); // Inisialisasi PrismaClient

// Interface untuk body request saat membuat ConsentForm
// Ini mendefinisikan struktur data yang diharapkan dari frontend
interface CreateConsentFormRequestBody {
  patientId: string;
  consentType: string;
  signatureData?: string; // Opsional: Base64 string dari tanda tangan digital
}

// --- CREATE New Consent Form ---
// Fungsi untuk membuat formulir persetujuan baru
export const createConsentForm = async (req: Request<any, any, CreateConsentFormRequestBody>, res: Response) => {
  // Destrukturisasi data dari body request
  const { patientId, consentType, signatureData } = req.body;
  try {
    // Validasi input dasar: pastikan patientId dan consentType ada
    if (!patientId || !consentType) {
      return res.status(400).json({ error: 'ID Pasien dan Tipe Persetujuan diperlukan.' });
    }

    // Periksa apakah pasien dengan patientId yang diberikan ada di database
    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    // Jika pasien tidak ditemukan, kirim respons 404 Not Found
    if (!patientExists) {
      return res.status(404).json({ error: 'Pasien dengan ID tersebut tidak ditemukan.' });
    }

    // Buat entri ConsentForm baru di database menggunakan Prisma
    const newConsent = await prisma.consentForm.create({
      data: {
        patientId,
        consentType,
        signatureData,
        consentDate: new Date(), // Tanggal persetujuan otomatis diisi dengan waktu saat ini
      },
      include: {
        // Sertakan data pasien yang terkait dalam respons untuk kemudahan frontend
        patient: {
          select: { id: true, name: true, nik: true } // Hanya pilih field yang relevan
        }
      }
    });
    // Kirim respons 201 Created dengan data formulir persetujuan yang baru dibuat
    res.status(201).json(newConsent);
  } catch (error: any) {
    // Tangani error yang mungkin terjadi selama proses pembuatan
    console.error("Error creating consent form:", error);
    res.status(400).json({ error: 'Gagal menambahkan formulir persetujuan', message: error.message, detail: error });
  }
};

// --- GET All Consent Forms ---
// Fungsi untuk mengambil semua formulir persetujuan
export const getConsentForms = async (_: Request, res: Response) => {
  try {
    // Ambil semua entri ConsentForm dari database
    // PERBAIKAN: Mengubah 'consentform' menjadi 'consentForm' (kapitalisasi yang benar)
    const consentForms = await prisma.consentForm.findMany({
      include: {
        // Sertakan data pasien yang terkait untuk setiap formulir persetujuan
        patient: {
          select: { id: true, name: true, nik: true } // Hanya pilih field yang relevan
        }
      },
      orderBy: {
        createdAt: 'desc' // Urutkan berdasarkan tanggal pembuatan, terbaru di atas
      }
    });
    // Kirim respons JSON dengan daftar formulir persetujuan
    res.json(consentForms);
  } catch (error) {
    // Tangani error yang mungkin terjadi selama proses pengambilan data
    console.error("Error fetching consent forms:", error);
    res.status(500).json({ error: 'Gagal mengambil data formulir persetujuan', detail: error });
  }
};
