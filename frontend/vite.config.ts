// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      // Vite akan secara otomatis mencari postcss.config.js atau postcss.config.cjs di root
      // Tidak perlu konfigurasi eksplisit di sini selain objek kosong
    },
  },
  server: {
    port: 5173, // Pastikan port frontend Anda
    open: true, // Otomatis membuka browser
  },
});
