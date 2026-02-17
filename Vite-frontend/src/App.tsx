import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import { ROUTES } from './routes/paths'
import SignUp from './pages/SignUp'
// ...


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path={ROUTES.REGISTER} element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
