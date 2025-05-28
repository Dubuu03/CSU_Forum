import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Change to your backend local URL
        changeOrigin: true,
        // Optionally rewrite the path if your backend expects /api
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
