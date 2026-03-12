import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  // Pre-bundle all heavy deps at startup so the browser never waits for them
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@tanstack/react-router',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/react/jsx-runtime',
      '@mui/material',
      '@mui/material/Box',
      '@mui/material/CircularProgress',
      '@mui/material/Typography',
      '@mui/icons-material',
      'antd',
      '@ant-design/icons',
      '@heroicons/react/24/solid',
      'recharts',
      'leaflet',
      'react-leaflet',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },

  // Pre-transform the hot path so files are ready before the browser asks
  server: {
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/Home.tsx',
        './src/components/layout/Navbar.tsx',
        './src/styles/globalStyles.ts',
      ],
    },
  },
})
