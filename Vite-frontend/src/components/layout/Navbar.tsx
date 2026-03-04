import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { ROUTES } from '../../routes/paths';
import { scrollToSection } from '../../utils/navigation';
import { tokens } from '../../themes/theme';
import {
  UserCircleIcon, Squares2X2Icon, Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon, ShieldCheckIcon,
} from '@heroicons/react/24/solid';

/* ── sx style objects ─────────────────────────────────── */
const t = tokens;

const navLinkSx = {
  background: 'none', border: 'none', padding: 0,
  color: t.textSecondary, textDecoration: 'none', fontWeight: 600,
  fontSize: '0.9rem', transition: `all ${t.transitionBase}`, position: 'relative' as const,
  textTransform: 'uppercase' as const, letterSpacing: '0.5px', cursor: 'pointer',
  fontFamily: t.fontBody, display: 'inline-block',
  '&::after': {
    content: '""', position: 'absolute', bottom: -5, left: 0, width: 0, height: 2,
    background: t.gradientPrimary, transition: `width ${t.transitionBase}`,
  },
  '&:hover': { color: t.primary },
  '&:hover::after': { width: '100%' },
};

const navLinkActiveSx = {
  ...navLinkSx,
  color: t.primary,
  '&::after': { ...navLinkSx['&::after'], width: '100%' },
};

const dropdownItemSx = {
  display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%',
  p: '0.75rem 1rem', background: 'transparent', border: 'none',
  color: t.textSecondary, fontSize: '0.9rem', fontWeight: 600,
  fontFamily: t.fontBody, textAlign: 'left' as const, cursor: 'pointer',
  transition: 'background 0.15s ease, color 0.15s ease',
  textTransform: 'uppercase' as const, letterSpacing: '0.5px',
  '&:hover': { background: 'rgba(26,127,255,0.1)', color: t.primary },
};

