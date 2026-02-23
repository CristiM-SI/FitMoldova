import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { ROUTES } from '../../routes/paths';
import { scrollToSection } from '../../utils/navigation';
import { UserCircleIcon, Squares2X2Icon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import '../../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { user: userCtx } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (): void => {
    setDropdownOpen(false);
    logout();
    navigate(ROUTES.HOME);
  };

  const handleSectionClick = (sectionId: string) => (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const closeMenu = () => setMenuOpen(false);

  const displayName = userCtx
    ? `${userCtx.firstName} ${userCtx.lastName}`
    : user
      ? `${user.firstName} ${user.lastName}`
      : 'Profil';

  return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to={ROUTES.HOME} className="logo">FitMoldova</Link>

        <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
          <li><button onClick={() => { handleSectionClick('features')(new MouseEvent('click') as any); closeMenu(); }} className="nav-link-btn">Features</button></li>
          <li><button onClick={() => { navigate(ROUTES.COMMUNITY); closeMenu(); }} className="nav-link-btn">Comunitate</button></li>
          <li><button onClick={() => { handleSectionClick('events')(new MouseEvent('click') as any); closeMenu(); }} className="nav-link-btn">Evenimente</button></li>
          <li>
            <NavLink
              to={ROUTES.CONTACT}
              className={({ isActive }) => `nav-link-btn${isActive ? ' nav-link-btn--active' : ''}`}
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink
                to={ROUTES.FEEDBACK}
                className={({ isActive }) => `nav-link-btn${isActive ? ' nav-link-btn--active' : ''}`}
                onClick={closeMenu}
              >
                Feedback
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="nav-user-menu" ref={dropdownRef}>
              <button
                className={`nav-avatar-btn ${dropdownOpen ? 'nav-avatar-btn--active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={displayName}
                aria-label="Meniu utilizator"
              >
                <UserCircleIcon className="nav-avatar-icon" />
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <span className="nav-dropdown-name">{displayName}</span>
                  </div>
                  <div className="nav-dropdown-divider" />
                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setDropdownOpen(false); navigate(ROUTES.DASHBOARD); }}
                  >
                    <Squares2X2Icon className="nav-dropdown-icon" />
                    Dashboard
                  </button>
                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setDropdownOpen(false); navigate(ROUTES.PROFILE); }}
                  >
                    <Cog6ToothIcon className="nav-dropdown-icon" />
                    Setări
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    className="nav-dropdown-item nav-dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <ArrowRightOnRectangleIcon className="nav-dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-outline">Login</Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary">Începe Acum</Link>
              </>
          )}
          <button
            className={`nav-hamburger ${menuOpen ? 'nav-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Deschide meniu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
  );
};

export default Navbar;