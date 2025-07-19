// src/App.tsx
import React, { useState } from "react";
import './index.css'; // Tetap impor ini untuk reset CSS dasar dan font
import { useAppStatus } from './hooks/useAppStatus';
import Notification from './components/ui/Notification';
import LoadingOverlay from './components/ui/LoadingOverlay';

// Import komponen MUI
import { Box, CssBaseline, ThemeProvider, createTheme, Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Ikon menu
import SettingsIcon from '@mui/icons-material/Settings'; // Ikon pengaturan

// Import komponen manajemen Anda
import PatientManagement from './components/PatientManagement/PatientManagements';
import EncounterManagement from './components/EncounterManagement/EncounterManagements';
import ConsentManagement from './components/ConsentManagement/ConsentManagements';
import ConsentFormModal from './components/ConsentManagement/ConsentFormModal';
import Sidebar from './components/layout/Sidebar'; // Sidebar sekarang akan menjadi Drawer
import SatuSehatSettingsModal from './components/ui/SatuSehatSettingsModal'; // Import modal pengaturan

// Import mockApiService dan tipe data dari file terpisah
import { Patient, createConsent, ConsentFormType, getSatuSehatCredentials } from './services/api'; // Import getSatuSehatCredentials

// Definisikan tema MUI Anda untuk tampilan modern & minimalis dengan warna biru muda dan putih
const theme = createTheme({
  palette: {
    primary: {
      main: '#03A9F4', // Biru muda utama (Light Blue 500)
      light: '#4FC3F7', // Biru muda lebih terang (Light Blue 300)
      dark: '#01579B', // Biru gelap untuk aksen (Light Blue 900)
      contrastText: '#fff', // Teks kontras putih
    },
    secondary: {
      main: '#607D8B', // Abu-abu kebiruan (Blue Grey 500) - cocok untuk netral
      light: '#90A4AE',
      dark: '#455A64',
      contrastText: '#fff',
    },
    background: {
      default: '#F0F8FF', // Latar belakang aplikasi (AliceBlue, sangat terang)
      paper: '#ffffff', // Latar belakang kartu/komponen (putih bersih)
    },
    text: {
      primary: '#212121', // Teks gelap utama
      secondary: '#424242', // Teks abu-abu medium
      disabled: '#757575', // Teks abu-abu terang
    },
    error: {
      main: '#F44336', // Merah standar untuk error
    },
    warning: {
      main: '#FF9800', // Oranye standar untuk warning
    },
    success: {
      main: '#4CAF50', // Hijau standar untuk success
    },
  },
  typography: {
    fontFamily: 'Roboto, Inter, sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2 },
    h2: { fontSize: '2.5rem', fontWeight: 700 },
    h3: { fontSize: '2rem', fontWeight: 700 },
    h4: { fontSize: '1.75rem', fontWeight: 600 },
    h5: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontSize: '1.25rem', fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 }, // Tombol tidak kapital semua
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Sudut membulat
          padding: '10px 20px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', // Bayangan halus
          '&:hover': {
            boxShadow: '0px 6px 15px rgba(0,0,0,0.15)', // Bayangan sedikit lebih kuat saat hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px', // Sudut membulat untuk input
            backgroundColor: '#ffffff',
            '&.Mui-focused fieldset': {
              borderColor: '#03A9F4', // Warna border saat fokus (biru muda utama)
              boxShadow: '0 0 0 3px rgba(3, 169, 244, 0.3)', // Efek fokus (biru muda transparan)
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: '12px', // Sudut membulat untuk select
          backgroundColor: '#ffffff',
          '&.Mui-focused fieldset': {
            borderColor: '#03A9F4',
            boxShadow: '0 0 0 3px rgba(3, 169, 244, 0.3)',
          },
        },
      },
    },
    MuiPaper: { // Untuk Drawer, Modal, Card, dll.
      styleOverrides: {
        root: {
          borderRadius: '16px', // Sudut membulat untuk Paper
          boxShadow: '0px 8px 20px rgba(0,0,0,0.1)', // Bayangan umum untuk card/panel
        },
      },
    },
    MuiDialog: { // Untuk modal
      styleOverrides: {
        paper: {
          borderRadius: '20px', // Lebih membulat untuk modal
          boxShadow: '0px 15px 35px rgba(0,0,0,0.2)', // Bayangan lebih kuat untuk modal
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#03A9F4', // Header tabel biru muda utama
          '& .MuiTableCell-root': {
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
          },
          // Pastikan baris di dalam TableHead tidak memiliki efek hover dan selalu biru muda
          '& .MuiTableRow-root': {
            backgroundColor: '#03A9F4 !important', // Warna biru muda statis
            '&:hover': {
              backgroundColor: '#03A9F4 !important', // Hapus warna hover, tetap biru muda
              cursor: 'default', // Ubah kursor menjadi default
            },
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#ffffff', // Baris ganjil putih
          },
          '&:nth-of-type(even)': {
            backgroundColor: '#E1F5FE', // Baris genap biru sangat muda (Light Blue 50)
          },
          '&:hover': {
            backgroundColor: '#B3E5FC', // Hover biru muda (Light Blue 100)
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 20px', // Padding sel tabel
          borderBottom: '1px solid #e0e0e0', // Border antar sel
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          position: 'sticky', // Ensure it sticks to the top
          top: 0,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({ // Menggunakan fungsi callback
          paddingLeft: theme.spacing(2), // Sesuaikan padding
          paddingRight: theme.spacing(2),
        }),
      },
    },
  },
});

const drawerWidth = 280; // Lebar drawer

function App() {
  const { isLoading, message, setIsLoading, showNotification } = useAppStatus();
  const [currentView, setCurrentView] = useState<'patients' | 'encounters' | 'consents'>('patients');
  const [mobileOpen, setMobileOpen] = useState(false); // State untuk drawer mobile
  const [satuSehatSettingsOpen, setSatuSehatSettingsOpen] = useState(false); // State untuk modal pengaturan Satu Sehat

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenConsentModal = (patient: Patient) => {
    setPatientForConsent(patient);
    setShowConsentModal(true);
  };

  const handleCloseConsentModal = () => {
    setShowConsentModal(false);
    setPatientForConsent(null);
  };

  const handleCreateConsent = async (consentData: Omit<ConsentFormType, 'id' | 'patient' | 'consentDate' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      await createConsent(consentData);
      showNotification("✅ Formulir persetujuan berhasil ditambahkan!", 'success');
      handleCloseConsentModal();
    } catch (error: any) {
      showNotification("❌ Gagal menambahkan persetujuan: " + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSatuSehatSettingsSave = () => {
    // This function can be used to trigger a refresh of patient data if needed
    // after credentials are saved/updated.
    // For now, we rely on the implicit token refresh when syncPatientToSatuSehat is called.
  };

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [patientForConsent, setPatientForConsent] = useState<Patient | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS dasar dari MUI */}
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar (Drawer) */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isLoading={isLoading}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        {/* Main Content Area Wrapper */}
        <Box
          sx={(theme) => ({
            flexGrow: 1, // Mengisi sisa ruang setelah drawer
            display: 'flex',
            flexDirection: 'column',
            // Tidak ada ml di sini, karena flexGrow: 1 akan secara otomatis menempatkannya
            // setelah drawer permanen di desktop.
            width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` }, // Lebar konten utama
          })}
        >
          {/* AppBar untuk tombol menu mobile dan pengaturan Satu Sehat */}
          <AppBar
            position="sticky" // Menggunakan sticky agar tetap di atas saat scroll
            sx={(theme) => ({
              // Di desktop, AppBar akan mengisi lebar sisa setelah drawer
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` }, // AppBar tetap didorong ke samping drawer
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[1],
              zIndex: theme.zIndex.appBar, // Menggunakan zIndex AppBar default
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: 'none' }, color: 'primary.dark' }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'primary.dark' }}>
                Sistem Manajemen Pasien & Kunjungan
              </Typography>
              {/* Tombol Pengaturan Satu Sehat */}
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => setSatuSehatSettingsOpen(true)}
                sx={{  color: 'primary.main', borderColor: 'primary.main' }}
                disabled={isLoading}
              >
                Satu Sehat
              </Button>
            </Toolbar>
          </AppBar>

          {/* Konten Utama Aplikasi (di bawah AppBar) */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1, // Memastikan konten utama mengisi sisa tinggi
              p: { xs: 3, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Memusatkan konten secara horizontal
              justifyContent: 'flex-start',
              background: `linear-gradient(to bottom right, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
              minHeight: 'calc(100vh - 64px)', // Tinggi minimum untuk mobile (64px adalah tinggi AppBar default)
              // Untuk desktop, minHeight ditangani oleh flexGrow: 1 dari parent Box
            })}
          >
            <Notification text={message.text} type={message.type} />
            <LoadingOverlay isLoading={isLoading} />

            <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: 4 }}>

              {currentView === 'patients' && (
                <PatientManagement
                  showNotification={showNotification}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  onOpenConsentModal={handleOpenConsentModal}
                />
              )}
              {currentView === 'encounters' && (
                <EncounterManagement
                  showNotification={showNotification}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}
              {currentView === 'consents' && (
                <ConsentManagement
                  showNotification={showNotification}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Modal Formulir Persetujuan */}
        {showConsentModal && patientForConsent && (
          <ConsentFormModal
            patient={patientForConsent}
            onClose={handleCloseConsentModal}
            onSubmit={handleCreateConsent}
            isLoading={isLoading}
            showNotification={showNotification}
          />
        )}

        {/* Modal Pengaturan Satu Sehat */}
        <SatuSehatSettingsModal
          open={satuSehatSettingsOpen}
          onClose={() => setSatuSehatSettingsOpen(false)}
          onSave={handleSatuSehatSettingsSave}
          isLoading={isLoading}
          showNotification={showNotification}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