const dropdownItemDangerSx = {
  ...dropdownItemSx, color: '#e05c5c',
  '&:hover': { background: 'rgba(224,92,92,0.1)', color: '#e05c5c' },
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { user: userCtx } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => { setDropdownOpen(false); logout(); navigate(ROUTES.HOME); };
  const closeMenu = () => setMenuOpen(false);

  const displayName = userCtx
      ? `${userCtx.firstName} ${userCtx.lastName}`
      : user ? `${user.firstName} ${user.lastName}` : 'Profil';

  const goFeatures = () => {
    closeMenu();
    if (window.location.pathname === '/') { scrollToSection('features'); }
    else { navigate(ROUTES.HOME); setTimeout(() => scrollToSection('features'), 300); }
  };

  return (
      <Box component="nav" sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: '5%', py: scrolled ? '0.55rem' : '0.7rem',
        background: scrolled ? 'rgba(10,22,40,0.98)' : 'rgba(10,22,40,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.darkBorder}`,
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        transition: `all ${t.transitionBase}`,
        boxShadow: scrolled ? t.shadowMd : 'none',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}>
        {/* Logo */}
        <Box component={Link} to={ROUTES.HOME} sx={{
          fontSize: '1.75rem', fontWeight: 900, fontFamily: t.fontDisplay,
          background: t.gradientPrimary, WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '-0.05em', textDecoration: 'none', cursor: 'pointer',
          textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap', pr: '1rem',
        }}>
          FitMoldova
        </Box>

        {/* Nav links */}
        <Box component="ul" sx={{
          display: { xs: menuOpen ? 'flex' : 'none', md: 'flex' },
          gap: { xs: 0, md: '2.5rem' }, listStyle: 'none', m: 0, p: 0,
          width: { xs: '100%', md: 'auto' },
          flexDirection: { xs: 'column', md: 'row' },
          borderTop: { xs: `1px solid ${t.darkBorder}`, md: 'none' },
          mt: { xs: menuOpen ? 0.5 : 0, md: 0 },
          pt: { xs: menuOpen ? 0.5 : 0, md: 0 },
          pb: { xs: menuOpen ? 1 : 0, md: 0 },
        }}>
          {[
            { label: 'Features', onClick: goFeatures },
            { label: 'Comunitate', onClick: () => { navigate(ROUTES.COMMUNITY); closeMenu(); } },
            { label: 'Evenimente', onClick: () => { navigate(ROUTES.EVENTS); closeMenu(); } },
          ].map(item => (
              <li key={item.label} style={{ listStyle: 'none' }}>
                <Box component="button" type="button" onClick={item.onClick} sx={{
                  ...navLinkSx,
                  display: { xs: 'block', md: 'inline-block' },
                  width: { xs: '100%', md: 'auto' },
                  textAlign: { xs: 'left', md: 'center' },
                  py: { xs: '0.75rem', md: 0 },
                }}>
                  {item.label}
                </Box>
              </li>
          ))}
          {[
            { label: 'Trasee', to: ROUTES.ROUTES_MAP },
            { label: 'Contact', to: ROUTES.CONTACT },
            ...(isAuthenticated ? [{ label: 'Feedback', to: ROUTES.FEEDBACK }] : []),
          ].map(item => (
              <li key={item.label} style={{ listStyle: 'none' }}>
                <NavLink to={item.to} onClick={closeMenu} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                      <Box component="span" sx={{
                        ...(isActive ? navLinkActiveSx : navLinkSx),
                        display: { xs: 'block', md: 'inline-block' },
                        width: { xs: '100%', md: 'auto' },
                        py: { xs: '0.75rem', md: 0 },
                      }}>
                        {item.label}
                      </Box>
                  )}
                </NavLink>
              </li>
          ))}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated ? (
              <Box ref={dropdownRef} sx={{ position: 'relative', zIndex: 10001 }}>
                <Box component="button" type="button"
                     onClick={() => setDropdownOpen(!dropdownOpen)}
                     title={displayName} aria-label="Meniu utilizator"
                     sx={{
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       width: 40, height: 40, background: 'transparent', border: 'none',
                       borderRadius: '50%', cursor: 'pointer', p: 0,
                       transition: 'transform 0.15s ease',
                       '&:hover': { transform: 'scale(1.08)' },
                       '&:active': { transform: 'scale(0.96)' },
                     }}>
                  <UserCircleIcon style={{ width: 40, height: 40, color: dropdownOpen ? '#3d95ff' : '#1a7fff', transition: 'color 0.15s ease' }} />
                </Box>

                {dropdownOpen && (
                    <Box sx={{
                      position: 'absolute', top: 'calc(100% + 12px)', right: 0, minWidth: 200,
                      background: 'rgba(10,22,40,0.98)', border: `1px solid ${t.darkBorder}`,
                      borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(20px)', zIndex: 10000, overflow: 'hidden',
                      animation: 'dropdownFadeIn 0.15s ease',
                      '@keyframes dropdownFadeIn': {
                        from: { opacity: 0, transform: 'translateY(-6px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}>
                      <Box sx={{ p: '0.85rem 1rem 0.75rem' }}>
                        <Box component="span" sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'block' }}>{displayName}</Box>
                      </Box>
                      <Box sx={{ height: 1, background: t.darkBorder }} />

                      {[
                        { icon: <Squares2X2Icon style={{ width: 18, height: 18, flexShrink: 0 }} />, label: 'Dashboard', route: ROUTES.DASHBOARD },
                        { icon: <Cog6ToothIcon style={{ width: 18, height: 18, flexShrink: 0 }} />, label: 'Setări', route: ROUTES.PROFILE },
                        ...(isAdmin ? [{ icon: <ShieldCheckIcon style={{ width: 18, height: 18, flexShrink: 0 }} />, label: 'Admin Panel', route: ROUTES.ADMIN }] : []),
                      ].map(item => (
                          <Box key={item.label} component="button" type="button" sx={dropdownItemSx}
                               onClick={() => { setDropdownOpen(false); navigate(item.route); }}>
                            {item.icon}{item.label}
                          </Box>
                      ))}

                      <Box sx={{ height: 1, background: t.darkBorder }} />
                      <Box component="button" type="button" sx={dropdownItemDangerSx} onClick={handleLogout}>
                        <ArrowRightEndOnRectangleIcon style={{ width: 18, height: 18, flexShrink: 0 }} />
                        Logout
                      </Box>
                    </Box>
                )}
              </Box>
          ) : (
              <>
                <Button component={Link} to={ROUTES.LOGIN} variant="outlined" color="primary" size="small">Login</Button>
                <Button component={Link} to={ROUTES.REGISTER} variant="contained" color="primary" size="small">Începe Acum</Button>
              </>
          )}

          {/* Hamburger */}
          <Box component="button" type="button"
               onClick={() => setMenuOpen(!menuOpen)}
               aria-label="Deschide meniu"
               sx={{
                 display: { xs: 'flex', md: 'none' }, flexDirection: 'column',
                 justifyContent: 'center', gap: '5px', width: 36, height: 36,
                 background: 'none', border: 'none', cursor: 'pointer', p: '4px',
                 '& span': {
                   display: 'block', width: '100%', height: 2, background: t.textSecondary,
                   borderRadius: 2, transition: `all ${t.transitionBase}`, transformOrigin: 'center',
                 },
                 ...(menuOpen ? {
                   '& span:nth-of-type(1)': { transform: 'translateY(7px) rotate(45deg)' },
                   '& span:nth-of-type(2)': { opacity: 0 },
                   '& span:nth-of-type(3)': { transform: 'translateY(-7px) rotate(-45deg)' },
                 } : {}),
               }}>
            <span /><span /><span />
          </Box>
        </Box>
      </Box>
  );
};

export default Navbar;
