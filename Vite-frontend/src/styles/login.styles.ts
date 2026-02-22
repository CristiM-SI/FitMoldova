
export const loginStyles = `
  /* --- Import font Barlow de la Google Fonts --- */
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;900&family=Barlow+Condensed:wght@700;900&display=swap');

  /* --- Reset global --- */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* --- Variabile CSS (Design Tokens) --- */
  /* Toate culorile sunt centralizate aici pentru a fi ușor de modificat */
  :root {
    --bg-deep: #050d1a;               /* fundal principal, cel mai întunecat */
    --bg-card: #0a1628;               /* fundal card / panou dreapta */
    --bg-input: #0d1e35;              /* fundal input-uri */
    --blue-primary: #1a6fff;          /* albastru principal (brand) */
    --blue-bright: #2b8fff;           /* albastru mai deschis (hover) */
    --blue-glow: rgba(26,111,255,0.35); /* glow efect pe butoane */
    --text-primary: #ffffff;           /* text alb */
    --text-secondary: #8ba4c8;         /* text secundar (gri-albăstrui) */
    --border-subtle: rgba(43,143,255,0.15); /* bordură subtilă */
    --border-focus: rgba(43,143,255,0.7);   /* bordură la focus */
    --error: #ff4d6d;                  /* culoare eroare (roșu) */
  }

  /* --- Layout de bază --- */
  body {
    font-family: 'Barlow', sans-serif;
    background: var(--bg-deep);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .page {
    display: flex;
    min-height: 100vh;
  }

  /* ============================================================
     STILURI PANOU STÂNG (brand / hero)
  ============================================================ */

  .left-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 60px;
    background: linear-gradient(135deg, #050d1a 0%, #071225 50%, #06101f 100%);
    position: relative;
    overflow: hidden;
  }

  /* Glow decorativ stânga-sus */
  .left-panel::before {
    content: '';
    position: absolute;
    top: -200px;
    left: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(26,111,255,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Glow decorativ dreapta-jos */
  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(26,111,255,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Grila de fundal cu linii subtile */
  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(26,111,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,111,255,0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }

  /* Numele brandului (logo text) */
  .brand-link { text-decoration: none; display: inline-block; position: relative; z-index: 1; }
  .brand-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: 28px;
    color: var(--blue-primary);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Conținut hero — centrul panoului stâng */
  .hero-content { position: relative; z-index: 1; }

  /* Badge "Platforma #1 în Moldova" */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(26,111,255,0.12);
    border: 1px solid rgba(26,111,255,0.3);
    border-radius: 100px;
    padding: 6px 16px;
    margin-bottom: 32px;
  }

  /* Punctul animat din badge (pulsează) */
  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--blue-primary);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .badge-text {
    font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--blue-bright);
  }

  /* Titlu mare hero */
  .hero-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    font-size: clamp(56px, 6vw, 86px);
    line-height: 0.9;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 24px;
  }
  .hero-title .accent { color: var(--blue-primary); display: block; }

  /* Subtitlu hero */
  .hero-subtitle {
    font-size: 16px; color: var(--text-secondary);
    line-height: 1.6; max-width: 400px; margin-bottom: 48px;
  }

  /* Rândul cu statistici */
  .stats-row { display: flex; gap: 48px; }
  .stat-number {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 36px; color: #fff; line-height: 1;
  }
  .stat-number span { color: var(--blue-primary); }
  .stat-label {
    font-size: 12px; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;
  }

  /* Footer stânga */
  .left-footer { position: relative; z-index: 1; font-size: 13px; color: var(--text-secondary); }

  /* ============================================================
     STILURI PANOU DREAPTA (formular login)
  ============================================================ */

  .right-panel {
    width: 480px; min-height: 100vh;
    background: var(--bg-card);
    display: flex; flex-direction: column; justify-content: center;
    padding: 60px 48px;
    border-left: 1px solid var(--border-subtle);
    position: relative;
  }

  /* Linia albastră de accent de sus */
  .right-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, var(--blue-primary), transparent);
  }

  /* Header formular */
  .login-header { margin-bottom: 40px; }
  .login-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 42px;
    text-transform: uppercase; color: #fff; line-height: 1; margin-bottom: 8px;
  }
  .login-subtitle { font-size: 14px; color: var(--text-secondary); }

  /* Buton social (Google) */
  .social-btn {
    display: flex; align-items: center; justify-content: center; gap: 12px;
    width: 100%; padding: 13px;
    background: transparent;
    border: 1px solid var(--border-subtle); border-radius: 8px;
    color: var(--text-primary);
    font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease;
    margin-bottom: 12px; letter-spacing: 0.5px;
  }
  .social-btn:hover { border-color: var(--border-focus); background: rgba(43,143,255,0.05); }

  /* Separator "sau cu email" */
  .divider { display: flex; align-items: center; gap: 16px; margin: 28px 0; }
  .divider-line { flex: 1; height: 1px; background: var(--border-subtle); }
  .divider-text {
    font-size: 12px; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 1px; white-space: nowrap;
  }

  /* Grup câmp formular */
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block; font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--text-secondary); margin-bottom: 8px;
  }
  .input-wrapper { position: relative; }

  /* Input text */
  .form-input {
    width: 100%; padding: 13px 16px;
    background: var(--bg-input);
    border: 1px solid var(--border-subtle); border-radius: 8px;
    color: var(--text-primary);
    font-family: 'Barlow', sans-serif; font-size: 15px;
    outline: none; transition: all 0.2s ease; appearance: none;
  }
  .form-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px var(--blue-glow); }
  .form-input.error { border-color: var(--error); box-shadow: 0 0 0 3px rgba(255,77,109,0.15); }
  .form-input::placeholder { color: rgba(139,164,200,0.4); }

  /* Buton toggle vizibilitate parolă */
  .password-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--text-secondary);
    display: flex; align-items: center; transition: color 0.2s; padding: 0;
  }
  .password-toggle:hover { color: var(--blue-bright); }

  /* Mesaj eroare validare */
  .error-msg { font-size: 12px; color: var(--error); margin-top: 6px; display: flex; align-items: center; gap: 4px; }

  /* Rând cu checkbox + link "Ai uitat parola?" */
  .form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }

  /* Checkbox custom */
  .checkbox-label {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; font-size: 13px; color: var(--text-secondary); user-select: none;
  }
  .checkbox-label input[type="checkbox"] {
    appearance: none; width: 16px; height: 16px;
    border: 1px solid var(--border-subtle); border-radius: 4px;
    background: var(--bg-input); cursor: pointer; position: relative;
    transition: all 0.2s; flex-shrink: 0;
  }
  .checkbox-label input[type="checkbox"]:checked { background: var(--blue-primary); border-color: var(--blue-primary); }
  .checkbox-label input[type="checkbox"]:checked::after {
    content: ''; position: absolute; left: 4px; top: 1px;
    width: 5px; height: 9px;
    border: 2px solid #fff; border-top: none; border-left: none; transform: rotate(45deg);
  }

  /* Link "Ai uitat parola?" */
  .forgot-link {
    font-size: 13px; color: var(--blue-bright); text-decoration: none;
    font-weight: 600; transition: opacity 0.2s;
  }
  .forgot-link:hover { opacity: 0.75; }

  /* Buton principal submit */
  .submit-btn {
    width: 100%; padding: 15px;
    background: var(--blue-primary); border: none; border-radius: 8px;
    color: #fff;
    font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden;
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--blue-bright);
    box-shadow: 0 4px 20px var(--blue-glow);
    transform: translateY(-1px);
  }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  /* Spinner de loading */
  .spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Link "Nu ai cont? Creează cont gratuit" */
  .register-link { text-align: center; margin-top: 24px; font-size: 14px; color: var(--text-secondary); }
  .register-link a { color: var(--blue-bright); font-weight: 700; text-decoration: none; transition: opacity 0.2s; }
  .register-link a:hover { opacity: 0.75; }

  /* ============================================================
     RESPONSIVE — mobile (sub 900px)
     Ascundem panoul stâng, formularul ocupă tot ecranul
  ============================================================ */
  @media (max-width: 900px) {
    .left-panel { display: none; }
    .right-panel { width: 100%; }
  }
`;
