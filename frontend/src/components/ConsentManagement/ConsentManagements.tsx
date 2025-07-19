// src/components/ConsentManagement/ConsentManagement.tsx
import React, { useState, useEffect } from 'react';
import ConsentTable from './ConsentTable';
import { Box, Typography } from '@mui/material';
import { ConsentFormType, fetchConsents } from '../../services/api';

interface ConsentManagementProps {
  showNotification: (text: string, type: 'success' | 'error') => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const ConsentManagement: React.FC<ConsentManagementProps> = ({
  showNotification,
  setIsLoading,
  isLoading,
}) => {
  const [consentForms, setConsentForms] = useState<ConsentFormType[]>([]);

  const loadConsentForms = async () => {
    setIsLoading(true);
    try {
      const data = await fetchConsents();
      setConsentForms(data);
    } catch (error: any) {
      showNotification("❌ Gagal mengambil data formulir persetujuan: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // PERBAIKAN UTAMA: Mengubah dependency array menjadi kosong []
  // Ini memastikan loadConsentForms hanya berjalan sekali saat komponen dimuat.
  useEffect(() => {
    loadConsentForms();
  }, []); // Hapus isLoading dari dependency array

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: { xs: 4, md: 6 }, borderRadius: '16px', boxShadow: 3 }}>
      <ConsentTable
        consentForms={consentForms}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default ConsentManagement;
