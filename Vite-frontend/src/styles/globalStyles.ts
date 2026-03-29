// ═══════════════════════════════════════════════════════════
// FitMoldova Global Styles — TypeScript replacement for all .css files
// Injected once in main.tsx via <style>{globalStyles}</style>
// ═══════════════════════════════════════════════════════════

export const globalStyles = `

/* ═══ theme.css ═══ */
/**
 * FitMoldova Sports Theme
 * Professional sports color palette that inspires energy, trust and performance
 */

:root {
  /* Primary Colors - Electric Blue (Energy, Technology, Trust) */
  --primary: #0066FF;
  --primary-dark: #0052CC;
  --primary-light: #3385FF;
  --primary-gradient: linear-gradient(135deg, #0066FF 0%, #00B8FF 100%);

  /* Secondary Colors - Vibrant Orange (Energy, Action, Motivation) */
  --secondary: #FF6B00;
  --secondary-dark: #E55F00;
  --secondary-light: #FF8533;

  /* Accent Colors - Success Green (Achievement, Growth) */
  --accent: #00D084;
  --accent-dark: #00B56F;
  --accent-light: #33DDA0;

  /* Neutral Colors - Dark Theme (Professional, Focus) */
  --dark: #0A1628;
  --dark-card: #0F1F35;
  --dark-elevated: #152840;
  --dark-border: rgba(255, 255, 255, 0.1);

  /* Text Colors */
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-muted: rgba(255, 255, 255, 0.6);
  --text-disabled: rgba(255, 255, 255, 0.4);

  /* Semantic Colors */
  --success: #00D084;
  --success-bg: rgba(0, 208, 132, 0.1);
  --danger: #FF3B3B;
  --danger-bg: rgba(255, 59, 59, 0.1);
  --warning: #FFB020;
  --warning-bg: rgba(255, 176, 32, 0.1);
  --info: #0066FF;
  --info-bg: rgba(0, 102, 255, 0.1);

  /* Activity Type Colors */
  --running: #0066FF;
  --cycling: #00D084;
  --gym: #FF6B00;

  /* Shadows & Effects */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.25);
  --shadow-primary: 0 8px 24px rgba(0, 102, 255, 0.3);
  --shadow-success: 0 8px 24px rgba(0, 208, 132, 0.3);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #0066FF 0%, #00B8FF 100%);
  --gradient-secondary: linear-gradient(135deg, #FF6B00 0%, #FFA533 100%);
  --gradient-success: linear-gradient(135deg, #00D084 0%, #00E896 100%);
  --gradient-hero: linear-gradient(135deg, #0A1628 0%, #0F2847 50%, #0A1628 100%);
  --gradient-card: linear-gradient(135deg, rgba(15, 31, 53, 0.8) 0%, rgba(21, 40, 64, 0.8) 100%);
  /* Alias for components that use --gradient directly */
  --gradient: linear-gradient(135deg, #0066FF 0%, #00B8FF 100%);

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Typography */
  --font-display: 'Rajdhani', 'Space Mono', monospace;
  --font-body: 'Inter', 'Archivo', sans-serif;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;

  /* Z-index Scale */
  --z-base: 1;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* Loading Spinner Styles */
.route-guard-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--dark);
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid var(--dark-elevated);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner p {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

/* Pulse Animation for CTAs */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 102, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 102, 255, 0.6);
  }
}

/* ═══ components.css ═══ */
/**
 * Reusable UI Components Styles
 */

/* Card Component */
.card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══ index.css ═══ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--dark);
  color: var(--text-primary);
  overflow-x: hidden;
}

/* Buttons */
.btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 102, 255, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
}

/* ═══ Navbar.css ═══ */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background: rgba(10, 22, 40, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--dark-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: all var(--transition-base);
}

.navbar.scrolled {
  background: rgba(10, 22, 40, 0.98);
  padding: 1rem 5%;
  box-shadow: var(--shadow-md);
}

.logo {
  font-size: 1.75rem;
  font-weight: 900;
  font-family: var(--font-display);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.05em;
  text-decoration: none;
  cursor: pointer;
  text-transform: uppercase;
  flex-shrink: 0;
  white-space: nowrap;
  padding-right: 1rem;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
}

.nav-link-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition-base);
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  font-family: var(--font-body);
}

.nav-link-btn:hover {
  color: var(--primary);
}

.nav-link-btn::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width var(--transition-base);
}

.nav-link-btn:hover::after {
  width: 100%;
}

/* Active state for NavLink */
.nav-link-btn--active {
  color: var(--primary);
}

.nav-link-btn--active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* ── Hamburger button ───────────────────────────────────── */
.nav-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav-hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: all var(--transition-base);
  transform-origin: center;
}

.nav-hamburger--open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.nav-hamburger--open span:nth-child(2) {
  opacity: 0;
}
.nav-hamburger--open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── User dropdown menu ─────────────────────────────────── */
.nav-user-menu {
  position: relative;
}

.nav-avatar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.nav-avatar-btn:hover {
  transform: scale(1.08);
  opacity: 0.85;
}

.nav-avatar-btn:active {
  transform: scale(0.96);
}

.nav-avatar-btn--active .nav-avatar-icon {
  color: #3d95ff;
}

.nav-avatar-icon {
  width: 40px;
  height: 40px;
  color: #1a7fff;
  transition: color 0.15s ease;
}

.nav-avatar-btn:hover .nav-avatar-icon {
  color: #3d95ff;
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 200px;
  background: rgba(10, 22, 40, 0.98);
  border: 1px solid var(--dark-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.15s ease;
}

@keyframes dropdownFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.nav-dropdown-header {
  padding: 0.85rem 1rem 0.75rem;
}

.nav-dropdown-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
  display: block;
}

.nav-dropdown-divider {
  height: 1px;
  background: var(--dark-border);
  margin: 0;
}

.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-dropdown-item:hover {
  background: rgba(26, 127, 255, 0.1);
  color: var(--primary, #1a7fff);
}

.nav-dropdown-item--danger {
  color: #e05c5c;
}

.nav-dropdown-item--danger:hover {
  background: rgba(224, 92, 92, 0.1);
  color: #e05c5c;
}

.nav-dropdown-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ── Mobile ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .navbar {
    padding: 1.25rem 5%;
    flex-wrap: wrap;
  }

  .nav-hamburger {
    display: flex;
  }

  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 0;
    padding: 0.5rem 0 1rem;
    border-top: 1px solid var(--dark-border);
    margin-top: 0.5rem;
  }

  .nav-links--open {
    display: flex;
  }

  .nav-links li {
    width: 100%;
  }

  .nav-link-btn {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.75rem 0;
  }

  .nav-actions {
    gap: 0.75rem;
  }

  .nav-actions .btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}

/* ═══ Footer.css ═══ */
.footer {
  padding: 4rem 5%;
  background: rgba(10, 14, 39, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: var(--text-primary, #f8f9fa);
}

.footer-section p {
  color: rgba(248, 249, 250, 0.6);
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.8rem;
}

.footer-section ul li a {
  color: rgba(248, 249, 250, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--primary, #1a7fff);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(248, 249, 250, 0.5);
}

.footer-link {
  background: none;
  border: none;
  padding: 0;
  color: rgba(248, 249, 250, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: inherit;
  text-align: left;
  display: inline;
}

.footer-link:hover {
  color: var(--primary, #1a7fff);
}

/* ═══ Home.css ═══ */
/* Home.css */
.home-page {
  position: relative;
  min-height: 100vh;
}

.noise-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px);
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
}

.gradient-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: var(--primary);
  top: -300px;
  right: -200px;
  animation: float 20s ease-in-out infinite;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: var(--accent);
  bottom: -200px;
  left: -150px;
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 80px) scale(1.1); }
}

.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5%;
  position: relative;
  z-index: 2;
}

.hero-content {
  max-width: 1000px;
  width: 100%;
  text-align: center;
  animation: slideUp 1s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.hero h1 .highlight {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  color: rgba(248, 249, 250, 0.8);
  line-height: 1.6;
  font-weight: 300;
}

.hero-cta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(0.75rem, 2vw, 2rem);
  margin-top: 4rem;
}

.stat-item {
  text-align: center;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-width: 0;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
}

.stat-number {
  font-size: clamp(1.5rem, 3.5vw, 3rem);
  font-weight: 900;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Space Mono', monospace;
  white-space: nowrap;
}

.stat-label {
  font-size: clamp(0.65rem, 1.2vw, 0.9rem);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(248, 249, 250, 0.6);
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.features {
  padding: 8rem 5%;
  background: linear-gradient(180deg, var(--dark) 0%, #0f1328 100%);
  position: relative;
  z-index: 2;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(248, 249, 250, 0.6);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 300;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 2.5rem;
}

.feature-card {
  padding: 3rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--primary);
  box-shadow: 0 20px 60px rgba(0, 102, 255, 0.2);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: var(--gradient);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.feature-description {
  color: rgba(248, 249, 250, 0.7);
  line-height: 1.7;
  font-weight: 300;
}

.cta-section {
  padding: 8rem 5%;
  text-align: center;
  background: var(--dark);
  position: relative;
  z-index: 2;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.cta-description {
  font-size: 1.3rem;
  color: rgba(248, 249, 250, 0.7);
  margin-bottom: 3rem;
  font-weight: 300;
}

.cta-btn {
  font-size: 1.1rem;
  padding: 1.2rem 3rem;
}

.footer {
  padding: 4rem 5%;
  background: rgba(10, 14, 39, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.footer-section p {
  color: rgba(248, 249, 250, 0.6);
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.8rem;
}

.footer-section ul li a {
  color: rgba(248, 249, 250, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--primary);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(248, 249, 250, 0.5);
}

@media (max-width: 768px) {
  .hero {
    min-height: 70vh;
  }

  .hero-cta {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* ── HOME FEEDBACK SECTION ──────────────────────────────────── */
.home-feedback-section {
  padding: 6rem 5%;
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, rgba(0, 208, 132, 0.05) 0%, rgba(0, 184, 255, 0.03) 100%);
  border-top: 1px solid rgba(0, 208, 132, 0.1);
  border-bottom: 1px solid rgba(0, 208, 132, 0.1);
}

.home-feedback-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.home-feedback-badge {
  display: inline-block;
  background: rgba(0, 208, 132, 0.12);
  border: 1px solid rgba(0, 208, 132, 0.35);
  color: #00D084;
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.home-feedback-left h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  line-height: 1.15;
}

.home-feedback-left p {
  font-size: 1rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.7;
  margin-bottom: 1.75rem;
}

.home-feedback-ratings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.home-feedback-rating-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 250ms ease-in-out;
}

.home-feedback-rating-card:hover {
  border-color: rgba(0, 208, 132, 0.3);
  background: rgba(0, 208, 132, 0.04);
  transform: translateX(4px);
}

.home-feedback-score {
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FFB800 0%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 64px;
}

.home-feedback-stars {
  font-size: 1rem;
  color: #FFB800;
  letter-spacing: 0.05em;
}

.home-feedback-rating-label {
  font-size: 0.9rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  font-weight: 500;
}

@media (max-width: 768px) {
  .home-feedback-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

/* Footer link buttons - no href */
.footer-link {
  background: none;
  border: none;
  padding: 0;
  color: rgba(248, 249, 250, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: inherit;
  text-align: left;
}

.footer-link:hover {
  color: var(--primary);
}

/* ═══ NotFound.css ═══ */
/* NotFound.css */
.notfound-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.notfound-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 5% 4rem;
  position: relative;
  z-index: 2;
}

.notfound-inner {
  max-width: 600px;
  animation: notfoundFadeIn 0.8s ease-out;
}

@keyframes notfoundFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notfound-code {
  font-size: clamp(8rem, 20vw, 14rem);
  font-weight: 900;
  line-height: 1;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-family: 'Space Mono', monospace;
}

.notfound-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.notfound-description {
  font-size: 1.1rem;
  color: rgba(248, 249, 250, 0.6);
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.notfound-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.notfound-btn {
  padding: 0.875rem 2rem;
  border-radius: var(--radius-md, 12px);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.notfound-btn-primary {
  background: var(--gradient);
  color: #fff;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 102, 255, 0.3);
}

.notfound-btn-primary:hover {
  box-shadow: 0 12px 32px rgba(0, 102, 255, 0.5);
  transform: translateY(-2px);
}

.notfound-btn-outline {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.notfound-btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.notfound-path {
  margin-top: 3rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  display: inline-block;
}

.notfound-path code {
  color: rgba(248, 249, 250, 0.4);
  font-size: 0.9rem;
  font-family: 'Space Mono', monospace;
}

@media (max-width: 768px) {
  .notfound-actions {
    flex-direction: column;
    align-items: center;
  }
}

/* ═══ Contact.css ═══ */
/* ── Contact.css ──────────────────────────────────────────── */

.contact-page {
  position: relative;
  min-height: 100vh;
}

/* ── HERO ──────────────────────────────────────────────────── */
.contact-hero {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 5% 4rem;
  position: relative;
  z-index: 2;
}

.contact-hero-content {
  max-width: 700px;
  animation: contactSlideUp 0.9s ease-out;
}

@keyframes contactSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-hero-badge {
  display: inline-block;
  background: rgba(0, 102, 255, 0.15);
  border: 1px solid rgba(0, 102, 255, 0.4);
  color: var(--primary-light, #3385FF);
  padding: 6px 18px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.contact-hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.contact-hero .highlight {
  background: var(--gradient-primary, linear-gradient(135deg, #0066FF 0%, #00B8FF 100%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-hero p {
  font-size: 1.15rem;
  color: var(--text-muted, rgba(255,255,255,0.6));
  font-weight: 300;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
}

/* ── INFO CARDS ────────────────────────────────────────────── */
.contact-info-section {
  padding: 0 5% 5rem;
  position: relative;
  z-index: 2;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

.contact-info-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255,255,255,0.1));
  border-radius: var(--radius-lg, 16px);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all var(--transition-base, 250ms ease-in-out);
}

.contact-info-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 102, 255, 0.35);
  background: rgba(0, 102, 255, 0.06);
  box-shadow: 0 16px 40px rgba(0, 102, 255, 0.12);
}

.contact-info-icon {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.contact-info-title {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary, rgba(255,255,255,0.8));
  margin-bottom: 0.5rem;
}

.contact-info-details {
  font-size: 1rem;
  color: var(--text-primary, #fff);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.contact-info-sub {
  font-size: 0.85rem;
  color: var(--text-muted, rgba(255,255,255,0.55));
}

/* ── MAIN SECTION (form + sidebar) ─────────────────────────── */
.contact-main-section {
  padding: 0 5% 6rem;
  position: relative;
  z-index: 2;
}

.contact-main-inner {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

/* ── FORM WRAPPER ───────────────────────────────────────────── */
.contact-form-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255,255,255,0.1));
  border-radius: var(--radius-xl, 24px);
  padding: 2.5rem;
}

.contact-form-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.contact-form-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted, rgba(255,255,255,0.6));
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Success / Error notifications */
.contact-success-msg,
.contact-error-msg {
  border-radius: var(--radius-md, 12px);
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.contact-success-msg {
  background: rgba(0, 208, 132, 0.12);
  border: 1px solid rgba(0, 208, 132, 0.4);
  color: #00D084;
}

.contact-error-msg {
  background: rgba(255, 59, 59, 0.1);
  border: 1px solid rgba(255, 59, 59, 0.4);
  color: #ff5c5c;
}

/* Form layout */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.contact-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.contact-field label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary, rgba(255,255,255,0.8));
  letter-spacing: 0.03em;
}

.contact-field input,
.contact-field textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--dark-border, rgba(255,255,255,0.12));
  border-radius: var(--radius-md, 12px);
  color: var(--text-primary, #fff);
  font-family: inherit;
  font-size: 0.97rem;
  padding: 0.85rem 1rem;
  transition: border-color var(--transition-base, 250ms ease-in-out),
              background var(--transition-base, 250ms ease-in-out);
  outline: none;
  width: 100%;
}

.contact-field input::placeholder,
.contact-field textarea::placeholder {
  color: var(--text-disabled, rgba(255,255,255,0.35));
}

/* ── CUSTOM SELECT ──────────────────────────────────────────── */
.custom-select {
  position: relative;
  width: 100%;
}

.custom-select__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--dark-border, rgba(255,255,255,0.12));
  border-radius: var(--radius-md, 12px);
  color: var(--text-primary, #fff);
  font-family: inherit;
  font-size: 0.97rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: border-color var(--transition-base, 250ms ease-in-out),
              background var(--transition-base, 250ms ease-in-out);
}

.custom-select--open .custom-select__trigger,
.custom-select__trigger:focus {
  border-color: var(--primary, #0066FF);
  background: rgba(0, 102, 255, 0.07);
  outline: none;
}

.custom-select.input-error .custom-select__trigger {
  border-color: #ff5c5c;
  background: rgba(255, 59, 59, 0.05);
}

.custom-select__placeholder {
  color: var(--text-disabled, rgba(255,255,255,0.35));
}

.custom-select__chevron {
  flex-shrink: 0;
  transition: transform 250ms ease-in-out;
}

.custom-select--open .custom-select__chevron {
  transform: rotate(180deg);
}

.custom-select__list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #0F1F35;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  z-index: 100;
  list-style: none;
  padding: 0.4rem;
  margin: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.custom-select__option {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.97rem;
  color: var(--text-primary, #fff);
  cursor: pointer;
  transition: background 150ms ease-in-out;
}

.custom-select__option:hover {
  background: rgba(0, 102, 255, 0.12);
}

.custom-select__option--selected {
  background: rgba(0, 102, 255, 0.18);
  color: #3385FF;
  font-weight: 600;
}

.contact-field input:focus,
.contact-field textarea:focus {
  border-color: var(--primary, #0066FF);
  background: rgba(0, 102, 255, 0.07);
}

.contact-field input.input-error,
.contact-field textarea.input-error {
  border-color: #ff5c5c;
  background: rgba(255, 59, 59, 0.05);
}

.field-error {
  font-size: 0.82rem;
  color: #ff5c5c;
  font-weight: 500;
}

.contact-field textarea {
  resize: vertical;
  min-height: 140px;
}

.contact-submit-btn {
  align-self: flex-start;
  min-width: 220px;
  margin-top: 0.5rem;
}

/* ── SIDEBAR ────────────────────────────────────────────────── */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Google Maps embed */
.contact-map-embed {
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  border: 1px solid var(--dark-border, rgba(255,255,255,0.1));
}

.contact-map-embed iframe {
  display: block;
  width: 100%;
  height: 280px;
  border: none;
}

.contact-map-label {
  background: rgba(255, 255, 255, 0.04);
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: var(--text-muted, rgba(255,255,255,0.6));
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Social links */
.contact-social {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255,255,255,0.1));
  border-radius: var(--radius-lg, 16px);
  padding: 1.75rem;
}

.contact-social h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-secondary, rgba(255,255,255,0.8));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--dark-border, rgba(255,255,255,0.08));
  border-radius: var(--radius-md, 12px);
  color: var(--text-primary, #fff);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all var(--transition-base, 250ms ease-in-out);
}

.social-link:hover {
  border-color: rgba(0, 102, 255, 0.4);
  background: rgba(0, 102, 255, 0.08);
  transform: translateX(4px);
}

.social-icon {
  font-size: 1.2rem;
}


/* ── FAQ ────────────────────────────────────────────────────── */
.contact-faq-section {
  padding: 6rem 5%;
  background: linear-gradient(180deg, var(--dark, #0A1628) 0%, #0c1830 100%);
  position: relative;
  z-index: 2;
}

.contact-faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-faq-grid .faq-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.contact-faq-grid .faq-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.contact-faq-grid .faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.contact-faq-grid .faq-icon {
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--primary, #0066FF);
  flex-shrink: 0;
  margin-left: 1rem;
  transition: transform 0.3s ease;
}

.contact-faq-grid .faq-item.open .faq-icon {
  transform: rotate(0deg);
}

.contact-faq-grid .faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}

.contact-faq-grid .faq-item.open .faq-answer {
  max-height: 300px;
}

.contact-faq-grid .faq-answer p {
  padding: 0 1.5rem 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  font-weight: 300;
  margin: 0;
}

/* ── FEEDBACK PROMO ─────────────────────────────────────────── */
.contact-feedback-promo {
  padding: 3rem 5% 5rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 102, 255, 0.05) 100%);
}

.contact-feedback-promo-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(135deg, rgba(0, 208, 132, 0.08) 0%, rgba(0, 184, 255, 0.05) 100%);
  border: 1px solid rgba(0, 208, 132, 0.25);
  border-radius: var(--radius-xl, 24px);
  padding: 2rem 2.5rem;
}

.contact-feedback-promo-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 12px rgba(255, 184, 0, 0.4));
}

.contact-feedback-promo-text {
  flex: 1;
  min-width: 0;
}

.contact-feedback-promo-text h3 {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  color: var(--text-primary, #fff);
}

.contact-feedback-promo-text p {
  font-size: 0.9rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.5;
  margin: 0;
}

.contact-feedback-promo-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, #00D084 0%, #00B8FF 100%) !important;
  box-shadow: 0 8px 24px rgba(0, 208, 132, 0.3) !important;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .contact-feedback-promo-inner {
    flex-direction: column;
    text-align: center;
    padding: 1.75rem;
  }

  .contact-feedback-promo-btn {
    width: 100%;
  }
}

/* ── CTA STRIP ──────────────────────────────────────────────── */
.contact-cta-section {
  padding: 5rem 5%;
  text-align: center;
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, rgba(0,102,255,0.05) 0%, rgba(0,102,255,0.10) 40%, rgba(0,184,255,0.06) 100%);
  border-bottom: 1px solid rgba(0,102,255,0.15);
}

.contact-cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.contact-cta-content h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.contact-cta-content p {
  font-size: 1.05rem;
  color: var(--text-muted, rgba(255,255,255,0.6));
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* ── RESPONSIVE ─────────────────────────────────────────────── */
@media (max-width: 960px) {
  .contact-main-inner {
    grid-template-columns: 1fr;
  }

  .contact-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .contact-map-embed {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .contact-form-row {
    grid-template-columns: 1fr;
  }

  .contact-sidebar {
    grid-template-columns: 1fr;
  }

  .contact-info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .contact-submit-btn {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .contact-info-grid {
    grid-template-columns: 1fr;
  }
}

/* ═══ Feedback.css ═══ */
/* ── Feedback.css ──────────────────────────────────────────── */

.feedback-page {
  position: relative;
  min-height: 100vh;
}

/* ── HERO ──────────────────────────────────────────────────── */
.feedback-hero {
  min-height: 48vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 5% 4rem;
  position: relative;
  z-index: 2;
}

.feedback-hero-content {
  max-width: 700px;
  animation: feedbackSlideUp 0.9s ease-out;
}

@keyframes feedbackSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-hero-badge {
  display: inline-block;
  background: rgba(0, 208, 132, 0.12);
  border: 1px solid rgba(0, 208, 132, 0.4);
  color: #00D084;
  padding: 6px 18px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.feedback-hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.feedback-hero .highlight {
  background: linear-gradient(135deg, #00D084 0%, #00B8FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feedback-hero p {
  font-size: 1.15rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  font-weight: 300;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
}

/* ── STATS BAR ─────────────────────────────────────────────── */
.feedback-stats-bar {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 3rem);
  padding: 0 5% 4rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

.feedback-stat {
  text-align: center;
}

.feedback-stat-number {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00D084 0%, #00B8FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.35rem;
}

.feedback-stat-label {
  font-size: 0.85rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.55));
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── MAIN SECTION (form + sidebar) ─────────────────────────── */
.feedback-main-section {
  padding: 0 5% 6rem;
  position: relative;
  z-index: 2;
}

.feedback-main-inner {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

/* ── FORM WRAPPER ───────────────────────────────────────────── */
.feedback-form-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-xl, 24px);
  padding: 2.5rem;
}

.feedback-form-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.feedback-form-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Success notification */
.feedback-success-msg {
  background: rgba(0, 208, 132, 0.12);
  border: 1px solid rgba(0, 208, 132, 0.4);
  color: #00D084;
  border-radius: var(--radius-md, 12px);
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.feedback-error-msg {
  background: rgba(255, 59, 59, 0.1);
  border: 1px solid rgba(255, 59, 59, 0.4);
  color: #ff5c5c;
  border-radius: var(--radius-md, 12px);
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

/* ── STAR RATING ────────────────────────────────────────────── */
.feedback-rating-section {
  margin-bottom: 1.75rem;
}

.feedback-rating-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary, rgba(255, 255, 255, 0.8));
  letter-spacing: 0.03em;
  margin-bottom: 0.75rem;
  display: block;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  line-height: 1;
  padding: 0;
  transition: transform var(--transition-base, 250ms ease-in-out),
              filter var(--transition-base, 250ms ease-in-out);
  color: rgba(255, 255, 255, 0.2);
}

.star-btn.active {
  color: #FFB800;
  filter: drop-shadow(0 0 8px rgba(255, 184, 0, 0.5));
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-rating-text {
  font-size: 0.88rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.5));
  margin-top: 0.5rem;
  font-style: italic;
  min-height: 1.2em;
}

/* ── CATEGORY CHIPS ─────────────────────────────────────────── */
.feedback-category-section {
  margin-bottom: 1.75rem;
}

.feedback-category-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary, rgba(255, 255, 255, 0.8));
  letter-spacing: 0.03em;
  margin-bottom: 0.75rem;
  display: block;
}

.feedback-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--dark-border, rgba(255, 255, 255, 0.12));
  border-radius: var(--radius-full, 9999px);
  color: var(--text-muted, rgba(255, 255, 255, 0.65));
  cursor: pointer;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  transition: all var(--transition-base, 250ms ease-in-out);
}

.chip:hover {
  border-color: rgba(0, 208, 132, 0.4);
  color: #00D084;
  background: rgba(0, 208, 132, 0.07);
}

.chip.chip--selected {
  background: rgba(0, 208, 132, 0.15);
  border-color: rgba(0, 208, 132, 0.5);
  color: #00D084;
}

/* ── FORM ───────────────────────────────────────────────────── */
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.feedback-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.feedback-field label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary, rgba(255, 255, 255, 0.8));
  letter-spacing: 0.03em;
}

.feedback-field input,
.feedback-field textarea,
.feedback-field select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--dark-border, rgba(255, 255, 255, 0.12));
  border-radius: var(--radius-md, 12px);
  color: var(--text-primary, #fff);
  font-family: inherit;
  font-size: 0.97rem;
  padding: 0.85rem 1rem;
  transition: border-color var(--transition-base, 250ms ease-in-out),
              background var(--transition-base, 250ms ease-in-out);
  outline: none;
  width: 100%;
}

.feedback-field input::placeholder,
.feedback-field textarea::placeholder {
  color: var(--text-disabled, rgba(255, 255, 255, 0.35));
}

.feedback-field select option {
  background: var(--dark-card, #0F1F35);
  color: var(--text-primary, #fff);
}

.feedback-field input:focus,
.feedback-field textarea:focus,
.feedback-field select:focus {
  border-color: #00D084;
  background: rgba(0, 208, 132, 0.06);
}

.feedback-field input.input-error,
.feedback-field textarea.input-error {
  border-color: #ff5c5c;
  background: rgba(255, 59, 59, 0.05);
}

.field-error {
  font-size: 0.82rem;
  color: #ff5c5c;
  font-weight: 500;
}

.feedback-field textarea {
  resize: vertical;
  min-height: 140px;
}

.feedback-submit-btn {
  align-self: flex-start;
  min-width: 220px;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #00D084 0%, #00B8FF 100%) !important;
  box-shadow: 0 8px 24px rgba(0, 208, 132, 0.3) !important;
}

.feedback-submit-btn:hover {
  box-shadow: 0 12px 32px rgba(0, 208, 132, 0.45) !important;
}

/* ── SIDEBAR ────────────────────────────────────────────────── */
.feedback-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Overall rating card */
.feedback-overall-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-lg, 16px);
  padding: 2rem;
  text-align: center;
}

.feedback-overall-card h3 {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted, rgba(255, 255, 255, 0.55));
  margin-bottom: 1rem;
}

.feedback-big-rating {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #FFB800 0%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.feedback-big-stars {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.feedback-review-count {
  font-size: 0.85rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.5));
}

/* Rating breakdown */
.feedback-breakdown {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.breakdown-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.breakdown-label {
  color: var(--text-muted, rgba(255, 255, 255, 0.55));
  white-space: nowrap;
}

.breakdown-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #FFB800, #FF8C00);
  transition: width 0.6s ease;
}

.breakdown-pct {
  color: var(--text-muted, rgba(255, 255, 255, 0.55));
  min-width: 32px;
  text-align: right;
}

/* Tip card */
.feedback-tip-card {
  background: rgba(0, 208, 132, 0.06);
  border: 1px solid rgba(0, 208, 132, 0.2);
  border-radius: var(--radius-lg, 16px);
  padding: 1.5rem;
}

.feedback-tip-card h3 {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #00D084;
  margin-bottom: 0.75rem;
}

.feedback-tip-card p {
  font-size: 0.9rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.6;
}

/* ── RECENT REVIEWS ─────────────────────────────────────────── */
.feedback-reviews-section {
  padding: 6rem 5%;
  background: linear-gradient(180deg, var(--dark, #0A1628) 0%, #0c1830 100%);
  position: relative;
  z-index: 2;
}

.feedback-reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 1.5rem;
  max-width: 1100px;
  margin: 2.5rem auto 0;
}

.review-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--dark-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-lg, 16px);
  padding: 1.75rem;
  transition: all var(--transition-base, 250ms ease-in-out);
}

.review-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 208, 132, 0.25);
  box-shadow: 0 12px 32px rgba(0, 208, 132, 0.08);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.review-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00D084 0%, #00B8FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.review-meta {
  flex: 1;
  min-width: 0;
}

.review-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary, #fff);
  margin-bottom: 0.15rem;
}

.review-date {
  font-size: 0.8rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.45));
}

.review-stars {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  color: #FFB800;
}

.review-category-chip {
  display: inline-block;
  background: rgba(0, 102, 255, 0.12);
  border: 1px solid rgba(0, 102, 255, 0.25);
  color: #3385FF;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.review-text {
  font-size: 0.92rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.65));
  line-height: 1.65;
  margin: 0;
}

/* ── CTA STRIP ──────────────────────────────────────────────── */
.feedback-cta-section {
  padding: 5rem 5%;
  text-align: center;
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, rgba(0, 208, 132, 0.06) 0%, rgba(0, 184, 255, 0.04) 100%);
  border-top: 1px solid rgba(0, 208, 132, 0.12);
  border-bottom: 1px solid rgba(0, 208, 132, 0.12);
}

.feedback-cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.feedback-cta-content h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.feedback-cta-content p {
  font-size: 1.05rem;
  color: var(--text-muted, rgba(255, 255, 255, 0.6));
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* ── RESPONSIVE ─────────────────────────────────────────────── */
@media (max-width: 960px) {
  .feedback-main-inner {
    grid-template-columns: 1fr;
  }

  .feedback-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .feedback-sidebar {
    grid-template-columns: 1fr;
  }

  .feedback-submit-btn {
    width: 100%;
  }

  .feedback-stats-bar {
    gap: 2rem;
  }

  .star-btn {
    font-size: 1.6rem;
  }
}

/* ═══ EvenimentePublic.css ═══ */
/* ═══════════════════════════════════════════════════════
   EvenimentePublic.css – Pagina publică de evenimente
   ═══════════════════════════════════════════════════════ */

/* ── Page wrapper ──────────────────────────────────────── */
.ep-page {
    position: relative;
    min-height: 100vh;
    background: var(--dark, #080e21);
    color: var(--text-primary, #f8f9fa);
}

/* Noise overlay */
.ep-noise {
    position: fixed;
    inset: 0;
    background:
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
    pointer-events: none;
    z-index: 0;
}

/* Gradient orbs */
.ep-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(130px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
}
.ep-orb-1 {
    width: 550px; height: 550px;
    background: var(--primary, #1a7fff);
    top: -200px; right: -150px;
    animation: epFloat 22s ease-in-out infinite;
}
.ep-orb-2 {
    width: 450px; height: 450px;
    background: var(--accent, #00d084);
    bottom: -150px; left: -150px;
    animation: epFloat 28s ease-in-out infinite reverse;
}
@keyframes epFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(40px, 60px) scale(1.08); }
}

/* ── HERO HEADER ───────────────────────────────────────── */
.ep-hero {
    position: relative;
    z-index: 2;
    padding: 4rem 5% 5rem;
    text-align: center;
    background: linear-gradient(180deg, rgba(26,127,255,0.08) 0%, transparent 100%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
}

.ep-hero-inner {
    max-width: 760px;
    margin: 0 auto;
}

.ep-hero-badge {
    display: inline-block;
    background: rgba(26,127,255,0.14);
    border: 1px solid rgba(26,127,255,0.35);
    color: #1a7fff;
    padding: 4px 16px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
}

.ep-hero-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
}

.ep-hero-highlight {
    background: var(--gradient-primary, linear-gradient(135deg, #1a7fff 0%, #00d084 100%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.ep-hero-sub {
    font-size: 1.05rem;
    color: rgba(248,249,250,0.65);
    margin-bottom: 2.5rem;
    line-height: 1.6;
    font-weight: 300;
}

/* Search bar */
.ep-search-wrap {
    position: relative;
    max-width: 580px;
    margin: 0 auto;
}

.ep-search-icon {
    position: absolute;
    left: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    pointer-events: none;
}

.ep-search-input {
    width: 100%;
    padding: 1rem 3rem 1rem 3.2rem;
    background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 50px;
    color: #f8f9fa;
    font-size: 1rem;
    font-family: var(--font-body, sans-serif);
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    outline: none;
    box-sizing: border-box;
}

.ep-search-input::placeholder {
    color: rgba(248,249,250,0.4);
}

.ep-search-input:focus {
    border-color: rgba(26,127,255,0.6);
    background: rgba(26,127,255,0.08);
    box-shadow: 0 0 0 3px rgba(26,127,255,0.15);
}

.ep-search-clear {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.1);
    border: none;
    color: rgba(248,249,250,0.7);
    width: 24px; height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
}
.ep-search-clear:hover { background: rgba(255,255,255,0.2); }

/* ── BODY (sidebar + main) ─────────────────────────────── */
.ep-body {
    display: flex;
    gap: 2rem;
    padding: 2.5rem 5%;
    position: relative;
    z-index: 2;
    max-width: 1500px;
    margin: 0 auto;
    box-sizing: border-box;
}

/* ── LEFT SIDEBAR ──────────────────────────────────────── */
.ep-sidebar {
    width: 240px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ep-filter-group {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.ep-filter-group-title {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(248,249,250,0.45);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}

.ep-filter-btn {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.8rem;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: rgba(248,249,250,0.65);
    font-size: 0.88rem;
    font-family: var(--font-body, sans-serif);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    text-align: left;
    width: 100%;
}

.ep-filter-btn:hover {
    background: rgba(255,255,255,0.06);
    color: #f8f9fa;
}

.ep-filter-btn--active {
    background: rgba(26,127,255,0.15);
    color: #1a7fff;
    font-weight: 700;
}

.ep-filter-icon { font-size: 1rem; flex-shrink: 0; }

.ep-filter-label { flex: 1; }

.ep-filter-count {
    background: rgba(255,255,255,0.08);
    border-radius: 9999px;
    padding: 1px 8px;
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(248,249,250,0.5);
}

.ep-filter-btn--active .ep-filter-count {
    background: rgba(26,127,255,0.25);
    color: #1a7fff;
}

/* Enrolled box */
.ep-enrolled-box {
    border-color: rgba(26,127,255,0.2);
    background: rgba(26,127,255,0.05);
}

.ep-enrolled-stat {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.ep-enrolled-num {
    font-size: 2.2rem;
    font-weight: 900;
    background: var(--gradient-primary, linear-gradient(135deg, #1a7fff, #00d084));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
}

.ep-enrolled-label {
    font-size: 0.85rem;
    color: rgba(248,249,250,0.55);
}

.ep-dashboard-link,
.ep-login-link {
    display: block;
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s;
    text-align: center;
}

.ep-dashboard-link {
    background: rgba(26,127,255,0.12);
    color: #1a7fff;
    border: 1px solid rgba(26,127,255,0.25);
}
.ep-dashboard-link:hover { background: rgba(26,127,255,0.22); }

.ep-login-link {
    background: rgba(255,255,255,0.06);
    color: rgba(248,249,250,0.7);
    border: 1px solid rgba(255,255,255,0.1);
}
.ep-login-link:hover { background: rgba(255,255,255,0.1); }

/* ── MAIN CONTENT ──────────────────────────────────────── */
.ep-main { flex: 1; min-width: 0; }

/* Results bar */
.ep-results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.ep-results-text {
    font-size: 0.9rem;
    color: rgba(248,249,250,0.6);
}

.ep-results-text strong { color: #f8f9fa; }

.ep-clear-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(248,249,250,0.7);
    border-radius: 8px;
    padding: 0.4rem 0.9rem;
    font-size: 0.82rem;
    cursor: pointer;
    font-family: var(--font-body, sans-serif);
    transition: background 0.15s, color 0.15s;
}
.ep-clear-btn:hover { background: rgba(255,255,255,0.12); color: #f8f9fa; }

/* Empty state */
.ep-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    gap: 1rem;
    text-align: center;
}
.ep-empty-icon { font-size: 4rem; opacity: 0.5; }
.ep-empty-title { font-size: 1.4rem; font-weight: 700; }
.ep-empty-text { color: rgba(248,249,250,0.55); font-size: 0.95rem; }

/* ── EVENTS GRID ───────────────────────────────────────── */
.ep-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

/* ── EVENT CARD ────────────────────────────────────────── */
.ep-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    display: flex;
    flex-direction: column;
}

.ep-card:hover {
    transform: translateY(-6px);
    border-color: rgba(26,127,255,0.4);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
}

.ep-card--joined {
    border-color: rgba(0,208,132,0.35);
    background: rgba(0,208,132,0.04);
}
.ep-card--joined:hover {
    border-color: rgba(0,208,132,0.6);
    box-shadow: 0 16px 48px rgba(0,208,132,0.15);
}

/* Image area */
.ep-card-img {
    position: relative;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.ep-card-emoji {
    font-size: 5rem;
    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.4));
    z-index: 1;
    transition: transform 0.25s ease;
}
.ep-card:hover .ep-card-emoji { transform: scale(1.12); }

/* Top-left overlay (category + joined chip) */
.ep-card-img-overlay {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    z-index: 2;
}

.ep-cat-chip {
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(8px);
    color: #fff;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.ep-joined-chip {
    background: rgba(0,208,132,0.85);
    color: #fff;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 700;
}

/* Bottom overlay (price) */
.ep-card-img-bottom {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    z-index: 2;
}

.ep-price-chip {
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px);
    color: #f8f9fa;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
}

.ep-price-chip--free {
    background: rgba(0,208,132,0.75);
    color: #fff;
}

/* Card body */
.ep-card-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;
}

.ep-card-title {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
}

.ep-card-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.ep-card-meta-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: rgba(248,249,250,0.6);
}

.ep-meta-icon { font-size: 0.85rem; }

/* Card footer */
.ep-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255,255,255,0.06);
}

.ep-diff-badge {
    background: rgba(255,255,255,0.08);
    color: rgba(248,249,250,0.6);
    padding: 2px 10px;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 600;
}

.ep-btn-join,
.ep-btn-leave {
    padding: 0.45rem 1rem;
    border-radius: 9999px;
    border: none;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--font-body, sans-serif);
    transition: opacity 0.15s, transform 0.15s;
}
.ep-btn-join:hover, .ep-btn-leave:hover { opacity: 0.88; transform: scale(1.03); }

.ep-btn-join {
    background: linear-gradient(135deg, #1a7fff 0%, #0066cc 100%);
    color: #fff;
}

.ep-btn-leave {
    background: rgba(239,68,68,0.15);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.3);
}

/* ── OVERLAY ───────────────────────────────────────────── */
.ep-overlay-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 1.5rem;
    overflow-y: auto;
    animation: epOverlayIn 0.2s ease;
}

@keyframes epOverlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.ep-overlay {
    background: #0d1730;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    width: 100%;
    max-width: 580px;
    position: relative;
    animation: epPanelIn 0.25s ease;
    margin: auto 0;
}

@keyframes epPanelIn {
    from { opacity: 0; transform: scale(0.93) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}


/* Close button */
.ep-overlay-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    width: 36px; height: 36px;
    border-radius: 50%;
    border: none;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(8px);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, transform 0.15s;
}
.ep-overlay-close:hover {
    background: rgba(239,68,68,0.6);
    transform: scale(1.1);
}

/* Overlay hero */
.ep-overlay-hero {
    height: 170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
}

.ep-overlay-emoji {
    font-size: 4rem;
    filter: drop-shadow(0 4px 16px rgba(0,0,0,0.45));
    z-index: 1;
}

.ep-overlay-hero-chips {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    z-index: 1;
    padding: 0 1rem;
}

.ep-overlay-chip {
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
    color: #fff;
    padding: 4px 14px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}
.ep-overlay-chip--free   { background: rgba(0,208,132,0.75); }
.ep-overlay-chip--joined { background: rgba(0,208,132,0.75); }

/* Overlay scrollable content */
.ep-overlay-content {
    padding: 1.75rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.ep-overlay-title {
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 1.2;
    margin: 0;
}

/* Meta info grid */
.ep-overlay-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
}

.ep-overlay-meta-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 0.85rem;
}

.ep-overlay-meta-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 1px; }

.ep-overlay-meta-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(248,249,250,0.45);
    margin-bottom: 0.2rem;
}

.ep-overlay-meta-val {
    font-size: 0.9rem;
    font-weight: 600;
    color: #f8f9fa;
    line-height: 1.35;
}

/* Clickable location meta item */
.ep-overlay-meta-item--clickable {
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
}
.ep-overlay-meta-item--clickable:hover {
    background: rgba(26,127,255,0.1);
    border-color: rgba(26,127,255,0.3);
}

.ep-map-toggle-hint {
    font-size: 0.72rem;
    font-weight: 600;
    color: #1a7fff;
    white-space: nowrap;
    align-self: center;
    flex-shrink: 0;
}

/* Map wrapper inside overlay */
.ep-overlay-map-wrap {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    animation: epMapIn 0.2s ease;
}

@keyframes epMapIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Override Leaflet z-index inside overlay */
.ep-overlay-map-wrap .leaflet-pane,
.ep-overlay-map-wrap .leaflet-top,
.ep-overlay-map-wrap .leaflet-bottom {
    z-index: 1 !important;
}

/* Description */
.ep-overlay-desc {
    font-size: 0.95rem;
    color: rgba(248,249,250,0.75);
    line-height: 1.7;
    margin: 0;
    padding: 1rem;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.06);
}

/* Capacity */
.ep-overlay-capacity {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.ep-overlay-capacity-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: rgba(248,249,250,0.6);
}

.ep-overlay-capacity-pct { font-weight: 700; color: #f8f9fa; }

.ep-overlay-capacity-bar {
    height: 8px;
    background: rgba(255,255,255,0.08);
    border-radius: 9999px;
    overflow: hidden;
}

.ep-overlay-capacity-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 0.6s ease;
}
.ep-cap--low  { background: linear-gradient(90deg, #10b981, #34d399); }
.ep-cap--mid  { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.ep-cap--high { background: linear-gradient(90deg, #ef4444, #f97316); }

.ep-overlay-capacity-text {
    font-size: 0.78rem;
    color: rgba(248,249,250,0.5);
}

/* Tags */
.ep-overlay-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.ep-overlay-tag {
    background: rgba(26,127,255,0.1);
    border: 1px solid rgba(26,127,255,0.25);
    color: #7ab8ff;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.78rem;
    font-weight: 600;
}

/* Action buttons */
.ep-overlay-actions {
    padding-top: 0.25rem;
}

.ep-overlay-btn-join,
.ep-overlay-btn-leave {
    width: 100%;
    padding: 0.9rem 1.5rem;
    border-radius: 14px;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--font-body, sans-serif);
    transition: opacity 0.15s, transform 0.15s;
}
.ep-overlay-btn-join:hover,
.ep-overlay-btn-leave:hover { opacity: 0.88; transform: translateY(-2px); }

.ep-overlay-btn-join {
    background: linear-gradient(135deg, #1a7fff 0%, #0052cc 100%);
    color: #fff;
    box-shadow: 0 6px 24px rgba(26,127,255,0.35);
}

.ep-overlay-btn-leave {
    background: rgba(239,68,68,0.12);
    border: 1.5px solid rgba(239,68,68,0.4);
    color: #f87171;
}

/* ── RESPONSIVE ────────────────────────────────────────── */
@media (max-width: 1100px) {
    .ep-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
}

@media (max-width: 860px) {
    .ep-body {
        flex-direction: column;
        padding: 1.5rem 4%;
    }

    .ep-sidebar {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .ep-enrolled-box {
        grid-column: span 2;
    }

    .ep-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
}

@media (max-width: 560px) {
    .ep-hero { padding: 3rem 5% 3.5rem; }

    .ep-sidebar {
        grid-template-columns: 1fr;
    }

    .ep-enrolled-box {
        grid-column: span 1;
    }

    .ep-grid {
        grid-template-columns: 1fr;
    }

    .ep-overlay-meta-grid {
        grid-template-columns: 1fr;
    }

    .ep-overlay-content {
        padding: 1.25rem 1.25rem 1.5rem;
    }
}

/* ═══ RoutesPage.css ═══ */
/* RoutesPage — stiluri de bază, completate în commit 9 */

.routes-page {
  min-height: 100vh;
  background: radial-gradient(1200px at 20% 120px, rgba(26, 127, 255, 0.12), transparent 45%),
              radial-gradient(900px at 80% 0px, rgba(0, 216, 132, 0.12), transparent 50%),
              var(--dark);
  color: var(--text-primary);
  position: relative;
}

/* ---- Hero ---- */
.routes-hero {
  padding: 120px 1.5rem 3rem;
  text-align: center;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 25%),
    linear-gradient(180deg, var(--dark-elevated) 0%, var(--dark) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.routes-hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.routes-hero-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  font-family: 'Rajdhani', sans-serif;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.routes-hero-highlight {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.routes-hero-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 2rem;
}

.routes-hero-stats {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.routes-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
}

.routes-stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-light);
  font-family: 'Rajdhani', sans-serif;
  text-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
}

.routes-stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ---- Layout principal ---- */
.routes-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.routes-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, rgba(26, 127, 255, 0.12) 0%, rgba(0, 216, 132, 0.1) 100%);
  border: 1px solid rgba(104, 168, 255, 0.35);
  border-radius: 14px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
}

.routes-cta-title {
  margin: 0;
  font-weight: 800;
  color: #e8f0ff;
  font-size: 1.05rem;
}

.routes-cta-sub {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.routes-cta-selected {
  margin: 6px 0 0;
  color: #cde4ff;
  font-size: 0.92rem;
  font-weight: 700;
}

.routes-cta-btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: var(--gradient-primary);
  color: #0d111a;
  font-weight: 800;
  cursor: pointer;
  min-width: 190px;
  transition: transform 0.12s ease, opacity 0.2s;
}

.routes-cta-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.routes-cta-btn:not(:disabled):hover {
  transform: translateY(-1px) scale(1.01);
}

.routes-cta-btn:focus-visible {
  outline: 2px solid rgba(104, 168, 255, 0.9);
  outline-offset: 2px;
}

.routes-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.5rem;
  min-height: 70vh;
}

@media (max-width: 900px) {
  .routes-layout {
    grid-template-columns: 1fr;
  }

  .routes-sidebar {
    position: static;
    max-height: none;
    box-shadow: none;
  }
}

/* ---- Buton Home (Commit 10) ---- */
.routes-home-btn {
  position: fixed;
  left: 22px;
  bottom: 92px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1a7fff, #00d884);
  color: #0d111a;
  font-size: 1.25rem;
  font-weight: 800;
  border: 2px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
  transition: transform 0.14s ease, box-shadow 0.2s ease;
  z-index: 320;
}

.routes-home-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.42);
}

.routes-home-btn:focus-visible {
  outline: 3px solid rgba(104, 168, 255, 0.9);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .routes-home-btn {
    left: 16px;
    bottom: 86px;
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 1200px) {
  .routes-layout {
    grid-template-columns: 320px 1fr;
  }
}

/* ---- Placeholder sidebar ---- */
.routes-sidebar {
  background: var(--dark-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  overflow: hidden;
  position: sticky;
  top: 110px;
  max-height: calc(100vh - 140px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
}

.routes-sidebar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* ---- Placeholder hartă ---- */
.routes-map-container {
  background: var(--dark-card);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  overflow: hidden;
  min-height: 520px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
}

.leaflet-container {
  font-family: 'Inter', sans-serif;
  color: #e8f0ff;
}

.leaflet-container .leaflet-tooltip {
  background: #0e1524;
  color: #d6e6ff;
  border: 1px solid rgba(104, 168, 255, 0.4);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
}

.leaflet-container .leaflet-popup-content-wrapper {
  background: #0e1524;
  color: #e8f0ff;
  border-radius: 12px;
  border: 1px solid rgba(104, 168, 255, 0.35);
}

.leaflet-container .leaflet-popup-tip {
  background: #0e1524;
  border: 1px solid rgba(104, 168, 255, 0.35);
}

.leaflet-control-zoom a {
  background: #0e1524;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e8f0ff;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
}

.leaflet-control-zoom a:hover {
  background: #152033;
  color: #68a8ff;
}

.leaflet-control-zoom a:focus-visible {
  outline: 2px solid rgba(104, 168, 255, 0.9);
  outline-offset: 2px;
}

.routes-map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.routes-map-placeholder-icon {
  font-size: 3rem;
}

.routes-map-placeholder p {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.routes-map-placeholder small {
  font-size: 0.82rem;
  opacity: 0.6;
}

/* ---- Routes Sidebar (Commit 5) ---- */
.rsb {
  padding: 1.1rem 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  height: 100%;
  overflow-y: auto;
}

.rsb-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.75rem;
}

.rsb-label {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 700;
}

.rsb-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.rsb-chip {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  color: var(--text-secondary);
  font-weight: 700;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.rsb-chip:hover {
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--text-primary);
}

.rsb-chip:focus-visible {
  outline: 2px solid rgba(104, 168, 255, 0.8);
  outline-offset: 2px;
}

.rsb-chip--active {
  background: rgba(26, 127, 255, 0.08);
  border-color: rgba(26, 127, 255, 0.4);
  color: #68a8ff;
}

.rsb-count {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.rsb-reset {
  margin-left: auto;
  border: none;
  background: transparent;
  color: #68a8ff;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.85rem;
}

.rsb-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rsb::-webkit-scrollbar {
  width: 8px;
}
.rsb::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}
.rsb::-webkit-scrollbar-track {
  background: transparent;
}

.rsb-empty {
  color: var(--text-secondary);
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 1.1rem;
  font-size: 0.9rem;
}

.rsb-card {
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  cursor: pointer;
  transition: all 0.16s ease;
}

.rsb-card:hover {
  border-color: rgba(104, 168, 255, 0.4);
  transform: translateY(-2px);
}

.rsb-card--selected {
  border-color: rgba(104, 168, 255, 0.8);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.24);
}

.rsb-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rsb-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.rsb-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.rsb-card-name {
  font-weight: 800;
  color: var(--text-primary);
}

.rsb-card-region {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.rsb-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  font-size: 0.86rem;
  color: var(--text-secondary);
}

.rsb-meta-item strong {
  color: var(--text-primary);
}

.rsb-diff-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.8rem;
}

@media (max-width: 900px) {
  .rsb {
    padding: 1rem;
    max-height: none;
    overflow: visible;
  }

  .routes-cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .routes-cta-btn {
    width: 100%;
  }
}

/* ---- Popup hartă trasee (Commit 6) ---- */
.route-popup {
  background: #0e1524;
  color: #e8f0ff;
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(104, 168, 255, 0.35);
}

.route-popup__title {
  font-weight: 800;
  margin: 0 0 6px;
  font-size: 0.98rem;
}

.route-popup__meta {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  color: #b6c6e2;
  font-size: 0.84rem;
  margin-bottom: 6px;
}

.route-popup__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.route-popup__tags .tag {
  background: rgba(104, 168, 255, 0.12);
  border: 1px solid rgba(104, 168, 255, 0.4);
  color: #d6e6ff;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.route-popup__desc {
  margin: 0;
  color: #c5d3ec;
  font-size: 0.85rem;
  line-height: 1.4;
  max-width: 320px;
}

/* ---- Toast routes page (Commit 7) ---- */
.routes-toast {
  position: fixed;
  right: 24px;
  bottom: 26px;
  z-index: 300;
  background: #0d1526;
  border: 1px solid rgba(104, 168, 255, 0.35);
  color: #e8f0ff;
  border-radius: 12px;
  padding: 12px 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.routes-toast-icon {
  font-size: 1.1rem;
}

/* ---- Route Details Panel (Commit 8) ---- */
.route-details-card {
  margin-top: 1.25rem;
  background: var(--dark-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.15rem 1.25rem 1.2rem;
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.28);
  position: relative;
  overflow: hidden;
}

.route-details-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(900px at 85% 10%, rgba(26, 127, 255, 0.08), transparent 45%);
  pointer-events: none;
}

.rdc-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.rdc-kicker {
  margin: 0;
  color: #7ea7ff;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.rdc-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #e8f0ff;
}

.rdc-sub {
  margin: 2px 0 0;
  color: var(--text-secondary);
  line-height: 1.55;
}

.rdc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.rdc-tag {
  background: rgba(104, 168, 255, 0.08);
  border: 1px solid rgba(104, 168, 255, 0.28);
  color: #d6e6ff;
  padding: 5px 9px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(26, 127, 255, 0.12);
}

.rdc-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.9rem;
  margin: 0.6rem 0 1.1rem;
}

.rdc-stat {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 0.75rem 0.85rem;
}

.rdc-stat-label {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.82rem;
}

.rdc-stat-value {
  margin: 2px 0 0;
  color: #e8f0ff;
  font-weight: 800;
  font-size: 1.05rem;
}

.rdc-highlights {
  margin-top: 0.4rem;
}

.rdc-highlights-title {
  margin: 0 0 0.5rem;
  color: #cde4ff;
  font-weight: 800;
  font-size: 0.95rem;
}

.rdc-highlights-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.rdc-chip {
  background: rgba(0, 216, 132, 0.14);
  border: 1px solid rgba(0, 216, 132, 0.38);
  color: #bbffdf;
  padding: 5px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.82rem;
  box-shadow: 0 6px 16px rgba(0, 216, 132, 0.18);
}

.rdc-empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 1.4rem 0.5rem;
}

.rdc-empty-icon {
  font-size: 2rem;
  margin-bottom: 0.35rem;
}

.rdc-empty-title {
  margin: 0 0 0.3rem;
  color: #e8f0ff;
  font-weight: 800;
}

.rdc-empty-sub {
  margin: 0;
  color: var(--text-secondary);
}

@media (max-width: 700px) {
  .route-details-card {
    padding: 1rem;
  }
}

/* ═══ ScrollToTop.css ═══ */
.scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: var(--z-fixed);
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    border: none;
    background: var(--primary-gradient);
    color: #fff;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    opacity: 0;
    transform: translateY(16px);
    pointer-events: none;
    transition: opacity var(--transition-base), transform var(--transition-base);
}

.scroll-to-top--visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

.scroll-to-top:hover {
    background: var(--gradient-secondary);
    box-shadow: 0 8px 24px rgba(255, 107, 0, 0.4);
    transform: translateY(-2px);
}

.scroll-to-top:active {
    transform: translateY(0);
}


/* ═══ MOBILE RESPONSIVE FIXES ═══ */
html { overflow-x: hidden; }
body { -webkit-text-size-adjust: 100%; }

@media (max-width: 768px) {
  .navbar { padding: 1rem 4%; flex-wrap: wrap; }
  .nav-hamburger { display: flex; order: 0; }
  .nav-links { display: none; width: 100%; flex-direction: column; gap: 0; padding: 0.5rem 0 1rem; border-top: 1px solid var(--dark-border); margin-top: 0.5rem; order: 10; }
  .nav-links--open { display: flex; }
  .nav-links li { width: 100%; }
  .nav-link-btn { display: block; width: 100%; text-align: left; padding: 0.75rem 0; }
  .nav-actions { gap: 0.5rem; margin-left: auto; }
  .nav-actions .btn { padding: 0.5rem 0.75rem; font-size: 0.78rem; }
  .nav-dropdown { position: fixed; top: auto; bottom: 0; left: 0; right: 0; border-radius: 16px 16px 0 0; min-width: 100%; max-height: 70vh; overflow-y: auto; }

  .hero { min-height: 70vh; }
  .hero p { font-size: 1.05rem; }
  .hero-cta { flex-direction: column; }
  .features-grid { grid-template-columns: 1fr; }
  .feature-card { padding: 2rem; }
  .feature-card:hover { transform: translateY(-4px); }
  .features { padding: 5rem 5%; }
  .section-header { margin-bottom: 3rem; }
  .cta-section { padding: 5rem 5%; }
  .home-feedback-section { padding: 4rem 5%; }
  .home-feedback-inner { grid-template-columns: 1fr; gap: 2.5rem; }
  .footer-content { grid-template-columns: 1fr; gap: 2rem; }

  .contact-hero { padding: 100px 5% 3rem; min-height: auto; }
  .contact-form-wrapper { padding: 1.5rem; }
  .contact-faq-section { padding: 4rem 5%; }

  .feedback-hero { padding-top: 100px; min-height: auto; }
  .feedback-form-wrapper { padding: 1.5rem; }
  .feedback-reviews-section { padding: 4rem 4%; }
  .feedback-cta-section { padding: 4rem 5%; }
}

@media (max-width: 640px) {
  .contact-form-row { grid-template-columns: 1fr; }
  .contact-sidebar { grid-template-columns: 1fr; }
  .contact-info-grid { grid-template-columns: 1fr 1fr; }
  .contact-submit-btn { width: 100%; }
  .contact-faq-grid .faq-question { padding: 1rem 1.25rem; font-size: 0.95rem; }
  .contact-feedback-promo-inner { flex-direction: column; text-align: center; padding: 1.75rem; }
  .contact-feedback-promo-btn { width: 100%; }
  .feedback-sidebar { grid-template-columns: 1fr; }
  .feedback-submit-btn { width: 100%; }
  .feedback-stats-bar { gap: 1.5rem; padding: 0 4% 3rem; }
  .feedback-stat-number { font-size: 1.5rem; }
  .star-btn { font-size: 1.6rem; }
  .review-card { padding: 1.25rem; }
  .review-header { flex-wrap: wrap; gap: 0.5rem; }
}

@media (max-width: 480px) {
  .stats { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 420px) {
  .contact-info-grid { grid-template-columns: 1fr; }
  .nav-actions .btn-outline { display: none; }
}

@media (max-width: 900px) {
  .routes-layout { grid-template-columns: 1fr; }
  .routes-sidebar { position: static; max-height: none; box-shadow: none; }
  .routes-map-container { min-height: 350px; }
  .routes-hero { padding: 100px 1.25rem 2.5rem; }
  .routes-hero-stats { gap: 1rem; }
  .routes-stat-value { font-size: 1.4rem; }
  .rsb { padding: 1rem; max-height: none; overflow: visible; }
  .routes-cta { flex-direction: column; align-items: flex-start; }
  .routes-cta-btn { width: 100%; }
}

@media (max-width: 960px) {
  .contact-main-inner { grid-template-columns: 1fr; }
  .contact-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .contact-map-embed { grid-column: 1 / -1; }
  .feedback-main-inner { grid-template-columns: 1fr; }
  .feedback-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
}

@media (max-width: 560px) {
  .ep-hero { padding: 3rem 5% 3.5rem; }
  .ep-sidebar { grid-template-columns: 1fr; }
  .ep-enrolled-box { grid-column: span 1; }
  .ep-grid { grid-template-columns: 1fr; }
  .ep-overlay-meta-grid { grid-template-columns: 1fr; }
  .ep-overlay-content { padding: 1.25rem 1.25rem 1.5rem; }
  .ep-overlay-backdrop { padding: 0; align-items: flex-end; }
  .ep-overlay { border-radius: 20px 20px 0 0; max-height: 92vh; overflow-y: auto; margin: 0; }
  .ep-overlay-hero { border-radius: 20px 20px 0 0; }
  .ep-overlay-title { font-size: 1.3rem; }
  .ep-search-wrap { margin: 0 auto; max-width: 100%; }
  .ep-card-body { padding: 1rem; }
  .ep-body { padding: 1.25rem 4%; }
  .ep-card-footer { flex-direction: column; gap: 0.5rem; align-items: stretch; }
}

@media (max-width: 860px) {
  .ep-body { flex-direction: column; padding: 1.5rem 4%; }
  .ep-sidebar { width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .ep-enrolled-box { grid-column: span 2; }
}
`;
