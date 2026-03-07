// SignUp page styles — converted from SignUp.su-module.su-css to TypeScript
export const signUpStyles = `
﻿/* ===== VARIABLES ===== */
:root {
    --blue: #1a7fff;
    --blue-hover: #3d95ff;
    --blue-glow: rgba(26, 127, 255, 0.25);
    --bg: #0a0f1e;
    --bg-card: #0d1526;
    --bg-input: #0a1020;
    --border: rgba(26, 127, 255, 0.2);
    --border-focus: #1a7fff;
    --text: #ffffff;
    --text-muted: #7a8baa;
    --text-placeholder: #3d5070;
}

/* ===== PAGE ===== */
.su-page {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg);
    padding: 2rem 1rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow: hidden;
}

/* Dot grid overlay — same as homepage */
.su-grid {
    position: fixed;
    inset: 0;
    background-image: radial-gradient(rgba(26, 127, 255, 0.12) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
}

.su-page::before {
    content: '';
    position: fixed;
    top: -30%;
    right: -20%;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(26, 127, 255, 0.12) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
}

.su-page::after {
    content: '';
    position: fixed;
    bottom: -20%;
    left: -15%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 200, 150, 0.06) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
}

/* ===== CARD ===== */
.su-card {
    position: relative;
    z-index: 1;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 6px;
    width: 100%;
    max-width: 480px;
    padding: 2.75rem 2.5rem 2.5rem;
    box-shadow:
            0 0 0 1px rgba(26, 127, 255, 0.08),
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 80px rgba(26, 127, 255, 0.05);
}

/* ===== HEADER ===== */
.su-header {
    text-align: center;
    margin-bottom: 2.25rem;
}

.su-logo {
    font-size: 1.625rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    line-height: 1;
    margin-bottom: 0.625rem;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.su-logoWhite {
    color: #ffffff;
}

.su-logoBlue {
    color: var(--blue);
}

.su-subtitle {
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-weight: 400;
    letter-spacing: 0.01em;
}

/* ===== FORM ===== */
.su-form {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
}

.su-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.875rem;
}

.su-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.su-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

/* ===== INPUTS ===== */
.su-inputWrapper {
    position: relative;
}

.su-input {
    width: 100%;
    padding: 0.65rem 0.9rem;
    font-size: 0.875rem;
    color: var(--text);
    background: var(--bg-input);
    border: 1px solid rgba(26, 127, 255, 0.18);
    border-radius: 4px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    box-sizing: border-box;
    font-family: inherit;
    -webkit-appearance: none;
}

.su-input::placeholder {
    color: var(--text-placeholder);
    font-size: 0.8125rem;
}

.su-input:focus {
    border-color: var(--blue);
    background: #0c1628;
    box-shadow: 0 0 0 3px var(--blue-glow);
}

.su-inputWithToggle {
    padding-right: 2.75rem;
}

.su-inputError {
    border-color: #ef4444 !important;
    background: rgba(239, 68, 68, 0.05) !important;
}

.su-inputError:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

.su-inputValid {
    border-color: rgba(34, 197, 94, 0.5);
}

/* ===== TOGGLE BUTTON ===== */
.su-toggle {
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    padding: 0.25rem;
    transition: color 0.15s ease;
    border-radius: 3px;
}

.su-toggle:hover {
    color: var(--blue);
}

/* ===== STRENGTH BAR ===== */
.su-strengthWrapper {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: 0.375rem;
}

.su-strengthBar {
    flex: 1;
    height: 3px;
    background: rgba(255, 255, 255, 0.07);
    border-radius: 2px;
    overflow: hidden;
}

.su-strengthFill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.35s ease, background-color 0.35s ease;
}

.su-strengthLabel {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    min-width: 52px;
    text-align: right;
    transition: color 0.3s;
}

/* ===== REQUIREMENTS ===== */
.su-requirements {
    list-style: none;
    padding: 0;
    margin: 0.375rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.su-reqMet,
.su-reqUnmet {
    font-size: 0.74rem;
    transition: color 0.2s ease;
    font-weight: 500;
}

.su-reqMet {
    color: #22c55e;
}

.su-reqUnmet {
    color: var(--text-muted);
}

/* ===== ERROR TEXT ===== */
.su-error {
    font-size: 0.74rem;
    color: #ef4444;
    font-weight: 400;
}

/* ===== SUBMIT BUTTON ===== */
.su-submit {
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.8rem 1rem;
    background: var(--blue);
    color: #ffffff;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    box-shadow: 0 4px 20px rgba(26, 127, 255, 0.35);
}

.su-submit:hover {
    background: var(--blue-hover);
    box-shadow: 0 6px 28px rgba(26, 127, 255, 0.5);
}

.su-submit:active {
    transform: translateY(1px);
    box-shadow: 0 2px 12px rgba(26, 127, 255, 0.3);
}

/* ===== LOGIN PROMPT ===== */
.su-loginPrompt {
    text-align: center;
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin: 0.25rem 0 0;
}

.su-loginLink {
    color: var(--blue);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s ease;
}

.su-loginLink:hover {
    color: var(--blue-hover);
    text-decoration: underline;
}

/* ===== SUCCESS STATE ===== */
.su-successIcon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--blue), #00c8a0);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #fff;
    font-weight: 700;
    margin: 0 auto 1.25rem;
    box-shadow: 0 0 30px rgba(26, 127, 255, 0.4);
}

.su-successTitle {
    font-size: 1.25rem;
    font-weight: 900;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.03em;
    margin: 0 0 0.75rem;
    font-family: inherit;
}

.su-successText {
    font-size: 0.875rem;
    color: var(--text-muted);
    text-align: center;
    margin: 0;
    line-height: 1.7;
}

.su-accent {
    color: var(--blue);
    font-weight: 700;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 520px) {
    .su-card {
        padding: 2rem 1.25rem;
        border-radius: 4px;
    }

    .su-row {
        grid-template-columns: 1fr;
    }
}
`;
