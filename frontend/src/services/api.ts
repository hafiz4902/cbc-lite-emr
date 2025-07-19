// src/services/api.ts

// --- Konfigurasi Satu Sehat Sandbox (STAGING) ---
const SATU_SEHAT_AUTH_URL = "https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials";
const SATU_SEHAT_FHIR_BASE_URL = "https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1";

// Kredensial ini HARUS diambil dari input pengguna atau variabel lingkungan
// JANGAN HARDCODE DI PRODUKSI! Ini hanya untuk tujuan sandbox/demo.
let CLIENT_ID: string | null = localStorage.getItem('satuSehatClientId');
let CLIENT_SECRET: string | null = localStorage.getItem('satuSehatClientSecret');
let ACCESS_TOKEN: string | null = localStorage.getItem('satuSehatAccessToken');
let TOKEN_EXPIRY: number | null = localStorage.getItem('satuSehatTokenExpiry') ? parseInt(localStorage.getItem('satuSehatTokenExpiry')!) : null;

// --- Tipe Data (Disesuaikan dengan FHIR Patient minimal) ---
export type Patient = {
  id: string; // ID internal aplikasi
  name: string;
  nik: string;
  birthDate: string;
  gender: 'male' | 'female'; // Sesuaikan dengan standar FHIR
  phone?: string;
  satuSehatId?: string | null; // ID Patient dari Satu Sehat
  createdAt?: string;
  updatedAt?: string;
};

export type Encounter = {
  id: string;
  patientId: string;
  patient: {
    id: string;
    name: string;
    nik: string;
  };
  date: string;
  type: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ConsentFormType = {
  id?: string;
  patientId: string;
  patient?: { id: string; name: string; nik: string; };
  consentDate?: string;
  consentType: string;
  signatureData: string;
  createdAt?: string;
  updatedAt?: string;
};

// --- Fungsi untuk Mengatur Kredensial Satu Sehat ---
export const setSatuSehatCredentials = (clientId: string, clientSecret: string) => {
  CLIENT_ID = clientId;
  CLIENT_SECRET = clientSecret;
  localStorage.setItem('satuSehatClientId', clientId);
  localStorage.setItem('satuSehatClientSecret', clientSecret);
  // Hapus token lama agar token baru dapat diambil
  ACCESS_TOKEN = null;
  TOKEN_EXPIRY = null;
  localStorage.removeItem('satuSehatAccessToken');
  localStorage.removeItem('satuSehatTokenExpiry');
};

export const getSatuSehatCredentials = () => {
  return { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET };
};

// --- Fungsi Otentikasi Satu Sehat ---
async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Satu Sehat Client ID atau Client Secret belum diatur. Silakan atur di pengaturan.");
  }

  // Cek apakah token masih valid
  if (ACCESS_TOKEN && TOKEN_EXPIRY && Date.now() < TOKEN_EXPIRY) {
    console.log("Menggunakan token Satu Sehat yang sudah ada.");
    return ACCESS_TOKEN;
  }

  console.log("Mengambil token akses Satu Sehat baru...");
  try {
    const response = await fetch(SATU_SEHAT_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal mendapatkan token akses Satu Sehat: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    ACCESS_TOKEN = data.access_token;
    // Token valid selama 'expires_in' detik, kurangi sedikit untuk buffer
    TOKEN_EXPIRY = Date.now() + (data.expires_in * 1000) - 5000; // 5 detik sebelum kadaluarsa

    localStorage.setItem('satuSehatAccessToken', ACCESS_TOKEN!);
    localStorage.setItem('satuSehatTokenExpiry', TOKEN_EXPIRY.toString());

    console.log("Token akses Satu Sehat berhasil diambil.");
    return ACCESS_TOKEN!;
  } catch (error) {
    console.error("Kesalahan saat mengambil token akses Satu Sehat:", error);
    throw error;
  }
}

// --- Mock Data (untuk simulasi penyimpanan lokal) ---
// Dalam aplikasi nyata, ini akan berinteraksi dengan backend Anda sendiri
let localPatients: Patient[] = JSON.parse(localStorage.getItem('localPatients') || '[]');
let localEncounters: Encounter[] = JSON.parse(localStorage.getItem('localEncounters') || '[]');
let localConsents: ConsentFormType[] = JSON.parse(localStorage.getItem('localConsents') || '[]');

const saveLocalData = () => {
  localStorage.setItem('localPatients', JSON.stringify(localPatients));
  localStorage.setItem('localEncounters', JSON.stringify(localEncounters));
  localStorage.setItem('localConsents', JSON.stringify(localConsents));
};

// --- Fungsi API Aplikasi (menggunakan data lokal yang disimpan di localStorage) ---
const MOCK_API_DELAY = 500; // milliseconds

export const fetchPatients = (): Promise<Patient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(localPatients), MOCK_API_DELAY);
  });
};

export const createPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'satuSehatId'>): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (localPatients.some(p => p.nik === patientData.nik)) {
        reject(new Error('NIK sudah terdaftar di sistem. Silakan masukkan NIK yang berbeda.'));
        return;
      }
      const newPatient: Patient = {
        ...patientData,
        id: `p${Date.now()}`,
        birthDate: new Date(patientData.birthDate).toISOString(),
        satuSehatId: null, // Awalnya null, akan disinkronkan nanti
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localPatients.push(newPatient);
      saveLocalData();
      resolve(newPatient);
    }, MOCK_API_DELAY);
  });
};



