import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Global } from '@emotion/react'
import { globalStyles } from './styles/globalStyles'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { useAuth } from './context/AuthContext'
import { lazy, Suspense } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import ScrollToTop from './components/ScrollToTop'
import { ROUTES } from './routes/paths'

// Eager-load only the landing page for instant first paint
import Home from './pages/Home'

// Lazy-load everything else — each page becomes its own JS chunk
const Clubs          = lazy(() => import('./pages/dashboard/Clubs'))
const SignUp         = lazy(() => import('./pages/SignUp'))
const LoginPage      = lazy(() => import('./pages/LoginPage'))
const Dashboard      = lazy(() => import('./pages/dashboard/Dashboard'))
const Activitati     = lazy(() => import('./pages/dashboard/Activitati'))
const CommunityPage  = lazy(() => import('./pages/dashboard/CommunityPage'))
const Profile        = lazy(() => import('./pages/dashboard/Profile'))
const Provocari      = lazy(() => import('./pages/dashboard/Provocari'))
const EVENTS         = lazy(() => import('./pages/dashboard/Evenimente'))
const EvenimentePublic = lazy(() => import('./pages/EvenimentePublic'))
const Contact        = lazy(() => import('./pages/Contact'))
const Feedback       = lazy(() => import('./pages/Feedback'))
const ForumPage      = lazy(() => import('./pages/ForumPage'))
const RoutesPage     = lazy(() => import('./pages/RoutesPage'))
const Gallery        = lazy(() => import('./pages/Gallery'))
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'))
const AdminOverview  = lazy(() => import('./pages/admin/AdminOverview'))
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'))
const AdminEvents    = lazy(() => import('./pages/admin/AdminEvents'))
const AdminClubs     = lazy(() => import('./pages/admin/AdminClubs'))
const AdminChallenges = lazy(() => import('./pages/admin/AdminChallenges'))
const AdminRoutes    = lazy(() => import('./pages/admin/AdminRoutes'))
const AdminFeedback  = lazy(() => import('./pages/admin/AdminFeedback'))

const PageLoader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#0A1628' }}>
        <CircularProgress size={40} />
    </Box>
)

// Guard pentru rutele protejate (necesită autentificare)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Se încarcă...
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Guard pentru rutele publice (redirecționează dacă ești deja autentificat)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, rgba(0,102,255,0.15), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,208,132,0.1), transparent 50%), #0A1628',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.04em', marginBottom: '2rem', fontFamily: "'Rajdhani', 'Space Mono', monospace" }}>
                    <span style={{ color: '#fff' }}>FIT</span>
                    <span style={{ color: '#0066FF' }}>MOLDOVA</span>
                </div>
                <div style={{ width: 44, height: 44, margin: '0 auto 1.25rem', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#0066FF', borderRadius: '50%', animation: 'lspin 0.8s linear infinite' }}></div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500 }}>Se încarcă...</p>
            </div>
        </div>
    );

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};

// Guard pentru rutele de admin (necesită autentificare + rol admin)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, rgba(0,102,255,0.15), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,208,132,0.1), transparent 50%), #0A1628',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.04em', marginBottom: '2rem', fontFamily: "'Rajdhani', 'Space Mono', monospace" }}>
                    <span style={{ color: '#fff' }}>FIT</span>
                    <span style={{ color: '#0066FF' }}>MOLDOVA</span>
                </div>
                <div style={{ width: 44, height: 44, margin: '0 auto 1.25rem', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#0066FF', borderRadius: '50%', animation: 'lspin 0.8s linear infinite' }}></div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500 }}>Se încarcă...</p>
            </div>
        </div>
    );

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <>
        <Global styles={globalStyles} />
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <UserProvider>
                    <ProgressProvider>
                        <DashboardDataProvider>
                            <Suspense fallback={<PageLoader />}>
                            <Routes>
                                {/* Rute publice */}
                                <Route path={ROUTES.HOME} element={<Home />} />
                                <Route path={ROUTES.CLUBS} element={<Clubs />} />
                                <Route path={ROUTES.GALLERY} element={<Gallery />} />
                                <Route
                                    path={ROUTES.LOGIN}
                                    element={
                                        <PublicRoute>
                                            <LoginPage />
                                        </PublicRoute>
                                    }
                                />
                                <Route
                                    path={ROUTES.REGISTER}
                                    element={
                                        <PublicRoute>
                                            <SignUp />
                                        </PublicRoute>
                                    }
                                />
                                <Route
                                    path={ROUTES.LOGIN}
                                    element={<LoginPage />}
                                />

                                {/* Rute protejate */}
                                <Route
                                    path={ROUTES.DASHBOARD}
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path={ROUTES.PROFILE}
                                    element={
                                        <ProtectedRoute>
                                            <Profile/>
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path={ROUTES.COMMUNITY}
                                    element={
                                        <ProtectedRoute>
                                            <CommunityPage />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path={ROUTES.ACTIVITIES}
                                    element={
                                        <ProtectedRoute>
                                            <Activitati />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path={ROUTES.CHALLENGES}
                                    element={
                                        <ProtectedRoute>
                                            <Provocari />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Pagina publică de evenimente */}
                                <Route path={ROUTES.EVENTS} element={<EvenimentePublic />} />

                                {/* Pagina de evenimente din dashboard (protejată) */}
                                <Route
                                    path={ROUTES.EVENTS_DASHBOARD}
                                    element={
                                        <ProtectedRoute>
                                            <EVENTS />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Rută publică Trasee */}
                                <Route path={ROUTES.ROUTES_MAP} element={<RoutesPage />} />

                                {/* Rută publică Contact */}
                                <Route path={ROUTES.CONTACT} element={<Contact />} />

                                {/* Rută protejată Feedback */}
                                <Route
                                    path={ROUTES.FEEDBACK}
                                    element={
                                        <ProtectedRoute>
                                            <Feedback />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Rută protejată Forum */}
                                <Route
                                    path={ROUTES.FORUM}
                                    element={
                                        <ProtectedRoute>
                                            <ForumPage />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Rute Admin */}
                                <Route
                                    path={ROUTES.ADMIN}
                                    element={
                                        <AdminRoute>
                                            <AdminLayout />
                                        </AdminRoute>
                                    }
                                >
                                    <Route index element={<AdminOverview />} />
                                    <Route path="users" element={<AdminUsers />} />
                                    <Route path="events" element={<AdminEvents />} />
                                    <Route path="clubs" element={<AdminClubs />} />
                                    <Route path="challenges" element={<AdminChallenges />} />
                                    <Route path="routes" element={<AdminRoutes />} />
                                    <Route path="feedback" element={<AdminFeedback />} />
                                </Route>

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                            </Routes>
                            </Suspense>
                        </DashboardDataProvider>
                    </ProgressProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
        </>
    )
}

export default App
