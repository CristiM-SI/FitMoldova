import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';  // ← adaugă
import UserAvatar from '../UserAvatar';  // ← adaugă
import { ROUTES } from '../../routes/paths';
import { scrollToSection } from '../../utils/navigation';
import '../../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();  // ← adaugă
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to={ROUTES.HOME} className="logo">FitMoldova</Link>

        <ul className="nav-links">
          <li><button onClick={handleSectionClick('features')} className="nav-link-btn">Features</button></li>
          <li><button onClick={() => navigate(ROUTES.COMMUNITY)} className="nav-link-btn">Comunitate</button></li>
          <li><button onClick={handleSectionClick('events')} className="nav-link-btn">Evenimente</button></li>
          <li><button onClick={handleSectionClick('pricing')} className="nav-link-btn">Prețuri</button></li>
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
              <>
                <Link to={ROUTES.DASHBOARD} className="btn btn-outline">Dashboard</Link>
                {user && <UserAvatar />}  {/* ← adaugă iconița aici */}
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </>
          ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-outline">Login</Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary">Începe Acum</Link>
              </>
          )}
        </div>
      </nav>
  );
};

export default Navbar;