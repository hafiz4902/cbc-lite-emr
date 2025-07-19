import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, ButtonGroup, Button } from '@mui/material';
import LoadingOverlay from '../ui/LoadingOverlay';
import { ConsentFormType } from '../../services/api';
import { exportToCsv, exportToExcel } from '../../utils/exportUtils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

interface ConsentTableProps {
  consentForms: ConsentFormType[];
  isLoading: boolean;
}

const ConsentTable: React.FC<ConsentTableProps> = ({ consentForms, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const handleExportCsv = () => {
    const headers = ["Pasien", "NIK Pasien", "Tipe Persetujuan", "Tanggal Persetujuan", "Tanda Tangan"];
    const keys = ["patient.name", "patient.nik", "consentType", "consentDate", "signatureData"];
    exportToCsv(consentForms, "data_persetujuan", headers, keys);
    handleExportClose();
  };

  const handleExportExcel = () => {
    const headers = ["Pasien", "NIK Pasien", "Tipe Persetujuan", "Tanggal Persetujuan", "Tanda Tangan"];
    const keys = ["patient.name", "patient.nik", "consentType", "consentDate", "signatureData"];
    exportToExcel(consentForms, "data_persetujuan", headers, keys);
    handleExportClose();
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: '16px', boxShadow: 3, position: 'relative', overflowX: 'auto' }}>
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Daftar Formulir Persetujuan
        </Typography>
        <ButtonGroup variant="contained" aria-label="export button group">
          <Button
            onClick={handleExportClick}
            endIcon={<ArrowDropDownIcon />}
            disabled={isLoading || consentForms.length === 0}
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
            <MenuItem onClick={handleExportCsv} disabled={isLoading || consentForms.length === 0}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ekspor ke CSV</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportExcel} disabled={isLoading || consentForms.length === 0}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ekspor ke Excel</ListItemText>
            </MenuItem>
          </Menu>
        </ButtonGroup>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="consent forms table">
        <TableHead>
          <TableRow>
            <TableCell>Pasien</TableCell>
            <TableCell>NIK Pasien</TableCell>
            <TableCell>Tipe Persetujuan</TableCell>
            <TableCell>Tanggal Persetujuan</TableCell>
            <TableCell>Tanda Tangan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', fontSize: '1.1rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress sx={{ color: 'primary.main' }} size={40} />
                  <Typography>Memuat data persetujuan...</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : consentForms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', fontSize: '1.1rem' }}>
                Tidak ada formulir persetujuan.
              </TableCell>
            </TableRow>
          ) : (
            consentForms.map((c) => (
              <TableRow key={c.id}>
                <TableCell component="th" scope="row">{c.patient?.name}</TableCell>
                <TableCell>{c.patient?.nik}</TableCell>
                <TableCell>{c.consentType}</TableCell>
                <TableCell>{c.consentDate ? new Date(c.consentDate).toLocaleDateString("id-ID") : '-'}</TableCell>
                <TableCell>
                  {c.signatureData ? (
                    <img src={c.signatureData} alt="Tanda Tangan" style={{ width: '96px', height: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }} />
                  ) : (
                    "Tidak ada tanda tangan"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConsentTable;
