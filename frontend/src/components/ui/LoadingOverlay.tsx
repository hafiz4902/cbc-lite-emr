// src/components/ui/LoadingOverlay.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300, // Di atas Dialog (modal) MUI
        animation: 'fadeIn 0.3s ease-in-out forwards', // Menggunakan keyframe CSS
      }}
    >
      <CircularProgress sx={{ color: 'primary.light' }} size={60} thickness={4} />
      <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
        Memuat data...
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