export const updatePatient = (id: string, patientData: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = localPatients.findIndex(p => p.id === id);
      if (index === -1) {
        reject(new Error('Pasien tidak ditemukan.'));
        return;
      }
      if (patientData.nik && patientData.nik !== localPatients[index].nik && localPatients.some(p => p.nik === patientData.nik)) {
          reject(new Error('NIK sudah terdaftar untuk pasien lain. Silakan masukkan NIK yang berbeda.'));
          return;
      }

      const updatedPatient = {
        ...localPatients[index],
        ...patientData,
        birthDate: patientData.birthDate ? new Date(patientData.birthDate).toISOString() : localPatients[index].birthDate,
        updatedAt: new Date().toISOString(),
      };
      localPatients[index] = updatedPatient;
      saveLocalData();
      resolve(updatedPatient);
    }, MOCK_API_DELAY);
  });
};

export const deletePatient = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = localPatients.length;
      localPatients = localPatients.filter(p => p.id !== id);
      if (localPatients.length === initialLength) {
        reject(new Error('Pasien tidak ditemukan.'));
      } else {
        saveLocalData();
        resolve();
      }
    }, MOCK_API_DELAY);
  });
};

// --- Fungsi Integrasi Satu Sehat (REAL API CALLS) ---
export const syncPatientToSatuSehat = async (patient: Patient): Promise<string> => {
  
  // Validasi manual sebelum kirim ke Satu Sehat
  if (!patient.name || !patient.nik || !patient.birthDate || !patient.gender) {
    throw new Error("Data pasien tidak lengkap. Pastikan nama, NIK, tanggal lahir, dan gender sudah diisi.");
  }
  if (!/^\d{16}$/.test(patient.nik)) {
    throw new Error("NIK harus 16 digit angka.");
  }
  if (!["male", "female"].includes(patient.gender)) {
    throw new Error("Gender harus 'male' atau 'female'.");
  }

  // Payload FHIR
  const fhirPatientPayload: any = {
    resourceType: "Patient",
    identifier: [
      {
        system: "http://terminology.kemkes.go.id/identifier/nik",
        value: patient.nik
      }
    ],
    name: [
      {
        use: "official",
        text: patient.name
      }
    ],
    gender: patient.gender,
    birthDate: new Date(patient.birthDate).toISOString().split('T')[0],
    active: true
    
  };

  // Hanya kirim phone jika ada
  if (patient.phone) {
    fhirPatientPayload.telecom = [
      {
        system: "phone",
        value: patient.phone,
        use: "mobile"
      }
    ];
  }

  // Ambil token akses
  const accessToken = await getAccessToken();

  // Kirim ke API Satu Sehat
  const response = await fetch(`${SATU_SEHAT_FHIR_BASE_URL}/Patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(fhirPatientPayload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gagal sinkronisasi ke Satu Sehat: ${response.status} - ${errorData.issue?.[0]?.diagnostics || JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  const satuSehatId = result.id; // Ambil ID dari response

  // ... (opsional: update local patient dengan satuSehatId) ...

  return satuSehatId; // <--- return ID yang benar
};

export const fetchEncounters = (): Promise<Encounter[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const encountersWithPatient = localEncounters.map(enc => {
        const patient = localPatients.find(p => p.id === enc.patientId);
        return {
          ...enc,
          patient: patient ? { id: patient.id, name: patient.name, nik: patient.nik } : { id: "", name: "Unknown", nik: "" }
        };
      });
      resolve(encountersWithPatient);
    }, MOCK_API_DELAY);
  });
};

export const createEncounter = (encounterData: Omit<Encounter, 'id' | 'patient' | 'createdAt' | 'updatedAt'>): Promise<Encounter> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patient = localPatients.find(p => p.id === encounterData.patientId);
      if (!patient) {
        reject(new Error('Pasien tidak ditemukan untuk kunjungan.'));
        return;
      }
      const newEncounter: Encounter = {
        ...encounterData,
        id: `e${Date.now()}`,
        date: new Date(encounterData.date).toISOString(),
        patient: { id: patient.id, name: patient.name, nik: patient.nik },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localEncounters.push(newEncounter);
      saveLocalData();
      resolve(newEncounter);
    }, MOCK_API_DELAY);
  });
};

export const fetchConsents = (): Promise<ConsentFormType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const consentsWithPatient = localConsents.map(consent => {
        const patient = localPatients.find(p => p.id === consent.patientId);
        return {
          ...consent,
          patient: patient ? { id: patient.id, name: patient.name, nik: patient.nik } : { id: "", name: "Unknown", nik: "" }
        };
      });
      resolve(consentsWithPatient);
    }, MOCK_API_DELAY);
  });
};

export const createConsent = (consentData: Omit<ConsentFormType, 'id' | 'patient' | 'consentDate' | 'createdAt' | 'updatedAt'>): Promise<ConsentFormType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patient = localPatients.find(p => p.id === consentData.patientId);
      if (!patient) {
        reject(new Error('Pasien tidak ditemukan untuk persetujuan.'));
        return;
      }
      const newConsent: ConsentFormType = {
        ...consentData,
        id: `c${Date.now()}`,
        consentDate: new Date().toISOString(),
        patient: { id: patient.id, name: patient.name, nik: patient.nik },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localConsents.push(newConsent);
      saveLocalData();
      resolve(newConsent);
    }, MOCK_API_DELAY);
  });
  
};
