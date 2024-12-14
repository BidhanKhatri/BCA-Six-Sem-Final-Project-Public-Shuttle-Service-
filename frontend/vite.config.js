import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/proxy': {
        target: 'http://localhost:3000',  // Backend server address
        changeOrigin: true,  // Change the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/proxy/, '')  // Remove /proxy from the request URL
      }
    }
  },
  assetsInclude: ['**/*.riv'],
  plugins: [react()],
});
