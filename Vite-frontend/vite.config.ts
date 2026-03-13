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
      'react',
      'react-dom',
      'react-dom/client',
      '@tanstack/react-router',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/react/jsx-runtime',
      '@mui/material',
      '@mui/material/styles',
      '@mui/material/Box',
      '@mui/material/CircularProgress',
      '@mui/material/Typography',
      '@mui/icons-material',
      'antd',
      '@ant-design/icons',
      '@heroicons/react/24/solid',
      'recharts',
      'maplibre-gl',
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
        // Entry & shell
        './src/main.tsx',
        './src/App.tsx',
        './src/styles/globalStyles.ts',
        './src/routes/paths.ts',

        // Shared components (mounted on every page)
        './src/components/layout/Navbar.tsx',
        './src/components/layout/Footer.tsx',
        './src/components/ScrollToTop.tsx',

        // Contexts (all initialized at startup)
        './src/context/AuthContext.tsx',
        './src/context/UserContext.tsx',
        './src/context/ProgressContext.tsx',
        './src/context/DashboardDataContext.tsx',
        './src/context/ForumContext.tsx',
        './src/context/useDashboardData.ts',

        // Styles & utilities
        './src/styles/forumStyles.ts',
        './src/utils/forumHelpers.tsx',
        './src/utils/navigation.ts',
        './src/hooks/useClickOutside.ts',
        './src/hooks/useLoginForm.ts',

        // Mock data (imported by contexts at startup)
        './src/services/mock/Mockdata.tsx',
        './src/services/mock/activitati.ts',
        './src/services/mock/provocari.ts',
        './src/services/mock/cluburi.ts',
        './src/services/mock/evenimente.ts',
        './src/services/mock/trasee.ts',
        './src/services/mock/forum.ts',
        './src/services/mock/community.ts',

        // Public pages
        './src/pages/Home.tsx',
        './src/pages/LoginPage.tsx',
        './src/pages/SignUp.tsx',
        './src/pages/Contact.tsx',
        './src/pages/RoutesPage.tsx',
        './src/pages/Gallery.tsx',
        './src/pages/EvenimentePublic.tsx',
        './src/pages/Feedback.tsx',
        './src/pages/NotificationsPage.tsx',
        './src/pages/NotFound.tsx',

        // Forum / Feed pages
        './src/pages/ForumPage.tsx',
        './src/pages/Feedpage.tsx',
        './src/pages/SavedPage.tsx',

        // Dashboard pages
        './src/pages/dashboard/Dashboard.tsx',
        './src/pages/dashboard/DashboardLayout.tsx',
        './src/pages/dashboard/Activitati.tsx',
        './src/pages/dashboard/Provocari.tsx',
        './src/pages/dashboard/Profile.tsx',
        './src/pages/dashboard/Clubs.tsx',
        './src/pages/dashboard/CommunityPage.tsx',
        './src/pages/dashboard/Evenimente.tsx',

        // Admin pages
        './src/pages/admin/AdminLayout.tsx',
        './src/pages/admin/AdminOverview.tsx',
        './src/pages/admin/AdminUsers.tsx',
        './src/pages/admin/AdminEvents.tsx',
        './src/pages/admin/AdminClubs.tsx',
        './src/pages/admin/AdminChallenges.tsx',
        './src/pages/admin/AdminRoutes.tsx',
        './src/pages/admin/AdminFeedback.tsx',

        // Map components (heavy — warm up early)
        './src/components/MoldovaRoutesMap.tsx',
        './src/components/RoutesSidebar.tsx',
        './src/components/EventMap.tsx',
      ],
    },
  },
})