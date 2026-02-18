import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'  // ← adaugă
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import Profile from './pages/Profile'  // ← adaugă
import { ROUTES } from './routes/paths'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'

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
        return <Navigate to={ROUTES.REGISTER} state={{ from: location }} replace />;
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
                <UserProvider>  {/* ← adaugă */}
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
                            path={ROUTES.PROFILE}  // ← adaugă ruta de profil
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                    </Routes>
                </UserProvider>  {/* ← închide */}
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App