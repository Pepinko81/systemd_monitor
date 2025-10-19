import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/services': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/control': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
