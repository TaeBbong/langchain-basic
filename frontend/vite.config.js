import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use VITE_BACKEND_URL to point the dev server proxy to your backend
// Defaults to http://localhost:8000 if not provided.
const backend = process.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/chat': {
        target: backend,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});

