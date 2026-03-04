/**
 * FitMoldova MUI Theme
 * Replaces: theme.css — all CSS variables are now MUI theme tokens
 */
import { createTheme, alpha } from '@mui/material/styles';

// ── Custom palette extensions ──────────────────────────────────────
declare module '@mui/material/styles' {
  interface Palette {
    dark: {
      main: string;
      card: string;
      elevated: string;
      border: string;
    };
    accent: { main: string; dark: string; light: string };
    running: string;
    cycling: string;
    gym: string;
  }
  interface PaletteOptions {
    dark?: {
      main: string;
      card: string;
      elevated: string;
      border: string;
    };
    accent?: { main: string; dark: string; light: string };
    running?: string;
    cycling?: string;
    gym?: string;
  }
}

// ── Design tokens (mirrors the old CSS variables) ──────────────────
export const tokens = {
  primary: '#0066FF',
  primaryDark: '#0052CC',
  primaryLight: '#3385FF',

  secondary: '#FF6B00',
  secondaryDark: '#E55F00',
  secondaryLight: '#FF8533',

  accent: '#00D084',
  accentDark: '#00B56F',
  accentLight: '#33DDA0',

  dark: '#0A1628',
  darkCard: '#0F1F35',
  darkElevated: '#152840',
  darkBorder: 'rgba(255, 255, 255, 0.1)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textDisabled: 'rgba(255, 255, 255, 0.4)',

  success: '#00D084',
  danger: '#FF3B3B',
  warning: '#FFB020',
  info: '#0066FF',

  running: '#0066FF',
  cycling: '#00D084',
  gym: '#FF6B00',

  gradientPrimary: 'linear-gradient(135deg, #0066FF 0%, #00B8FF 100%)',
  gradientSecondary: 'linear-gradient(135deg, #FF6B00 0%, #FFA533 100%)',
  gradientSuccess: 'linear-gradient(135deg, #00D084 0%, #00E896 100%)',
  gradientHero: 'linear-gradient(135deg, #0A1628 0%, #0F2847 50%, #0A1628 100%)',
  gradientCard: 'linear-gradient(135deg, rgba(15, 31, 53, 0.8) 0%, rgba(21, 40, 64, 0.8) 100%)',

  shadowSm: '0 2px 8px rgba(0, 0, 0, 0.1)',
  shadowMd: '0 4px 16px rgba(0, 0, 0, 0.15)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.2)',
  shadowXl: '0 16px 48px rgba(0, 0, 0, 0.25)',
  shadowPrimary: '0 8px 24px rgba(0, 102, 255, 0.3)',
  shadowSuccess: '0 8px 24px rgba(0, 208, 132, 0.3)',

  radiusSm: 6,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,

  fontDisplay: "'Rajdhani', 'Space Mono', monospace",
  fontBody: "'Inter', 'Archivo', sans-serif",

  transitionFast: '150ms ease-in-out',
  transitionBase: '250ms ease-in-out',
  transitionSlow: '350ms ease-in-out',
} as const;

