// src/components/layout/Sidebar.tsx
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, useMediaQuery, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Menggunakan useTheme untuk mengakses palet warna
import CloseIcon from '@mui/icons-material/Close'; // Ikon tutup untuk drawer mobile

interface SidebarProps {
  currentView: 'patients' | 'encounters' | 'consents';
  setCurrentView: (view: 'patients' | 'encounters' | 'consents') => void;
  isLoading: boolean;
  drawerWidth: number;
  mobileOpen: boolean; // State dari App.tsx untuk drawer mobile
  handleDrawerToggle: () => void; // Handler untuk toggle drawer
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isLoading, drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme(); // Mengakses tema MUI
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Deteksi ukuran layar mobile

  const navItems = [
    { id: 'patients', label: 'Manajemen Pasien' },
    { id: 'encounters', label: 'Manajemen Kunjungan' },
    { id: 'consents', label: 'Formulir Persetujuan' },
  ];

  const drawerContent = (
    <Box>
      <Box sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
        {isMobile && ( // Tampilkan tombol tutup hanya di mobile
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            letterSpacing: 1.5,
            color: theme.palette.primary.light, // Warna biru muda terang dari tema
            textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          CBC Lite
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
      </Box>
      <List sx={{ flexGrow: 1, px: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              selected={currentView === item.id}
              onClick={() => {
                setCurrentView(item.id as 'patients' | 'encounters' | 'consents');
                if (isMobile) {
                  handleDrawerToggle(); // Tutup drawer setelah memilih di mobile
                }
              }}
              disabled={isLoading}
              sx={{
                borderRadius: '12px',
                padding: '14px 24px',
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.main, // Warna saat terpilih dari tema (biru muda)
                  color: 'white',
                  boxShadow: '0px 8px 20px rgba(0,0,0,0.3)',
                  transform: 'translateX(10px)',
                  borderLeft: '6px solid',
                  borderColor: theme.palette.background.paper, // Border putih dari tema
                  '&:hover': {
                    bgcolor: theme.palette.primary.main, // Tetap sama saat hover jika terpilih
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)', // Warna hover transparan yang sedikit lebih pekat
                  color: 'white',
                  transform: 'translateY(-3px)',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
                },
                color: theme.palette.primary.light, // Warna teks default item dari tema (biru muda terang)
                fontWeight: 'medium',
              }}
            >
              <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontWeight: 'inherit', fontSize: '1.1rem' } }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, textAlign: 'center', fontSize: '0.8rem', color: theme.palette.primary.light, opacity: 0.8 }}>
        &copy; 2024 CBC Lite. All rights reserved.
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Drawer untuk mobile (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Lebih baik untuk performa mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' }, // Tampilkan hanya di mobile
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: `linear-gradient(to bottom, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`, // Gradien dari biru gelap ke abu-abu gelap
            color: 'white',
            boxShadow: '8px 0px 20px rgba(0,0,0,0.35)',
            borderRadius: '0 32px 32px 0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Drawer untuk desktop (permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' }, // Sembunyikan di mobile
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: `linear-gradient(to bottom, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`, // Gradien dari biru gelap ke abu-abu gelap
            color: 'white',
            boxShadow: '8px 0px 20px rgba(0,0,0,0.35)',
            borderRadius: '0 32px 32px 0',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
