// src/components/SatuSehatSettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { setSatuSehatCredentials, getSatuSehatCredentials } from '../../services/api'; // Import fungsi kredensial

interface SatuSehatSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void; // Callback setelah menyimpan dan mungkin mengambil token
  isLoading: boolean;
  showNotification: (text: string, type: 'success' | 'error') => void;
}

const SatuSehatSettingsModal: React.FC<SatuSehatSettingsModalProps> = ({ open, onClose, onSave, isLoading, showNotification }) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Muat kredensial yang tersimpan saat modal dibuka
    const { clientId, clientSecret } = getSatuSehatCredentials();
    if (clientId) setClientId(clientId);
    if (clientSecret) setClientSecret(clientSecret);
  }, [open]);

  const handleSave = () => {
    if (!clientId || !clientSecret) {
      showNotification("Client ID dan Client Secret tidak boleh kosong.", 'error');
      return;
    }
    setSatuSehatCredentials(clientId, clientSecret);
    showNotification("✅ Kredensial Satu Sehat berhasil disimpan.", 'success');
    onSave(); // Panggil callback untuk memicu pengambilan token atau refresh data
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Pengaturan Satu Sehat Sandbox
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Masukkan Client ID dan Client Secret Anda dari portal developer Satu Sehat (Sandbox).
          Kredensial ini akan disimpan secara lokal di browser Anda.
          <br/><br/>
          **Peringatan:** Penyimpanan di browser TIDAK aman untuk produksi.
        </Typography>
        <TextField
          label="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          fullWidth
          required
          variant="outlined"
          disabled={isLoading}
        />
        <TextField
          label="Client Secret"
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          fullWidth
          required
          variant="outlined"
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isLoading || !clientId || !clientSecret}
          sx={{ flexGrow: 1, py: 1.5, fontSize: '1.1rem' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Simpan & Ambil Token"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SatuSehatSettingsModal;
