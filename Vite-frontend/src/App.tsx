import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, Navigate, redirect } from '@tanstack/react-router'
import { Global } from '@emotion/react'
import { globalStyles } from './styles/globalStyles'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { ForumProvider } from './context/ForumContext'
import { lazy, Suspense } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import ScrollToTop from './components/ScrollToTop'
import { ROUTES } from './routes/paths'

import Home from './pages/Home'

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
const FeedPage       = lazy(() => import('./pages/Feedpage'))
const SavedPage      = lazy(() => import('./pages/SavedPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
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

const LoadingScreen = () => (
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
)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <LoadingScreen />
    if (!isAuthenticated) return <Navigate to={ROUTES.HOME} />
    return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <LoadingScreen />
    if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} />
    return <>{children}</>
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth()
    if (loading) return <LoadingScreen />
    if (!isAuthenticated || !isAdmin) return <Navigate to={ROUTES.HOME} />
    return <>{children}</>
}

// ── Root Layout ─────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
    component: () => (
        <>
            <Global styles={globalStyles} />
            <AuthProvider>
                <UserProvider>
                    <ProgressProvider>
                        <DashboardDataProvider>
                            <ForumProvider>
                                <ScrollToTop />
                                <Suspense fallback={<PageLoader />}>
                                    <Outlet />
                                </Suspense>
                            </ForumProvider>
                        </DashboardDataProvider>
                    </ProgressProvider>
                </UserProvider>
            </AuthProvider>
        </>
    ),
    notFoundComponent: () => <Navigate to={ROUTES.HOME} />,
})

// ── Public routes ────────────────────────────────────────────────────────────
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const clubsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/clubs', component: () => <Clubs /> })
const galleryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gallery', component: () => <Gallery /> })
const eventsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/events', component: () => <EvenimentePublic /> })
const routesMapRoute = createRoute({ getParentRoute: () => rootRoute, path: '/routes', component: () => <RoutesPage /> })
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: () => <Contact /> })

const loginRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/login',
    component: () => <PublicRoute><LoginPage /></PublicRoute>,
})
const registerRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/register',
    component: () => <PublicRoute><SignUp /></PublicRoute>,
})

// ── Protected routes ─────────────────────────────────────────────────────────
const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/dashboard',
    component: () => <ProtectedRoute><Dashboard /></ProtectedRoute>,
})
const profileRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/profile',
    component: () => <ProtectedRoute><Profile /></ProtectedRoute>,
})
const communityRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/community',
    component: () => <ProtectedRoute><CommunityPage /></ProtectedRoute>,
})
const activitiesRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/activities',
    component: () => <ProtectedRoute><Activitati /></ProtectedRoute>,
})
const challengesRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/challenges',
    component: () => <ProtectedRoute><Provocari /></ProtectedRoute>,
})
const eventsDashboardRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/dashboard/events',
    component: () => <ProtectedRoute><EVENTS /></ProtectedRoute>,
})
const forumRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/forum',
    component: () => <ProtectedRoute><ForumPage /></ProtectedRoute>,
})
const feedRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/feed',
    component: () => <ProtectedRoute><FeedPage /></ProtectedRoute>,
})
const savedRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/saved',
    component: () => <ProtectedRoute><SavedPage /></ProtectedRoute>,
})
const notificationsRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/notifications',
    component: () => <ProtectedRoute><NotificationsPage /></ProtectedRoute>,
})
const feedbackRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/feedback',
    component: () => <ProtectedRoute><Feedback /></ProtectedRoute>,
})

// ── Admin routes ─────────────────────────────────────────────────────────────
const adminRoute = createRoute({
    getParentRoute: () => rootRoute, path: '/admin',
    component: () => <AdminRoute><AdminLayout /></AdminRoute>,
})
const adminIndexRoute = createRoute({ getParentRoute: () => adminRoute, path: '/', component: () => <AdminOverview /> })
const adminUsersRoute = createRoute({ getParentRoute: () => adminRoute, path: '/users', component: () => <AdminUsers /> })
const adminEventsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/events', component: () => <AdminEvents /> })
const adminClubsRoute = createRoute({ getParentRoute: () => adminRoute, path: '/clubs', component: () => <AdminClubs /> })
const adminChallengesRoute = createRoute({ getParentRoute: () => adminRoute, path: '/challenges', component: () => <AdminChallenges /> })
const adminRoutesRoute = createRoute({ getParentRoute: () => adminRoute, path: '/routes', component: () => <AdminRoutes /> })
const adminFeedbackRoute = createRoute({ getParentRoute: () => adminRoute, path: '/feedback', component: () => <AdminFeedback /> })

const routeTree = rootRoute.addChildren([
    homeRoute,
    clubsRoute,
    galleryRoute,
    eventsRoute,
    routesMapRoute,
    contactRoute,
    loginRoute,
    registerRoute,
    dashboardRoute,
    profileRoute,
    communityRoute,
    activitiesRoute,
    challengesRoute,
    eventsDashboardRoute,
    forumRoute,
    feedRoute,
    savedRoute,
    notificationsRoute,
    feedbackRoute,
    adminRoute.addChildren([
        adminIndexRoute,
        adminUsersRoute,
        adminEventsRoute,
        adminClubsRoute,
        adminChallengesRoute,
        adminRoutesRoute,
        adminFeedbackRoute,
    ]),
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export default function App() {
    return <RouterProvider router={router} />
}