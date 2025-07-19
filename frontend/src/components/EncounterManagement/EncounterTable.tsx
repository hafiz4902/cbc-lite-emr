import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, ButtonGroup, Button } from '@mui/material';
import LoadingOverlay from '../ui/LoadingOverlay';
import { Encounter } from '../../services/api';
import { exportToCsv, exportToExcel } from '../../utils/exportUtils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

interface EncounterTableProps {
  encounters: Encounter[];
  isLoading: boolean;
}

const EncounterTable: React.FC<EncounterTableProps> = ({ encounters, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExportCsv = () => {
    const headers = ["Pasien", "NIK Pasien", "Tanggal", "Tipe", "Deskripsi"];
    const keys = ["patient.name", "patient.nik", "date", "type", "description"];
    exportToCsv(encounters, "data_kunjungan", headers, keys);
    handleExportClose();
  };

  const handleExportExcel = () => {
    const headers = ["Pasien", "NIK Pasien", "Tanggal", "Tipe", "Deskripsi"];
    const keys = ["patient.name", "patient.nik", "date", "type", "description"];
    exportToExcel(encounters, "data_kunjungan", headers, keys);
    handleExportClose();
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: '16px', boxShadow: 3, position: 'relative', overflowX: 'auto' }}>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Daftar Kunjungan
        </Typography>
        <ButtonGroup variant="contained" aria-label="export button group">
          <Button
            onClick={handleExportClick}
            endIcon={<ArrowDropDownIcon />}
            disabled={isLoading || encounters.length === 0}
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
            <MenuItem onClick={handleExportCsv} disabled={isLoading || encounters.length === 0}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ekspor ke CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportExcel} disabled={isLoading || encounters.length === 0}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ekspor ke Excel</ListItemText>
            </MenuItem>
          </Menu>
        </ButtonGroup>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="encounter table">
        <TableHead>
          <TableRow>
            <TableCell>Pasien</TableCell>
            <TableCell>NIK Pasien</TableCell>
            <TableCell>Tanggal</TableCell>
            <TableCell>Tipe</TableCell>
            <TableCell>Deskripsi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {encounters.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', fontSize: '1.1rem' }}>
                Tidak ada data kunjungan. Tambahkan kunjungan baru!
              </TableCell>
            </TableRow>
          ) : (
            encounters.map((e) => (
              <TableRow key={e.id}>
                <TableCell component="th" scope="row">{e.patient.name}</TableCell>
                <TableCell>{e.patient.nik}</TableCell>
                <TableCell>{new Date(e.date).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{e.type}</TableCell>
                <TableCell>{e.description || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EncounterTable;
