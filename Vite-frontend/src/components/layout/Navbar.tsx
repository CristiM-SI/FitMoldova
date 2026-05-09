import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { ROUTES } from '../../routes/paths';
import { UserCircleIcon, Squares2X2Icon, Cog6ToothIcon, ArrowRightEndOnRectangleIcon, ShieldCheckIcon, BellIcon } from '@heroicons/react/24/solid';
import notificationApi from '../../services/api/notificationApi';
import type { NotificationInfoDto } from '../../types/Notification';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationInfoDto[]>([]);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { user: userCtx } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
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

  const closeNotif = useCallback(() => setNotifOpen(false), []);
  useClickOutside(notifRef, closeNotif);

  // Fetch unread count pe mount și la fiecare 60s
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUnread = () => {
      notificationApi.getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
      notificationApi.getAll()
        .then(list => setNotifications(list.slice(0, 8)))
        .catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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
                    to={ROUTES.ACTIVITIES_PUBLIC}
                    className="nav-link-btn"
                    activeProps={{ className: 'nav-link-btn nav-link-btn--active' }}
                    onClick={closeMenu}
                >
                    Activități
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
          {isAuthenticated && (
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                    className="nav-avatar-btn"
                    onClick={() => { setNotifOpen(o => !o); setDropdownOpen(false); }}
                    aria-label="Notificări"
                    title="Notificări"
                    style={{ position: 'relative' }}
                >
                  <BellIcon style={{ width: 22, height: 22, color: '#ffffff' }} />
                  {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute', top: 2, right: 2,
                        background: '#ffffff', color: '#0f172a',
                        fontSize: '0.6rem', fontWeight: 800,
                        borderRadius: '999px', minWidth: 16, height: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px', lineHeight: 1,
                      }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                  )}
                </button>

                {notifOpen && (
                    <div className="nav-dropdown" style={{ width: 320, maxHeight: 400, overflowY: 'auto', right: 0 }}>
                      <div className="nav-dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="nav-dropdown-name">Notificări</span>
                        {unreadCount > 0 && (
                            <button
                                style={{ background: 'none', border: 'none', color: '#1a6fff', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                                onClick={() => {
                                  notificationApi.markAllAsRead().catch(() => {});
                                  setUnreadCount(0);
                                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                                }}
                            >
                              Marchează toate
                            </button>
                        )}
                      </div>
                      <div className="nav-dropdown-divider" />
                      {notifications.length === 0 ? (
                          <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                            Nicio notificare nouă
                          </div>
                      ) : (
                          notifications.map(n => (
                              <div key={n.id} className="nav-dropdown-item" style={{
                                background: n.isRead ? 'transparent' : 'rgba(26,111,255,0.06)',
                                display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start',
                                padding: '0.6rem 1rem',
                              }}
                              onClick={() => {
                                notificationApi.markAsRead(n.id).catch(() => {});
                                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
                                setUnreadCount(c => Math.max(0, c - (n.isRead ? 0 : 1)));
                                navigate({ to: ROUTES.NOTIFICATIONS });
                                setNotifOpen(false);
                              }}>
                                <span style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: n.isRead ? 400 : 700 }}>
                                  {n.content}
                                </span>
                                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{n.fromUserName} · {new Date(n.createdAt).toLocaleDateString('ro-RO')}</span>
                              </div>
                          ))
                      )}
                      <div className="nav-dropdown-divider" />
                      <button className="nav-dropdown-item" onClick={() => { navigate({ to: ROUTES.NOTIFICATIONS }); setNotifOpen(false); }}>
                        Vezi toate notificările →
                      </button>
                    </div>
                )}
              </div>
          )}
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