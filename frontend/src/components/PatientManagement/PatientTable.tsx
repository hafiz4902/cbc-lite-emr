import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, ButtonGroup } from '@mui/material';
import LoadingOverlay from '../ui/LoadingOverlay';
import { Patient, syncPatientToSatuSehat } from '../../services/api';
import { exportToCsv, exportToExcel } from '../../utils/exportUtils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => Promise<void>;
  onAddConsent: (patient: Patient) => void;
  isLoading: boolean;
  showNotification: (text: string, type: 'success' | 'error') => void;
  setIsLoading: (loading: boolean) => void;
  onRefreshPatients: () => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onEdit,
  onDelete,
  onAddConsent,
  isLoading,
  showNotification,
  setIsLoading,
  onRefreshPatients,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExportCsv = () => {
    const headers = ["Nama", "NIK", "Tanggal Lahir", "Gender", "No HP", "Satu Sehat ID"];
    const keys = ["name", "nik", "birthDate", "gender", "phone", "satuSehatId"];
    exportToCsv(patients, "data_pasien", headers, keys);
    handleExportClose();
  };

  const handleExportExcel = () => {
    const headers = ["Nama", "NIK", "Tanggal Lahir", "Gender", "No HP", "Satu Sehat ID"];
    const keys = ["name", "nik", "birthDate", "gender", "phone", "satuSehatId"];
    exportToExcel(patients, "data_pasien", headers, keys);
    handleExportClose();
  };

  const handleSyncToSatuSehat = async (patient: Patient) => {
    setIsLoading(true);
    try {
      const newSatuSehatId = await syncPatientToSatuSehat(patient);
      showNotification(`✅ Pasien ${patient.name} berhasil disinkronkan ke Satu Sehat dengan ID: ${newSatuSehatId}`, 'success');
      onRefreshPatients();
    } catch (error: any) {
      showNotification(`❌ Gagal sinkronisasi ${patient.name} ke Satu Sehat: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: '16px', boxShadow: 3, position: 'relative', overflowX: 'auto' }}>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Daftar Pasien
        </Typography>
        <ButtonGroup variant="contained" aria-label="export button group">
          <Button
            onClick={handleExportClick}
            endIcon={<ArrowDropDownIcon />}
            disabled={isLoading || patients.length === 0}
            startIcon={<DownloadIcon />}
          >
            Ekspor
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleExportClose}
            MenuListProps={{
              'aria-labelledby': 'export-button',
            }}
          >
            <MenuItem onClick={handleExportCsv} disabled={isLoading || patients.length === 0}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ekspor ke CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportExcel} disabled={isLoading || patients.length === 0}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ekspor ke Excel</ListItemText>
            </MenuItem>
          </Menu>
        </ButtonGroup>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="patient table">
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>NIK</TableCell>
            <TableCell>Tanggal Lahir</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>No HP</TableCell>
            <TableCell>Satu Sehat ID</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', fontSize: '1.1rem' }}>
                Tidak ada data pasien. Tambahkan pasien baru!
              </TableCell>
            </TableRow>
          ) : (
            patients.map((p) => (
              <TableRow key={p.id}>
                <TableCell component="th" scope="row">{p.name}</TableCell>
                <TableCell>{p.nik}</TableCell>
                <TableCell>{new Date(p.birthDate).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{p.gender === "male" ? "Laki-laki" : "Perempuan"}</TableCell>
                <TableCell>{p.phone || "-"}</TableCell>
                <TableCell>{p.satuSehatId || "Belum Tersedia"}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => onEdit(p)}
                      disabled={isLoading}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(p.id)}
                      disabled={isLoading}
                      size="small"
                    >
                      Hapus
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onAddConsent(p)}
                      disabled={isLoading}
                      size="small"
                    >
                      Persetujuan
                    </Button>
                    {/* Tombol Sinkronkan ke Satu Sehat */}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => handleSyncToSatuSehat(p)}
                      disabled={isLoading || !!p.satuSehatId}
                      size="small"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {p.satuSehatId ? "Sudah Sinkron" : "Sinkronkan ke Satu Sehat"}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
