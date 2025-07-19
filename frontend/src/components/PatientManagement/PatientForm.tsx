// src/components/PatientManagement/PatientForm.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Patient } from '../../services/api'; // Import Patient type dari api.ts

interface PatientFormProps {
  initialData?: Patient | null;
  onSubmit: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  showNotification: (text: string, type: 'success' | 'error') => void;
}

const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  showNotification,
}) => {
  const [formData, setFormData] = useState<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    nik: '',
    birthDate: '',
    gender: 'male',
    phone: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        nik: initialData.nik,
        birthDate: new Date(initialData.birthDate).toISOString().split('T')[0],
        gender: initialData.gender,
        phone: initialData.phone || '',
      });
    } else {
      setFormData({
        name: '',
        nik: '',
        birthDate: '',
        gender: 'male',
        phone: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => { // Gunakan any untuk event Select
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.nik.length !== 16) {
      showNotification("NIK harus 16 digit.", 'error');
      return;
    }
    if (!/^\d+$/.test(formData.nik)) {
      showNotification("NIK hanya boleh berisi angka.", 'error');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 3 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, color: 'primary.dark' }}>
        {initialData ? "Form Perbarui Pasien" : "Form Pendaftaran Pasien"}
      </Typography>

      <TextField
        label="Nama Lengkap"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        disabled={isLoading}
        variant="outlined"
      />

      <TextField
        label="NIK"
        name="nik"
        value={formData.nik}
        onChange={handleChange}
        required
        fullWidth
        disabled={isLoading}
        inputProps={{ maxLength: 16, pattern: "[0-9]{16}" }}
        title="NIK harus 16 digit angka."
        variant="outlined"
      />

      <TextField
        label="Tanggal Lahir"
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
        required
        fullWidth
        disabled={isLoading}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />

      <FormControl fullWidth disabled={isLoading}>
        <InputLabel id="patient-gender-label">Jenis Kelamin</InputLabel>
        <Select
          labelId="patient-gender-label"
          id="patientGender"
          name="gender"
          value={formData.gender}
          label="Jenis Kelamin"
          onChange={handleChange}
          required
        >
          <MenuItem value="male">Laki-laki</MenuItem>
          <MenuItem value="female">Perempuan</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="No. HP"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="0812xxxxxxxx"
        fullWidth
        disabled={isLoading}
        variant="outlined"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
      >
        {isLoading ? 'Memproses...' : (initialData ? "Perbarui Pasien" : "Simpan Pasien")}
      </Button>
      {initialData && (
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={onCancel}
          disabled={isLoading}
          sx={{ mt: 1, py: 1.5, fontSize: '1.1rem' }}
        >
          Batal
        </Button>
      )}
    </Box>
  );
};

export default PatientForm;
