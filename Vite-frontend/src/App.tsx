import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, Navigate } from '@tanstack/react-router'
import { globalStyles } from './styles/globalStyles'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { ForumProvider } from './context/ForumContext'
import { lazy, Suspense } from 'react'
import ScrollToTop from './components/ScrollToTop'
import { ROUTES } from './routes/paths'
import { useRoutePreloader } from './hooks/useRoutePreloader'

import Home from './pages/Home'

const Clubs             = lazy(() => import('./pages/dashboard/Clubs'))
const SignUp            = lazy(() => import('./pages/SignUp'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const Dashboard         = lazy(() => import('./pages/dashboard/Dashboard'))
const Activitati        = lazy(() => import('./pages/dashboard/Activitati'))
const CommunityPage     = lazy(() => import('./pages/dashboard/CommunityPage'))
const Profile           = lazy(() => import('./pages/dashboard/Profile'))
const Provocari         = lazy(() => import('./pages/dashboard/Provocari'))
const EVENTS            = lazy(() => import('./pages/dashboard/Evenimente'))
const EvenimentePublic  = lazy(() => import('./pages/EvenimentePublic'))
const Contact           = lazy(() => import('./pages/Contact'))
const Feedback          = lazy(() => import('./pages/Feedback'))
const ForumPage         = lazy(() => import('./pages/ForumPage'))
const FeedPage          = lazy(() => import('./pages/Feedpage'))
const SavedPage         = lazy(() => import('./pages/SavedPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const RoutesPage        = lazy(() => import('./pages/RoutesPage'))
const Gallery           = lazy(() => import('./pages/Gallery'))
const AdminLayout       = lazy(() => import('./pages/admin/AdminLayout'))
const AdminOverview     = lazy(() => import('./pages/admin/AdminOverview'))
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'))
const AdminEvents       = lazy(() => import('./pages/admin/AdminEvents'))
const AdminClubs        = lazy(() => import('./pages/admin/AdminClubs'))
const AdminChallenges   = lazy(() => import('./pages/admin/AdminChallenges'))
const AdminActivities   = lazy(() => import('./pages/admin/AdminActivities'))
const AdminRoutes       = lazy(() => import('./pages/admin/AdminRoutes'))
const AdminGallery      = lazy(() => import('./pages/admin/AdminGallery'))
const AdminFeedback     = lazy(() => import('./pages/admin/AdminFeedback'))
const AdminContact      = lazy(() => import('./pages/admin/AdminContact'))
const ActivitiesPage    = lazy(() => import('./pages/ActivitiesPage'))
const AccessDenied      = lazy(() => import('./pages/AccessDenied'))
const ClubDetailPage    = lazy(() => import('./pages/ClubDetailPage'))
const MessagesPage      = lazy(() => import('./pages/MessagesPage'))
const DetailPage        = lazy(() => import('./pages/DetailPage'))

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth()
    if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} />
    return <>{children}</>
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth()
    if (!isAuthenticated) {
        console.warn('[AdminRoute] Acces blocat: utilizator neautentificat.')
        return <AccessDenied reason="unauthenticated" />
    }
    if (!isAdmin) {
        console.warn('[AdminRoute] Acces blocat: utilizatorul nu are rol de Admin.')
        return <AccessDenied reason="unauthorized" />
    }
    return <>{children}</>
}

const PAGE_LOADER_KEYFRAMES = `@keyframes _fmSpin{to{transform:rotate(360deg)}}`

const PageLoader: React.FC = () => (
    <>
        <style>{PAGE_LOADER_KEYFRAMES}</style>
        <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0b1120',
            zIndex: 9999,
        }}>
            <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '3px solid rgba(26,111,255,0.18)',
                borderTopColor: '#1a6fff',
                animation: '_fmSpin 0.7s linear infinite',
            }} />
        </div>
    </>
)

const RootComponent: React.FC = () => {
    useRoutePreloader()
    return (
        <>
            <style>{globalStyles}</style>
            <AuthProvider>
                <UserProvider>
                    <ProgressProvider>
                        <DashboardDataProvider>
                            <ScrollToTop />
                            <Suspense fallback={<PageLoader />}>
                                <Outlet />
                            </Suspense>
                        </DashboardDataProvider>
                    </ProgressProvider>
                </UserProvider>
            </AuthProvider>
        </>
    )
}

const rootRoute = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => <Navigate to={ROUTES.HOME} />,
})

const protectedLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'protectedLayout',
    component: () => {
        const { isAuthenticated } = useAuth()
        if (!isAuthenticated) return <Navigate to={ROUTES.HOME} />
        return <Outlet />
    },
})

const forumLayoutRoute = createRoute({
    getParentRoute: () => protectedLayoutRoute,
    id: 'forumLayout',
    component: () => (
        <ForumProvider>
            <Outlet />
        </ForumProvider>
    ),
})

// ── Public routes ─────────────────────────────────────────────────────────────
const homeRoute             = createRoute({ getParentRoute: () => rootRoute, path: '/',        component: Home })
const clubsRoute            = createRoute({ getParentRoute: () => rootRoute, path: '/clubs',   component: () => <Clubs /> })
const galleryRoute          = createRoute({ getParentRoute: () => rootRoute, path: '/gallery', component: () => <Gallery /> })
const eventsRoute           = createRoute({ getParentRoute: () => rootRoute, path: '/events',  component: () => <EvenimentePublic /> })
const routesMapRoute        = createRoute({ getParentRoute: () => rootRoute, path: '/routes',  component: () => <RoutesPage /> })
const contactRoute          = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: () => <Contact /> })
const activitiesPublicRoute = createRoute({ getParentRoute: () => rootRoute, path: '/activitati', component: () => <ActivitiesPage /> })
const loginRoute            = createRoute({ getParentRoute: () => rootRoute, path: '/login',   component: () => <PublicRoute><LoginPage /></PublicRoute> })
const registerRoute         = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: () => <PublicRoute><SignUp /></PublicRoute> })
const accessDeniedRoute     = createRoute({ getParentRoute: () => rootRoute, path: '/access-denied', component: () => <AccessDenied /> })

