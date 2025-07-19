// src/components/EncounterManagement/EncounterManagement.tsx
import React, { useState, useEffect } from 'react';
import EncounterForm from './EncounterForm';
import EncounterTable from './EncounterTable';
import { Button, Box, Typography } from '@mui/material';
import { Encounter, Patient, fetchEncounters, createEncounter, fetchPatients } from '../../services/api'; // Import Encounter dan Patient type dari api.ts

interface EncounterManagementProps {
  showNotification: (text: string, type: 'success' | 'error') => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const EncounterManagement: React.FC<EncounterManagementProps> = ({
  showNotification,
  setIsLoading,
  isLoading,
}) => {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadEncounters = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEncounters(); // Menggunakan fetchEncounters dari api.ts
      setEncounters(data);
    } catch (error: any) {
      showNotification("❌ Gagal mengambil data kunjungan: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientsForForm = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPatients(); // Menggunakan fetchPatients dari api.ts
      setPatients(data);
    } catch (error: any) {
      showNotification("❌ Gagal mengambil data pasien untuk form kunjungan: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEncounters();
    loadPatientsForForm();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = async (encounterData: Omit<Encounter, 'id' | 'patient' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      await createEncounter(encounterData); // Menggunakan createEncounter dari api.ts
      showNotification("✅ Kunjungan berhasil ditambahkan!", 'success');
      setShowForm(false);
      loadEncounters();
    } catch (error: any) {
      showNotification("❌ Gagal: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: { xs: 4, md: 6 }, borderRadius: '16px', boxShadow: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
        <Button
          variant={!showForm ? "contained" : "outlined"}
          onClick={() => setShowForm(false)}
          disabled={isLoading}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Daftar Kunjungan
        </Button>
        <Button
          variant={showForm ? "contained" : "outlined"}
          onClick={() => setShowForm(true)}
          disabled={isLoading}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Tambah Kunjungan Baru
        </Button>
      </Box>

      {showForm ? (
        <EncounterForm
          patients={patients}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      ) : (
        <EncounterTable
          encounters={encounters}
          isLoading={isLoading}
        />
      )}
    </Box>
  );
};

export default EncounterManagement;
