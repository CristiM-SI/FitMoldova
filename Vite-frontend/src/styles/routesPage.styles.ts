/**
 * RoutesPage styles — converted from RoutesPage.css to MUI sx objects
 * All CSS custom properties replaced with tokens or direct values
 */
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens } from '../themes/theme';

export const routesPageSx: SxProps<Theme> = {
  minHeight: '100vh',
  pt: '72px',
  background: `radial-gradient(1200px at 20% 120px, rgba(26,127,255,0.12), transparent 45%),
               radial-gradient(900px at 80% 0px, rgba(0,216,132,0.12), transparent 50%),
               ${tokens.dark}`,
  color: tokens.textPrimary,
  position: 'relative',
};

export const routesHeroSx: SxProps<Theme> = {
  px: '1.5rem',
  pt: '72px',
  pb: '3rem',
  textAlign: 'center',
  background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 25%),
               linear-gradient(180deg, ${tokens.darkElevated} 0%, ${tokens.dark} 100%)`,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

export const routesHeroContentSx: SxProps<Theme> = {
  maxWidth: 700,
  mx: 'auto',
};

export const routesHeroTitleSx: SxProps<Theme> = {
  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
  fontWeight: 800,
  fontFamily: "'Rajdhani', sans-serif",
  m: '0 0 1rem',
  letterSpacing: '-0.02em',
};

export const routesHeroHighlightSx: SxProps<Theme> = {
  background: tokens.gradientPrimary,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const routesHeroSubtitleSx: SxProps<Theme> = {
  fontSize: '1.05rem',
  color: tokens.textSecondary,
  lineHeight: 1.7,
  m: '0 0 2rem',
};

export const routesHeroStatsSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  gap: '2.5rem',
  flexWrap: 'wrap',
  mt: 0.5,
};

export const routesStatSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
  p: '0.75rem 1.1rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  boxShadow: '0 10px 26px rgba(0,0,0,0.25)',
};

export const routesStatValueSx: SxProps<Theme> = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: tokens.primaryLight,
  fontFamily: "'Rajdhani', sans-serif",
  textShadow: '0 6px 24px rgba(0,0,0,0.35)',
};

export const routesStatLabelSx: SxProps<Theme> = {
  fontSize: '0.8rem',
  color: tokens.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

export const routesMainSx: SxProps<Theme> = {
  maxWidth: 1400,
  mx: 'auto',
  p: '2rem 1.5rem',
};

export const routesCtaSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  p: '1rem 1.25rem',
  mb: '1rem',
  background: 'linear-gradient(90deg, rgba(26,127,255,0.12) 0%, rgba(0,216,132,0.1) 100%)',
  border: '1px solid rgba(104,168,255,0.35)',
  borderRadius: '14px',
  boxShadow: '0 10px 32px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(4px)',
  '@media (max-width: 900px)': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
};

export const routesCtaTitleSx: SxProps<Theme> = {
  m: 0,
  fontWeight: 800,
  color: '#e8f0ff',
  fontSize: '1.05rem',
};

export const routesCtaSubSx: SxProps<Theme> = {
  m: '6px 0 0',
  color: tokens.textSecondary,
  fontSize: '0.9rem',
};

export const routesCtaSelectedSx: SxProps<Theme> = {
  m: '6px 0 0',
  color: '#cde4ff',
  fontSize: '0.92rem',
  fontWeight: 700,
};

export const routesCtaBtnSx: SxProps<Theme> = {
  py: '10px',
  px: '16px',
  borderRadius: '10px',
  border: 'none',
  background: tokens.gradientPrimary,
  color: '#0d111a',
  fontWeight: 800,
  cursor: 'pointer',
  minWidth: 190,
  transition: 'transform 0.12s ease, opacity 0.2s',
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
  '&:not(:disabled):hover': { transform: 'translateY(-1px) scale(1.01)' },
  '&:focus-visible': { outline: '2px solid rgba(104,168,255,0.9)', outlineOffset: '2px' },
  '@media (max-width: 900px)': { width: '100%' },
};

export const routesLayoutSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  gap: '1.5rem',
  minHeight: '70vh',
  '@media (max-width: 1200px)': { gridTemplateColumns: '320px 1fr' },
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
};

export const routesHomeBtnSx: SxProps<Theme> = {
  position: 'fixed',
  left: 22,
  bottom: 92,
  width: 46,
  height: 46,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  background: 'linear-gradient(135deg, #1a7fff, #00d884)',
  color: '#0d111a',
  fontSize: '1.25rem',
  fontWeight: 800,
  border: '2px solid rgba(255,255,255,0.08)',
  boxShadow: '0 14px 32px rgba(0,0,0,0.35)',
  transition: 'transform 0.14s ease, box-shadow 0.2s ease',
  zIndex: 320,
  cursor: 'pointer',
  '&:hover': { transform: 'translateY(-2px) scale(1.02)', boxShadow: '0 18px 36px rgba(0,0,0,0.42)' },
  '&:focus-visible': { outline: '3px solid rgba(104,168,255,0.9)', outlineOffset: '3px' },
  '@media (max-width: 640px)': { left: 16, bottom: 86, width: 44, height: 44 },
};

export const routesSidebarSx: SxProps<Theme> = {
  background: tokens.darkCard,
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'sticky',
  top: 110,
  maxHeight: 'calc(100vh - 140px)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
  '@media (max-width: 900px)': { position: 'static', maxHeight: 'none', boxShadow: 'none' },
};

export const routesMapContainerSx: SxProps<Theme> = {
  background: tokens.darkCard,
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  overflow: 'hidden',
  minHeight: 520,
  boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
};

export const routesToastSx = (visible: boolean): SxProps<Theme> => ({
  position: 'fixed',
  right: 24,
  bottom: 26,
  zIndex: 300,
  background: '#0d1526',
  border: '1px solid rgba(104,168,255,0.35)',
  color: '#e8f0ff',
  borderRadius: '12px',
  p: '12px 14px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
  transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(20px)',
  pointerEvents: visible ? 'auto' : 'none',
});

export const routeDetailsCardSx: SxProps<Theme> = {
  mt: '1.25rem',
  background: tokens.darkCard,
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  p: '1.15rem 1.25rem 1.2rem',
  boxShadow: '0 14px 38px rgba(0,0,0,0.28)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(900px at 85% 10%, rgba(26,127,255,0.08), transparent 45%)',
    pointerEvents: 'none',
  },
  '@media (max-width: 700px)': { p: '1rem' },
};