// ── Detail routes ─────────────────────────────────────────────────────────────
const eventDetailRoute     = createRoute({ getParentRoute: () => rootRoute, path: '/events/$id',     component: () => <DetailPage entity="event" /> })
const clubDetailRoute      = createRoute({ getParentRoute: () => rootRoute, path: '/clubs/$id',      component: () => <ClubDetailPage /> })
const challengeDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/challenges/$id', component: () => <DetailPage entity="challenge" /> })

// ── Protected routes ──────────────────────────────────────────────────────────
const dashboardRoute       = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/dashboard',        component: () => <Dashboard /> })
const profileRoute         = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/profile',          component: () => <Profile /> })
const communityRoute       = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/community',        component: () => <CommunityPage /> })
const activitiesRoute      = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/activities',       component: () => <Activitati /> })
const challengesRoute      = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/challenges',       component: () => <Provocari /> })
const eventsDashboardRoute = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/dashboard/events', component: () => <EVENTS /> })
const feedbackRoute        = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/feedback',         component: () => <Feedback /> })
// ↓ messagesRoute este în protectedLayoutRoute — NU în forumLayoutRoute
const messagesRoute        = createRoute({ getParentRoute: () => protectedLayoutRoute, path: '/messages',         component: () => <MessagesPage /> })

// ── Forum routes ──────────────────────────────────────────────────────────────
const forumRoute         = createRoute({ getParentRoute: () => forumLayoutRoute, path: '/forum',         component: () => <ForumPage /> })
const feedRoute          = createRoute({ getParentRoute: () => forumLayoutRoute, path: '/feed',          component: () => <FeedPage /> })
const savedRoute         = createRoute({ getParentRoute: () => forumLayoutRoute, path: '/saved',         component: () => <SavedPage /> })
const notificationsRoute = createRoute({ getParentRoute: () => forumLayoutRoute, path: '/notifications', component: () => <NotificationsPage /> })

// ── Admin routes ──────────────────────────────────────────────────────────────
const adminRoute           = createRoute({ getParentRoute: () => rootRoute,  path: '/admin',       component: () => <AdminRoute><AdminLayout /></AdminRoute> })
const adminIndexRoute      = createRoute({ getParentRoute: () => adminRoute, path: '/',           component: () => <AdminOverview /> })
const adminUsersRoute      = createRoute({ getParentRoute: () => adminRoute, path: '/users',      component: () => <AdminUsers /> })
const adminEventsRoute     = createRoute({ getParentRoute: () => adminRoute, path: '/events',     component: () => <AdminEvents /> })
const adminClubsRoute      = createRoute({ getParentRoute: () => adminRoute, path: '/clubs',      component: () => <AdminClubs /> })
const adminChallengesRoute = createRoute({ getParentRoute: () => adminRoute, path: '/challenges', component: () => <AdminChallenges /> })
const adminRoutesRoute     = createRoute({ getParentRoute: () => adminRoute, path: '/routes',     component: () => <AdminRoutes /> })
const adminFeedbackRoute   = createRoute({ getParentRoute: () => adminRoute, path: '/feedback',   component: () => <AdminFeedback /> })
const adminContactRoute    = createRoute({ getParentRoute: () => adminRoute, path: '/contact',    component: () => <AdminContact /> })
const adminActivitiesRoute = createRoute({ getParentRoute: () => adminRoute, path: '/activities', component: () => <AdminActivities /> })
const adminGalleryRoute    = createRoute({ getParentRoute: () => adminRoute, path: '/gallery',    component: () => <AdminGallery /> })

const routeTree = rootRoute.addChildren([
    homeRoute,
    clubsRoute,
    galleryRoute,
    eventsRoute,
    routesMapRoute,
    contactRoute,
    activitiesPublicRoute,
    loginRoute,
    registerRoute,
    accessDeniedRoute,
    eventDetailRoute,
    clubDetailRoute,
    challengeDetailRoute,
    protectedLayoutRoute.addChildren([
        dashboardRoute,
        profileRoute,
        communityRoute,
        activitiesRoute,
        challengesRoute,
        eventsDashboardRoute,
        feedbackRoute,
        messagesRoute,          // ← aici, direct în protectedLayout
        forumLayoutRoute.addChildren([
            forumRoute,
            feedRoute,
            savedRoute,
            notificationsRoute, // ← notifications rămâne în forumLayout (are nevoie de ForumProvider)
        ]),
    ]),
    adminRoute.addChildren([
        adminIndexRoute,
        adminUsersRoute,
        adminEventsRoute,
        adminClubsRoute,
        adminChallengesRoute,
        adminActivitiesRoute,
        adminRoutesRoute,
        adminFeedbackRoute,
        adminContactRoute,
        adminGalleryRoute,
    ]),
])

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadDelay: 80,
    defaultStaleTime: 5 * 60_000,
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export default function App() {
    return <RouterProvider router={router} />
}
