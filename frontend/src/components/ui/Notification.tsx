// src/components/ui/Notification.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';



interface NotificationProps {
  text: string;
  type: 'success' | 'error' | '';
}

const Notification: React.FC<NotificationProps> = ({ text, type }) => {
  return (
    <Snackbar
      open={!!text}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      // Menggunakan gaya inline untuk animasi jika diperlukan, atau mengandalkan MUI
      TransitionProps={{
        style: {
          animation: text ? 'slideUp 0.3s ease-out forwards' : 'none',
        },
      }}
    >
      <Alert severity={type === 'success' ? 'success' : 'error'} sx={{ width: '100%', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
