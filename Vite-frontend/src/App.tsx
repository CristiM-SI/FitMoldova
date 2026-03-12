import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, Navigate } from '@tanstack/react-router'
import { Global } from '@emotion/react'
import { globalStyles } from './styles/globalStyles'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { ForumProvider } from './context/ForumContext'
import { lazy, Suspense } from 'react'
import ScrollToTop from './components/ScrollToTop'
import { ROUTES } from './routes/paths'

import Home from './pages/Home'

// ─── Eager imports ────────────────────────────────────────────────────────────
// Calling import() HERE (module level) starts ALL chunk downloads immediately
// and in parallel, while the user is still on the landing page.
// lazy() receives the already-started Promise so it resolves instantly once
// the download finishes — no blank screen on first navigation.
const _imp = {
    Clubs:             import('./pages/dashboard/Clubs'),
    SignUp:            import('./pages/SignUp'),
    LoginPage:         import('./pages/LoginPage'),
    Dashboard:         import('./pages/dashboard/Dashboard'),
    Activitati:        import('./pages/dashboard/Activitati'),
    CommunityPage:     import('./pages/dashboard/CommunityPage'),
    Profile:           import('./pages/dashboard/Profile'),
    Provocari:         import('./pages/dashboard/Provocari'),
    EVENTS:            import('./pages/dashboard/Evenimente'),
    EvenimentePublic:  import('./pages/EvenimentePublic'),
    Contact:           import('./pages/Contact'),
    Feedback:          import('./pages/Feedback'),
    ForumPage:         import('./pages/ForumPage'),
    FeedPage:          import('./pages/Feedpage'),
    SavedPage:         import('./pages/SavedPage'),
    NotificationsPage: import('./pages/NotificationsPage'),
    RoutesPage:        import('./pages/RoutesPage'),
    Gallery:           import('./pages/Gallery'),
    AdminLayout:       import('./pages/admin/AdminLayout'),
    AdminOverview:     import('./pages/admin/AdminOverview'),
    AdminUsers:        import('./pages/admin/AdminUsers'),
    AdminEvents:       import('./pages/admin/AdminEvents'),
    AdminClubs:        import('./pages/admin/AdminClubs'),
    AdminChallenges:   import('./pages/admin/AdminChallenges'),
    AdminRoutes:       import('./pages/admin/AdminRoutes'),
    AdminFeedback:     import('./pages/admin/AdminFeedback'),
}

const Clubs             = lazy(() => _imp.Clubs)
const SignUp            = lazy(() => _imp.SignUp)
const LoginPage         = lazy(() => _imp.LoginPage)
const Dashboard         = lazy(() => _imp.Dashboard)
const Activitati        = lazy(() => _imp.Activitati)
const CommunityPage     = lazy(() => _imp.CommunityPage)
const Profile           = lazy(() => _imp.Profile)
const Provocari         = lazy(() => _imp.Provocari)
const EVENTS            = lazy(() => _imp.EVENTS)
const EvenimentePublic  = lazy(() => _imp.EvenimentePublic)
const Contact           = lazy(() => _imp.Contact)
const Feedback          = lazy(() => _imp.Feedback)
const ForumPage         = lazy(() => _imp.ForumPage)
const FeedPage          = lazy(() => _imp.FeedPage)
const SavedPage         = lazy(() => _imp.SavedPage)
const NotificationsPage = lazy(() => _imp.NotificationsPage)
const RoutesPage        = lazy(() => _imp.RoutesPage)
const Gallery           = lazy(() => _imp.Gallery)
const AdminLayout       = lazy(() => _imp.AdminLayout)
const AdminOverview     = lazy(() => _imp.AdminOverview)
const AdminUsers        = lazy(() => _imp.AdminUsers)
const AdminEvents       = lazy(() => _imp.AdminEvents)
const AdminClubs        = lazy(() => _imp.AdminClubs)
const AdminChallenges   = lazy(() => _imp.AdminChallenges)
const AdminRoutes       = lazy(() => _imp.AdminRoutes)
const AdminFeedback     = lazy(() => _imp.AdminFeedback)

// Pure inline-CSS fallback — renders in the same frame as the Suspense trigger,
// no MUI dependency, no extra render cycle, no blank flash.
const PageLoader = () => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0A1628',
    }}>
        <div style={{
            width: 36, height: 36,
            border: '3px solid rgba(255,255,255,0.08)',
            borderTopColor: '#0066FF',
            borderRadius: '50%',
            animation: 'lspin 0.7s linear infinite',
        }} />
    </div>
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

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',       // preload chunks on hover/focus — makes navigation instant
    defaultPreloadDelay: 80,        // start after 80 ms of intent to avoid noise
    defaultStaleTime: 5 * 60_000,   // treat loaded route data as fresh for 5 min
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export default function App() {
    return <RouterProvider router={router} />
}