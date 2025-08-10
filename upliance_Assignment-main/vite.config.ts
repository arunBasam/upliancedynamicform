import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignore watching node_modules to prevent EMFILE errors
      ignored: ['**/node_modules/**', '**/.git/**'],
      usePolling: true, // Helps with Windows file watching
      interval: 300,    // Polling interval in ms
    },
  },
  optimizeDeps: {
    // Pre-bundle large dependencies to reduce watcher strain
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
  },
  build: {
    chunkSizeWarningLimit: 1600, // Avoid warnings for big MUI bundles
  },
});