// ── MUI theme ──────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.primary,
      dark: tokens.primaryDark,
      light: tokens.primaryLight,
    },
    secondary: {
      main: tokens.secondary,
      dark: tokens.secondaryDark,
      light: tokens.secondaryLight,
    },
    success: { main: tokens.success },
    error: { main: tokens.danger },
    warning: { main: tokens.warning },
    info: { main: tokens.info },
    background: {
      default: tokens.dark,
      paper: tokens.darkCard,
    },
    text: {
      primary: tokens.textPrimary,
      secondary: tokens.textSecondary,
      disabled: tokens.textDisabled,
    },
    divider: tokens.darkBorder,
    dark: {
      main: tokens.dark,
      card: tokens.darkCard,
      elevated: tokens.darkElevated,
      border: tokens.darkBorder,
    },
    accent: {
      main: tokens.accent,
      dark: tokens.accentDark,
      light: tokens.accentLight,
    },
    running: tokens.running,
    cycling: tokens.cycling,
    gym: tokens.gym,
  },

  typography: {
    fontFamily: tokens.fontBody,
    h1: { fontFamily: tokens.fontDisplay },
    h2: { fontFamily: tokens.fontDisplay },
    h3: { fontFamily: tokens.fontDisplay },
    h4: { fontFamily: tokens.fontDisplay },
    h5: { fontFamily: tokens.fontDisplay },
    h6: { fontFamily: tokens.fontDisplay },
  },

  shape: { borderRadius: tokens.radiusMd },

  shadows: [
    'none',
    tokens.shadowSm,
    tokens.shadowSm,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowMd,
    tokens.shadowLg,
    tokens.shadowLg,
    tokens.shadowLg,
    tokens.shadowLg,
    tokens.shadowLg,
    tokens.shadowLg,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
    tokens.shadowXl,
  ] as any,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        /* Re-inject CSS custom properties so that remaining .css files
           (Feedback.css, Contact.css, EvenimentePublic.css, etc.)
           continue to work — these were originally in theme.css */
        ':root': {
          '--primary': tokens.primary,
          '--primary-dark': tokens.primaryDark,
          '--primary-light': tokens.primaryLight,
          '--primary-gradient': tokens.gradientPrimary,
          '--secondary': tokens.secondary,
          '--secondary-dark': tokens.secondaryDark,
          '--secondary-light': tokens.secondaryLight,
          '--accent': tokens.accent,
          '--accent-dark': tokens.accentDark,
          '--accent-light': tokens.accentLight,
          '--dark': tokens.dark,
          '--dark-card': tokens.darkCard,
          '--dark-elevated': tokens.darkElevated,
          '--dark-border': tokens.darkBorder,
          '--text-primary': tokens.textPrimary,
          '--text-secondary': tokens.textSecondary,
          '--text-muted': tokens.textMuted,
          '--text-disabled': tokens.textDisabled,
          '--success': tokens.success,
          '--success-bg': 'rgba(0, 208, 132, 0.1)',
          '--danger': tokens.danger,
          '--danger-bg': 'rgba(255, 59, 59, 0.1)',
          '--warning': tokens.warning,
          '--warning-bg': 'rgba(255, 176, 32, 0.1)',
          '--info': tokens.info,
          '--info-bg': 'rgba(0, 102, 255, 0.1)',
          '--running': tokens.running,
          '--cycling': tokens.cycling,
          '--gym': tokens.gym,
          '--shadow-sm': tokens.shadowSm,
          '--shadow-md': tokens.shadowMd,
          '--shadow-lg': tokens.shadowLg,
          '--shadow-xl': tokens.shadowXl,
          '--shadow-primary': tokens.shadowPrimary,
          '--shadow-success': tokens.shadowSuccess,
          '--gradient-primary': tokens.gradientPrimary,
          '--gradient-secondary': tokens.gradientSecondary,
          '--gradient-success': tokens.gradientSuccess,
          '--gradient-hero': tokens.gradientHero,
          '--gradient-card': tokens.gradientCard,
          '--gradient': tokens.gradientPrimary,
          '--radius-sm': `${tokens.radiusSm}px`,
          '--radius-md': `${tokens.radiusMd}px`,
          '--radius-lg': `${tokens.radiusLg}px`,
          '--radius-xl': `${tokens.radiusXl}px`,
          '--radius-full': '9999px',
          '--spacing-xs': '0.25rem',
          '--spacing-sm': '0.5rem',
          '--spacing-md': '1rem',
          '--spacing-lg': '1.5rem',
          '--spacing-xl': '2rem',
          '--spacing-2xl': '3rem',
          '--spacing-3xl': '4rem',
          '--font-display': tokens.fontDisplay,
          '--font-body': tokens.fontBody,
          '--transition-fast': tokens.transitionFast,
          '--transition-base': tokens.transitionBase,
          '--transition-slow': tokens.transitionSlow,
          '--z-base': '1',
          '--z-dropdown': '1000',
          '--z-sticky': '1020',
          '--z-fixed': '1030',
          '--z-modal-backdrop': '1040',
          '--z-modal': '1050',
          '--z-popover': '1060',
          '--z-tooltip': '1070',
        },
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: {
          margin: 0,
          padding: 0,
          fontFamily: tokens.fontBody,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          background: tokens.dark,
          color: tokens.textPrimary,
          overflowX: 'hidden',
        },
        /* Keyframe animations (from components.css + theme.css) */
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        '@keyframes slideUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes spin': {
          to: { transform: 'rotate(360deg)' },
        },
        '@keyframes pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 102, 255, 0.6)' },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          padding: '0.875rem 1.75rem',
          borderRadius: tokens.radiusMd,
          fontWeight: 700,
          fontSize: '0.95rem',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.5px',
          fontFamily: tokens.fontBody,
          position: 'relative' as const,
          overflow: 'hidden',
          transition: `all ${tokens.transitionBase}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.6s, height 0.6s',
          },
          '&:hover::before': {
            width: 300,
            height: 300,
          },
          '@media (max-width: 768px)': {
            padding: '0.75rem 1.25rem',
            fontSize: '0.875rem',
          },
        },
        containedPrimary: {
          background: tokens.gradientPrimary,
          color: '#fff',
          boxShadow: tokens.shadowPrimary,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 32px ${alpha('#0066FF', 0.4)}`,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlinedPrimary: {
          background: 'transparent',
          color: tokens.primary,
          border: `2px solid ${tokens.primary}`,
          '&:hover': {
            background: tokens.primary,
            color: '#fff',
            transform: 'translateY(-2px)',
            border: `2px solid ${tokens.primary}`,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: tokens.radiusLg,
          transition: `all ${tokens.transitionBase}`,
        },
      },
    },
  },
});

export default theme;
