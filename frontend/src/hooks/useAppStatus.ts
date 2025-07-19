// src/hooks/useAppStatus.ts
import { useState, useCallback } from 'react';

type MessageType = 'success' | 'error' | '';

interface AppStatus {
  isLoading: boolean;
  message: { text: string; type: MessageType };
  setIsLoading: (loading: boolean) => void;
  showNotification: (text: string, type: MessageType) => void;
  clearNotification: () => void;
}

export const useAppStatus = (): AppStatus => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: MessageType }>({ text: '', type: '' });

  const showNotification = useCallback((text: string, type: MessageType) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000); // Notifikasi akan hilang setelah 3 detik
  }, []);

  const clearNotification = useCallback(() => {
    setMessage({ text: '', type: '' });
  }, []);

  return {
    isLoading,
    message,
    setIsLoading,
    showNotification,
    clearNotification,
  };
};
