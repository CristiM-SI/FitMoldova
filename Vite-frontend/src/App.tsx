import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'
import { ROUTES } from './routes/paths'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CLUBS} element={<Clubs />} />
          <Route path={ROUTES.PRICING} element={<Pricing />} />
          <Route path={ROUTES.LOGIN} element={<NotFound />} />
          <Route path={ROUTES.REGISTER} element={<NotFound />} />
          <Route path={ROUTES.DASHBOARD} element={<NotFound />} />
          <Route path={ROUTES.PROFILE} element={<NotFound />} />
          <Route path={ROUTES.ACTIVITIES} element={<NotFound />} />
          <Route path={ROUTES.CHALLENGES} element={<NotFound />} />
          <Route path={ROUTES.EVENTS} element={<NotFound />} />
          <Route path={ROUTES.ROUTES_MAP} element={<NotFound />} />
          <Route path={ROUTES.FORUM} element={<NotFound />} />
          <Route path={ROUTES.GALLERY} element={<NotFound />} />
          <Route path={ROUTES.FEEDBACK} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
