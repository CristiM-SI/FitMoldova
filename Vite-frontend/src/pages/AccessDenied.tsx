import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

// ─────────────────────────────────────────────────────────────────────────────
// CSS responsiv injectat o singură dată — înlocuiește inline styles pentru
// elementele care trebuie să se adapteze la ecrane mici (mobil < 480px)
// ─────────────────────────────────────────────────────────────────────────────
const RESPONSIVE_STYLES = `
  .access-denied-page {
    min-width: 320px;
    overflow-x: hidden;
  }

  .access-denied-card {
    text-align: center;
    max-width: 480px;
    width: 100%;
    padding: 0 1rem;
  }

  .access-denied-icon-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .access-denied-icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--danger-bg);
    border: 1px solid rgba(255, 59, 59, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .access-denied-code {
    font-size: 14px;
    font-weight: 500;
    color: var(--danger);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .access-denied-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .access-denied-desc {
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .access-denied-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .access-denied-btn-primary {
    padding: 0.65rem 1.5rem;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background var(--transition-fast);
    white-space: nowrap;
  }

  .access-denied-btn-primary:hover {
    background: var(--primary-dark);
  }

  .access-denied-btn-outline {
    padding: 0.65rem 1.5rem;
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--dark-border);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color var(--transition-fast);
    white-space: nowrap;
  }

  .access-denied-btn-outline:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }

  /* ── Responsive: tabletă (481px – 768px) ────────────────────────────────── */
  @media (min-width: 481px) and (max-width: 768px) {
    .access-denied-card {
      max-width: 560px;
      padding: 0 1.5rem;
    }

    .access-denied-icon-circle {
      width: 88px;
      height: 88px;
    }

    .access-denied-title {
      font-size: 1.9rem;
    }
  }

  /* ── Responsive: desktop (769px – 1199px) ───────────────────────────────── */
  @media (min-width: 769px) and (max-width: 1199px) {
    .access-denied-card {
      max-width: 560px;
    }

    .access-denied-icon-circle {
      width: 96px;
      height: 96px;
    }

    .access-denied-title {
      font-size: 2rem;
    }

    .access-denied-desc {
      font-size: 1rem;
    }

    .access-denied-btn-primary,
    .access-denied-btn-outline {
      padding: 0.75rem 2rem;
      font-size: 0.95rem;
    }
  }

  /* ── Responsive: desktop mare (≥ 1200px) ────────────────────────────────── */
  @media (min-width: 1200px) {
    .access-denied-card {
      max-width: 620px;
    }

    .access-denied-icon-circle {
      width: 110px;
      height: 110px;
    }

    .access-denied-title {
      font-size: 2.25rem;
    }

    .access-denied-desc {
      font-size: 1.05rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .access-denied-btn-primary,
    .access-denied-btn-outline {
      padding: 0.8rem 2.5rem;
      font-size: 1rem;
    }
  }

  /* ── Responsive: ecrane mici (mobil < 480px) ─────────────────────────────── */
  @media (max-width: 480px) {
    .access-denied-icon-circle {
      width: 64px;
      height: 64px;
    }

    .access-denied-title {
      font-size: 1.35rem;
    }

    .access-denied-desc {
      font-size: 0.88rem;
    }

    /* Butoanele se stivuiesc vertical pe mobil */
    .access-denied-actions {
      flex-direction: column;
      align-items: stretch;
      gap: 0.6rem;
    }

    .access-denied-btn-primary,
    .access-denied-btn-outline {
      width: 100%;
      text-align: center;
      padding: 0.75rem 1rem;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface AccessDeniedProps {
    reason?: 'unauthenticated' | 'unauthorized';
}

// ─────────────────────────────────────────────────────────────────────────────
// Componenta principală
// ─────────────────────────────────────────────────────────────────────────────
const AccessDenied: React.FC<AccessDeniedProps> = ({ reason = 'unauthorized' }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Dacă nu e logat deloc (indiferent de prop) → tratăm ca 401
    const isUnauthenticated = reason === 'unauthenticated' || !isAuthenticated;

    return (
        <>
            {/* Injectăm stilurile responsive o singură dată */}
            <style>{RESPONSIVE_STYLES}</style>

            <div className="access-denied-page" style={{
                minHeight: '100vh',
                background: 'var(--dark)',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Navbar />

                <main style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1rem',
                }}>
                    <div className="access-denied-card">

                        {/* ── Iconiță shield ─────────────────────────────────────────── */}
                        <div className="access-denied-icon-wrap">
                            <div className="access-denied-icon-circle">
                                <ShieldExclamationIcon style={{ width: 36, height: 36, color: 'var(--danger)' }} />
                            </div>
                        </div>

                        {/* ── Cod HTTP ───────────────────────────────────────────────── */}
                        <div className="access-denied-code">
                            {isUnauthenticated ? '401 — Neautentificat' : '403 — Acces interzis'}
                        </div>

                        {/* ── Titlu ──────────────────────────────────────────────────── */}
                        <h1 className="access-denied-title">
                            {isUnauthenticated
                                ? 'Autentificare necesară'
                                : 'Acces restricționat'}
                        </h1>

                        {/* ── Descriere ──────────────────────────────────────────────── */}
                        <p className="access-denied-desc">
                            {isUnauthenticated
                                ? 'Trebuie să fii autentificat pentru a accesa această pagină. Te rugăm să te loghezi cu contul tău.'
                                : 'Nu ai permisiunile necesare pentru a accesa această secțiune. Această zonă este rezervată administratorilor platformei.'}
                        </p>

                        {/* ── Butoane acțiune ────────────────────────────────────────── */}
                        <div className="access-denied-actions">
                            {isUnauthenticated ? (
                                <>
                                    <button
                                        className="access-denied-btn-primary"
                                        onClick={() => navigate({ to: ROUTES.LOGIN })}
                                    >
                                        Autentifică-te
                                    </button>
                                    <button
                                        className="access-denied-btn-outline"
                                        onClick={() => navigate({ to: ROUTES.HOME })}
                                    >
                                        Pagina principală
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="access-denied-btn-primary"
                                        onClick={() => navigate({ to: ROUTES.DASHBOARD })}
                                    >
                                        Du-mă la Dashboard
                                    </button>
                                    <button
                                        className="access-denied-btn-outline"
                                        onClick={() => navigate({ to: ROUTES.HOME })}
                                    >
                                        Pagina principală
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default AccessDenied;
