import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ProgressProvider } from './context/ProgressContext'
import { DashboardDataProvider } from './context/DashboardDataContext'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import { ROUTES } from './routes/paths'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Activitati from './pages/Activitati'
import CommunityPage from './pages/CommunityPage'
import Profile from './pages/Profile'
import Provocari from './pages/Provocari'
import LoginPage from './pages/LoginPage'


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

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UserProvider>
                    <ProgressProvider>
                        <DashboardDataProvider>
                            <Routes>
                                {/* Rute publice */}
                                <Route path={ROUTES.HOME} element={<Home />} />
                                <Route path={ROUTES.CLUBS} element={<Clubs />} />
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
                                    element={
                                        <PublicRoute>
                                            <LoginPage />
                                        </PublicRoute>
                                    }
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