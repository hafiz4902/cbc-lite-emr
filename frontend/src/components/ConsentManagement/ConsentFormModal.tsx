// src/components/ConsentManagement/ConsentFormModal.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Patient, ConsentFormType } from '../../services/api';

interface ConsentFormModalProps {
  patient: Patient;
  onClose: () => void;
  onSubmit: (data: Omit<ConsentFormType, 'id' | 'patient' | 'consentDate' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading: boolean;
  showNotification: (text: string, type: 'success' | 'error') => void;
}

const ConsentFormModal: React.FC<ConsentFormModalProps> = ({ patient, onClose, onSubmit, isLoading, showNotification }) => {
  const [consentType, setConsentType] = useState('');
  const [signatureData, setSignatureData] = useState('');

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false); // Menggunakan useRef untuk status menggambar

  // Effect untuk inisialisasi canvas dan penanganan resize
  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) {
      console.error("Elemen canvas tidak ditemukan!");
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Konteks 2D tidak tersedia!");
      return;
    }

    const setCanvasDimensionsAndContext = () => {
      const dpi = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Set ukuran buffer gambar canvas
      canvas.width = rect.width * dpi;
      canvas.height = rect.height * dpi;

      // Reset properti konteks setelah mengubah ukuran canvas (yang akan menghapusnya)
      context.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan seluruh buffer
      context.scale(dpi, dpi); // Terapkan kembali skala
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#000';

      // Jika ada data tanda tangan yang sudah ada, gambar ulang
      if (signatureData) {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0, canvas.width / dpi, canvas.height / dpi);
        };
        img.src = signatureData;
      }
    };

    setCanvasDimensionsAndContext(); // Pengaturan awal

    // Tambahkan listener resize
    window.addEventListener('resize', setCanvasDimensionsAndContext);

    // Fungsi cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensionsAndContext);
    };
  }, [signatureData]); // Hanya jalankan ulang jika signatureData berubah untuk menggambar ulang

  // Fungsi untuk mendapatkan koordinat mouse/sentuhan relatif terhadap canvas
  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dpi = window.devicePixelRatio || 1; // Dapatkan DPI di sini untuk perhitungan

    return {
      x: (clientX - rect.left) / dpi,
      y: (clientY - rect.top) / dpi,
    };
  }, []);

  // Fungsi untuk memulai menggambar
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    isDrawingRef.current = true; // Set status menggambar ke true
    const { x, y } = getCanvasPoint(e);
    context.beginPath(); // Mulai path baru
    context.moveTo(x, y); // Pindahkan ke titik awal
  }, [getCanvasPoint]);

  // Fungsi untuk menggambar saat mouse/sentuhan bergerak
  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context || !isDrawingRef.current) return; // Hanya gambar jika sedang menggambar

    const { x, y } = getCanvasPoint(e);
    context.lineTo(x, y); // Gambar garis ke titik saat ini
    context.stroke(); // Terapkan stroke
  }, [getCanvasPoint]);

  // Fungsi untuk mengakhiri menggambar
  const endDrawing = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    isDrawingRef.current = false; // Set status menggambar ke false
    context.closePath(); // Tutup path
    setSignatureData(canvas.toDataURL('image/png')); // Simpan data tanda tangan
  }, []);

  // Fungsi untuk menghapus tanda tangan
  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpi = window.devicePixelRatio || 1;
    context.clearRect(0, 0, canvas.width / dpi, canvas.height / dpi); // Bersihkan canvas
    setSignatureData(""); // Hapus data tanda tangan dari state
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consentType) {
      showNotification("Tipe Persetujuan diperlukan.", 'error');
      return;
    }
    if (!signatureData) {
      showNotification("Tanda tangan diperlukan.", 'error');
      return;
    }
    await onSubmit({ patientId: patient.id, consentType, signatureData });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Formulir Persetujuan
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
      <DialogContent dividers sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Pasien"
            value={`${patient.name} (${patient.nik})`}
            fullWidth
            InputProps={{ readOnly: true }}
            variant="outlined"
          />

          <FormControl fullWidth required disabled={isLoading}>
            <InputLabel id="consent-type-label">Tipe Persetujuan</InputLabel>
            <Select
              labelId="consent-type-label"
              id="consentType"
              name="consentType"
              value={consentType}
              label="Tipe Persetujuan"
              onChange={(e) => setConsentType(e.target.value as string)}
            >
              <MenuItem value="">-- Pilih Tipe Persetujuan --</MenuItem>
              <MenuItem value="Treatment">Persetujuan Tindakan Medis</MenuItem>
              <MenuItem value="Data Sharing">Persetujuan Berbagi Data</MenuItem>
              <MenuItem value="Research">Persetujuan Penelitian</MenuItem>
              <MenuItem value="Other">Lainnya</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ border: '1px solid', borderColor: 'grey.400', borderRadius: '8px', overflow: 'hidden', p: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>Tanda Tangan Digital</Typography>
            <canvas
              ref={signatureCanvasRef}
              style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', cursor: 'crosshair', width: '100%', height: '150px', display: 'block' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseLeave={endDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={endDrawing}
            ></canvas>
          </Box>
          <Button
            variant="outlined"
            color="error"
            onClick={clearSignature}
            disabled={isLoading}
            sx={{ mt: 1, width: '100%' }}
          >
            Hapus Tanda Tangan
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          // Pastikan onClick memanggil handleSubmit dari form Box
          onClick={(e) => {
            // Kita perlu memastikan form disubmit jika tombol ini diklik
            // Karena tombol submit ada di DialogActions, kita bisa memicu submit form secara manual
            // atau memastikan form Box memiliki onSubmit yang sama
            const formElement = e.currentTarget.closest('form');
            if (formElement) {
              formElement.requestSubmit(); // Memicu submit form
            } else {
              handleSubmit(e as any); // Fallback jika tidak dalam form (meskipun seharusnya tidak)
            }
          }}
          disabled={isLoading || !consentType || !signatureData}
          sx={{ flexGrow: 1, py: 1.5, fontSize: '1.1rem' }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Simpan Persetujuan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentFormModal;
