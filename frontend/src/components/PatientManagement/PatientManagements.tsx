// src/components/PatientManagement/PatientManagement.tsx
import React, { useState, useEffect } from 'react';
import PatientForm from './PatientForm';
import PatientTable from './PatientTable';
import { Button, Box, Typography } from '@mui/material';
import { Patient, fetchPatients, createPatient, updatePatient, deletePatient } from '../../services/api';
import { useAppStatus } from '../../hooks/useAppStatus';

interface PatientManagementProps {
  showNotification: (text: string, type: 'success' | 'error') => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  onOpenConsentModal: (patient: Patient) => void;
}

const PatientManagement: React.FC<PatientManagementProps> = ({
  showNotification,
  setIsLoading,
  isLoading,
  onOpenConsentModal,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (error: any) {
      showNotification("❌ Gagal mengambil data pasien: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormSubmit = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'satuSehatId'>) => {
    setIsLoading(true);
    try {
      if (editingPatient) {
        const dataToUpdate = { ...patientData, satuSehatId: editingPatient.satuSehatId };
        await updatePatient(editingPatient.id, dataToUpdate);
        showNotification("✅ Pasien berhasil diperbarui!", 'success');
      } else {
        await createPatient(patientData);
        showNotification("✅ Pasien berhasil ditambahkan!", 'success');
      }
      setShowForm(false);
      setEditingPatient(null);
      loadPatients(); // Reload data
    } catch (error: any) {
      showNotification("❌ Gagal: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pasien ini?")) {
      return;
    }
    setIsLoading(true);
    try {
      await deletePatient(id);
      showNotification("✅ Pasien berhasil dihapus!", 'success');
      loadPatients(); // Reload data
    } catch (error: any) {
      showNotification("❌ Gagal menghapus: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: { xs: 4, md: 6 }, borderRadius: '16px', boxShadow: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
        <Button
          variant={!showForm ? "contained" : "outlined"}
          onClick={() => { setShowForm(false); setEditingPatient(null); }}
          disabled={isLoading}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Daftar Pasien
        </Button>
        <Button
          variant={showForm ? "contained" : "outlined"}
          onClick={() => { setShowForm(true); setEditingPatient(null); }}
          disabled={isLoading}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Tambah Pasien Baru
        </Button>
      </Box>

      {showForm ? (
        <PatientForm
          initialData={editingPatient}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
          showNotification={showNotification}
        />
      ) : (
        <PatientTable
          patients={patients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddConsent={onOpenConsentModal}
          isLoading={isLoading}
          showNotification={showNotification}
          setIsLoading={setIsLoading}
          onRefreshPatients={loadPatients} // Teruskan fungsi loadPatients
        />
      )}
    </Box>
  );
};

export default PatientManagement;
