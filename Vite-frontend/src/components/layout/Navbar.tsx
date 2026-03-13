import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { ROUTES } from '../../routes/paths';
import { UserCircleIcon, Squares2X2Icon, Cog6ToothIcon, ArrowRightEndOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { user: userCtx } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown);

  const handleLogout = (): void => {
    setDropdownOpen(false);
    logout();
    navigate({ to: ROUTES.HOME });
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
          <li><button onClick={() => { navigate({ to: ROUTES.HOME, hash: 'features' }); closeMenu(); }} className="nav-link-btn">Features</button></li>
          <li><button onMouseEnter={() => import('../../pages/dashboard/CommunityPage').catch(() => {})} onClick={() => { navigate({ to: ROUTES.COMMUNITY }); closeMenu(); }} className="nav-link-btn">Comunitate</button></li>
          <li><button onMouseEnter={() => import('../../pages/EvenimentePublic').catch(() => {})} onClick={() => { navigate({ to: ROUTES.EVENTS }); closeMenu(); }} className="nav-link-btn">Evenimente</button></li>
          <li>
            <Link
                to={ROUTES.ROUTES_MAP}
                className="nav-link-btn"
                activeProps={{ className: 'nav-link-btn nav-link-btn--active' }}
                onClick={closeMenu}
            >
              Trasee
            </Link>
          </li>
          <li>
            <Link
                to={ROUTES.GALLERY}
                className="nav-link-btn"
                activeProps={{ className: 'nav-link-btn nav-link-btn--active' }}
                onClick={closeMenu}
            >
              Galerie
            </Link>
          </li>
          <li>
            <Link
                to={ROUTES.CONTACT}
                className="nav-link-btn"
                activeProps={{ className: 'nav-link-btn nav-link-btn--active' }}
                onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
          {isAuthenticated && (
              <li>
                <Link
                    to={ROUTES.FEEDBACK}
                    className="nav-link-btn"
                    activeProps={{ className: 'nav-link-btn nav-link-btn--active' }}
                    onClick={closeMenu}
                >
                  Feedback
                </Link>
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
                          onMouseEnter={() => import('../../pages/dashboard/Dashboard').catch(() => {})}
                          onClick={() => { setDropdownOpen(false); navigate({ to: ROUTES.DASHBOARD }); }}
                      >
                        <Squares2X2Icon className="nav-dropdown-icon" />
                        Dashboard
                      </button>
                      <button
                          className="nav-dropdown-item"
                          onMouseEnter={() => import('../../pages/dashboard/Profile').catch(() => {})}
                          onClick={() => { setDropdownOpen(false); navigate({ to: ROUTES.PROFILE }); }}
                      >
                        <Cog6ToothIcon className="nav-dropdown-icon" />
                        Setări
                      </button>
                      {isAdmin && (
                          <button
                              className="nav-dropdown-item"
                              onMouseEnter={() => import('../../pages/admin/AdminLayout').catch(() => {})}
                              onClick={() => { setDropdownOpen(false); navigate({ to: ROUTES.ADMIN }); }}
                          >
                            <ShieldCheckIcon className="nav-dropdown-icon" />
                            Admin Panel
                          </button>
                      )}
                      <div className="nav-dropdown-divider" />
                      <button
                          className="nav-dropdown-item nav-dropdown-item--danger"
                          onClick={handleLogout}
                      >
                        <ArrowRightEndOnRectangleIcon className="nav-dropdown-icon" />
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