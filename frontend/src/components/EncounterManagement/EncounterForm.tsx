// src/components/EncounterManagement/EncounterForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Encounter, Patient } from '../../services/api'; // Import Encounter dan Patient type dari api.ts

interface EncounterFormProps {
  patients: Patient[];
  onSubmit: (data: Omit<Encounter, 'id' | 'patient' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const EncounterForm: React.FC<EncounterFormProps> = ({
  patients,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Omit<Encounter, 'id' | 'patient' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Rawat Jalan',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => { // Gunakan any untuk event Select
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, bgcolor: 'background.paper', borderRadius: '16px', boxShadow: 3 }}>
      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2, color: 'primary.dark' }}>
        Form Tambah Kunjungan
      </Typography>

      <FormControl fullWidth required disabled={isLoading}>
        <InputLabel id="encounter-patient-label">Pilih Pasien</InputLabel>
        <Select
          labelId="encounter-patient-label"
          id="encounterPatient"
          name="patientId"
          value={formData.patientId}
          label="Pilih Pasien"
          onChange={handleChange}
        >
          <MenuItem value="">-- Pilih Pasien --</MenuItem>
          {patients.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} ({p.nik})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Tanggal Kunjungan"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
        fullWidth
        disabled={isLoading}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />

      <FormControl fullWidth required disabled={isLoading}>
        <InputLabel id="encounter-type-label">Tipe Kunjungan</InputLabel>
        <Select
          labelId="encounter-type-label"
          id="encounterType"
          name="type"
          value={formData.type}
          label="Tipe Kunjungan"
          onChange={handleChange}
        >
          <MenuItem value="Rawat Jalan">Rawat Jalan</MenuItem>
          <MenuItem value="Rawat Inap">Rawat Inap</MenuItem>
          <MenuItem value="UGD">UGD</MenuItem>
          <MenuItem value="Lainnya">Lainnya</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Deskripsi/Layanan"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
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
        {isLoading ? 'Memproses...' : "Simpan Kunjungan"}
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="error"
        fullWidth
        onClick={onCancel}
        disabled={isLoading}
        sx={{ mt: 1, py: 1.5, fontSize: '1.1rem' }}
      >
        Batal
      </Button>
    </Box>
  );
};

export default EncounterForm;
