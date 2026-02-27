import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { useAuth } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import { ROUTES } from './routes/paths'
import SignUp from './pages/SignUp'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Activitati from './pages/Activitati'
import CommunityPage from './pages/CommunityPage'
import Profile from './pages/Profile'
import Provocari from './pages/Provocari'
import EVENTS from './pages/Evenimente'
import EvenimentePublic from './pages/EvenimentePublic'
import Contact from './pages/Contact'
import Feedback from './pages/Feedback'
import ForumPage from './pages/ForumPage'
import RoutesPage from './pages/RoutesPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminUsers from './pages/admin/AdminUsers'
import AdminEvents from './pages/admin/AdminEvents'
import AdminClubs from './pages/admin/AdminClubs'
import AdminChallenges from './pages/admin/AdminChallenges'
import AdminRoutes from './pages/admin/AdminRoutes'


// Guard pentru rutele protejate (necesită autentificare)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="route-guard-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Se încarcă...</p>
                </div>
            </div>
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

    if (loading) return null;

    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};

// Guard pentru rutele de admin (necesită autentificare + rol admin)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <UserProvider>
                    <ProgressProvider>
                        <DashboardDataProvider>
                            <Routes>
                                {/* Rute publice */}
                                <Route path={ROUTES.HOME} element={<Home />} />
                                <Route path={ROUTES.CLUBS} element={<Clubs />} />
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
                                </Route>

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                            </Routes>
                        </DashboardDataProvider>
                    </ProgressProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
