import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  // Production build: split vendor deps into separate cacheable chunks.
  // Each chunk only re-downloads when IT changes — app code changes don't
  // bust the React, MUI, or chart caches.
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom'],
          'vendor-router':   ['@tanstack/react-router'],
          'vendor-emotion':  ['@emotion/react', '@emotion/styled'],
          'vendor-mui':      ['@mui/material', '@mui/icons-material'],
          'vendor-antd':     ['antd', '@ant-design/icons'],
          'vendor-charts':   ['recharts'],
          'vendor-maps':     ['maplibre-gl'],
          'vendor-heroicons':['@heroicons/react'],
        },
      },
    },
    // Raise the per-chunk size warning threshold (maps/charts are legitimately large)
    chunkSizeWarningLimit: 800,
  },

  // Pre-bundle all heavy deps at startup so the browser never waits for them.
  optimizeDeps: {
    include: [
      // Core — always in the initial bundle
      'react',
      'react-dom',
      'react-dom/client',
      '@tanstack/react-router',
      // MUI — used by dashboard/forum pages (lazy but very common path)
      '@emotion/react',
      '@emotion/styled',
      '@emotion/react/jsx-runtime',
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/Box',
      '@mui/material/CircularProgress',
      '@mui/material/Typography',
      // antd, @ant-design/icons, maplibre-gl and recharts are omitted:
      // they are only imported by lazy admin/map pages, so Vite will
      // discover and bundle them on-demand the first time those pages load —
      // no need to slow down dev-server startup for every user.
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },

  // Pre-transform EVERY page on dev-server startup so the browser never
  // waits for Vite to compile a file on first navigation.
  server: {
    warmup: {
      clientFiles: [
        // Entry & shell — always executed on every page load
        './src/main.tsx',
        './src/App.tsx',
        './src/routes/paths.ts',

        // Shared components on every page
        './src/components/layout/Navbar.tsx',
        './src/components/ScrollToTop.tsx',

        // Contexts mounted at root (run on every page)
        './src/context/AuthContext.tsx',
        './src/context/UserContext.tsx',
        './src/context/ProgressContext.tsx',
        './src/context/DashboardDataContext.tsx',

        // Mock data pulled in by the root contexts
        './src/services/mock/Mockdata.tsx',
        './src/services/mock/activitati.ts',
        './src/services/mock/provocari.ts',
        './src/services/mock/cluburi.ts',
        './src/services/mock/evenimente.ts',
        './src/services/mock/trasee.ts',

        // The one non-lazy page (home is always the first paint)
        './src/pages/Home.tsx',

        // Login / Register — second-most-common first destination
        './src/pages/LoginPage.tsx',
        './src/pages/SignUp.tsx',
      ],
    },
  },
})