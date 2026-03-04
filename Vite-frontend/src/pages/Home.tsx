import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { scrollToSection } from '../utils/navigation';
import { useAuth } from '../context/AuthContext';
import { tokens } from '../themes/theme';

const t = tokens;

/* ── Feature type ──────────────────────────────────────── */
interface Feature { icon: string; title: string; description: string; route: string; }

const FEATURES: Feature[] = [
  { icon: '📊', title: 'Dashboard Personal', description: 'Vizualizează statistici detaliate, urmărește progresul tău și editează informațiile profilului într-un singur loc centralizat și intuitiv.', route: ROUTES.DASHBOARD },
  { icon: '🏃', title: 'Tracking Activități', description: 'Înregistrează sesiunile de alergare, ciclism sau sală cu introducere manuală sau timer live. Monitorizează distanța, durata și caloriile.', route: ROUTES.ACTIVITIES },
  { icon: '🏆', title: 'Provocări & Competiții', description: 'Participă la challenges motivante, urmărește progresul în timp real și trimite dovezi pentru verificare. Câștigă premii și recunoaștere.', route: ROUTES.CHALLENGES },
  { icon: '📅', title: 'Evenimente Sportive', description: 'Creează și gestionează evenimente, caută și filtrează după preferințe, înscrie-te la competiții și conectează-te cu alți participanți.', route: ROUTES.EVENTS },
  { icon: '🗺️', title: 'Rute Interactive', description: 'Explorează hărți interactive cu rute recomandate de ciclism și alergare. Adaugă propriile tale rute și descoperă noi trasee.', route: ROUTES.ROUTES_MAP },
  { icon: '💬', title: 'Forum & Comunitate', description: 'Participă la discuții pe categorii (general, ciclism, alergare, sală), pune întrebări, împărtășește sfaturi și conectează-te cu comunitatea.', route: ROUTES.FORUM },
  { icon: '📱', title: 'Mesagerie Privată', description: 'Comunicare directă între utilizatori prin mesaje private sau grupuri de discuție pentru planificarea antrenamentelor și evenimente.', route: ROUTES.COMMUNITY },
  { icon: '📸', title: 'Galerii Multimedia', description: 'Încarcă și partajează fotografii de la antrenamente, evenimente și competiții. Creează amintiri alături de comunitate.', route: ROUTES.GALLERY },
  { icon: '👥', title: 'Cluburi Locale', description: 'Creează sau alătură-te cluburilor și comunităților locale sau tematice. Organizează întâlniri și evenimente de grup.', route: ROUTES.CLUBS },
  { icon: '⭐', title: 'Feedback & Recenzii', description: 'Împărtășește experiența ta, evaluează platforma și citește recenziile comunității. Opinia ta ne ajută să creștem.', route: ROUTES.FEEDBACK },
];

const STATS = [
  { number: '50K+', label: 'Utilizatori Activi' },
  { number: '2.5M+', label: 'Km Parcurși' },
  { number: '1.2K+', label: 'Evenimente' },
  { number: '300+', label: 'Cluburi Locale' },
];

const RATINGS = [
  { score: '4.7', label: 'Rating general', stars: 5 },
  { score: '94%', label: 'Utilizatori mulțumiți', stars: 5 },
  { score: '3.2K+', label: 'Recenzii scrise', stars: 4 },
];

/* ── keyframes (injected once) ─────────────────────────── */
const kf = `
@keyframes homeFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,80px) scale(1.1)} }
@keyframes homeSlideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
`;

/* ── Component ─────────────────────────────────────────── */
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
      <Box sx={{ position: 'relative', minHeight: '100vh', pt: '72px' }}>
        <style>{kf}</style>

        {/* Noise */}
        <Box sx={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.5,
          background: 'repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px),repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)',
        }} />
        {/* Orbs */}
        <Box sx={{ position: 'fixed', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.3, pointerEvents: 'none', zIndex: 0, width: 600, height: 600, background: t.primary, top: -300, right: -200, animation: 'homeFloat 20s ease-in-out infinite' }} />
        <Box sx={{ position: 'fixed', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.3, pointerEvents: 'none', zIndex: 0, width: 500, height: 500, background: t.accent, bottom: -200, left: -150, animation: 'homeFloat 25s ease-in-out infinite reverse' }} />

        <Navbar />

        {/* ── HERO ──────────────────────────────────────────── */}
        <Box component="section" sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', px: '5%', pt: '4rem', pb: '4rem', position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: 1200, width: '100%', animation: 'homeSlideUp 1s ease-out' }}>
            <Box sx={{ maxWidth: 700 }}>
              {/* Badge */}
              <Box sx={{
                display: 'inline-block', background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.3)',
                color: '#3385FF', px: '14px', py: '5px', borderRadius: '9999px', fontSize: '0.78rem',
                fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: '1.25rem',
              }}>
                Platforma #1 de Fitness din Moldova
              </Box>

              <Typography variant="h1" sx={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 900, lineHeight: 1.12,
                mb: '1.25rem', letterSpacing: '-0.03em', textAlign: 'left',
              }}>
                Transformă-ți{' '}
                <Box component="span" sx={{
                  background: t.gradientPrimary, WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block',
                }}>Fitness-ul</Box>
                <br />într-o Comunitate
              </Typography>

              <Typography sx={{ fontSize: '1.15rem', mb: '2.5rem', color: 'rgba(248,249,250,0.8)', lineHeight: 1.7, fontWeight: 300 }}>
                Urmărește progresul, participă la provocări și conectează-te cu mii de pasionați de sport din toată Moldova.
              </Typography>

              <Box sx={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {isAuthenticated
                    ? <Button component={Link} to={ROUTES.DASHBOARD} variant="contained" color="primary">Mergi la Dashboard</Button>
                    : <Button component={Link} to={ROUTES.REGISTER} variant="contained" color="primary">Creează Cont Gratuit</Button>
                }
                <Button variant="outlined" color="primary" onClick={() => scrollToSection('features')}>Descoperă Mai Mult</Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── STATS ────────────────────────────────────────── */}
        <Box component="section" sx={{ position: 'relative', zIndex: 2, px: '5%', pb: '4rem' }}>
          <Box sx={{
            maxWidth: 1200, mx: 'auto',
            display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' },
            gap: { xs: '0.75rem', md: '2rem' },
          }}>
            {STATS.map(s => (
                <Box key={s.label} sx={{
                  textAlign: 'center', p: { xs: '1.25rem', md: '2.5rem' },
                  background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease', minWidth: 0,
                  '&:hover': { transform: 'translateY(-5px)', background: 'rgba(255,255,255,0.05)', borderColor: t.primary },
                }}>
                  <Box sx={{
                    fontSize: { xs: '1.5rem', md: '3rem' }, fontWeight: 900,
                    background: t.gradientPrimary, WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap',
                  }}>{s.number}</Box>
                  <Box sx={{
                    fontSize: { xs: '0.65rem', md: '0.9rem' }, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: 'rgba(248,249,250,0.6)', mt: 0.5,
                  }}>{s.label}</Box>
                </Box>
            ))}
          </Box>
        </Box>

        {/* ── FEATURES ─────────────────────────────────────── */}
        <Box component="section" id="features" sx={{
          py: '8rem', px: '5%', position: 'relative', zIndex: 2,
          background: `linear-gradient(180deg, ${t.dark} 0%, #0f1328 100%)`,
        }}>
          <Box sx={{ textAlign: 'center', mb: '5rem' }}>
            <Typography variant="h2" sx={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 900, mb: '1rem', letterSpacing: '-0.02em' }}>
              Totul ce ai nevoie pentru succes
            </Typography>
            <Typography sx={{ fontSize: '1.2rem', color: 'rgba(248,249,250,0.6)', maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
              O platformă completă care te ajută să-ți atingi obiectivele de fitness
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(350px, 1fr))' }, gap: '2.5rem' }}>
            {FEATURES.map((f, i) => (
                <Box key={i} onClick={() => navigate(f.route)} role="button" tabIndex={0}
                     onKeyDown={e => { if (e.key === 'Enter') navigate(f.route); }}
                     sx={{
                       p: '3rem', background: 'rgba(255,255,255,0.02)',
                       border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                       transition: 'all 0.4s ease', position: 'relative', overflow: 'hidden', cursor: 'pointer',
                       '&::before': {
                         content: '""', position: 'absolute', top: 0, left: 0, width: '100%', height: 4,
                         background: t.gradientPrimary, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s ease',
                       },
                       '&:hover::before': { transform: 'scaleX(1)' },
                       '&:hover': {
                         transform: 'translateY(-10px)', background: 'rgba(255,255,255,0.05)',
                         borderColor: t.primary, boxShadow: '0 20px 60px rgba(0,102,255,0.2)',
                       },
                       '&:hover .feat-icon': { transform: 'scale(1.08)', boxShadow: '0 8px 24px rgba(0,102,255,0.3)' },
                       '&:hover .feat-title': { color: t.primaryLight },
                       '&:hover .feat-arrow': { opacity: 1, transform: 'translateX(0)', color: t.primary },
                       '&:focus-visible': { outline: `2px solid ${t.primary}`, outlineOffset: 2 },
                     }}>
                  <Box className="feat-icon" sx={{
                    width: 70, height: 70, background: t.gradientPrimary, borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', mb: '2rem',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}>{f.icon}</Box>
                  <Typography className="feat-title" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: '1rem', transition: 'color 0.3s ease' }}>{f.title}</Typography>
                  <Typography sx={{ color: 'rgba(248,249,250,0.7)', lineHeight: 1.7, fontWeight: 300 }}>{f.description}</Typography>
                  <Box className="feat-arrow" sx={{
                    position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.4)', opacity: 0, transform: 'translateX(-8px)', transition: 'all 0.3s ease',
                  }}>→</Box>
                </Box>
            ))}
          </Box>
        </Box>

        {/* ── FEEDBACK SECTION ─────────────────────────────── */}
        <Box component="section" sx={{
          py: '6rem', px: '5%', position: 'relative', zIndex: 2,
          background: 'linear-gradient(135deg, rgba(0,208,132,0.05) 0%, rgba(0,184,255,0.03) 100%)',
          borderTop: '1px solid rgba(0,208,132,0.1)', borderBottom: '1px solid rgba(0,208,132,0.1)',
        }}>
          <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '4rem', alignItems: 'center' }}>
            <Box>
              <Box sx={{
                display: 'inline-block', background: 'rgba(0,208,132,0.12)', border: '1px solid rgba(0,208,132,0.35)',
                color: '#00D084', px: '14px', py: '4px', borderRadius: '9999px', fontSize: '0.78rem',
                fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: '1rem',
              }}>Comunitate</Box>
              <Typography variant="h2" sx={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 900, letterSpacing: '-0.02em', mb: '1rem', lineHeight: 1.15 }}>
                Ce spun membrii noștri?
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, mb: '1.75rem' }}>
                Alătură-te celor 3.200+ utilizatori care și-au împărtășit experiența. Citește recenziile sau lasă propriul tău feedback.
              </Typography>
              <Button component={Link} to={ROUTES.FEEDBACK} variant="contained" color="primary">Vezi Recenziile</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {RATINGS.map((r, i) => (
                  <Box key={i} sx={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', p: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
                    transition: 'all 250ms ease-in-out',
                    '&:hover': { borderColor: 'rgba(0,208,132,0.3)', background: 'rgba(0,208,132,0.04)', transform: 'translateX(4px)' },
                  }}>
                    <Box sx={{
                      fontSize: '1.8rem', fontWeight: 900, minWidth: 64,
                      background: 'linear-gradient(135deg,#FFB800,#FF8C00)', WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>{r.score}</Box>
                    <Box sx={{ fontSize: '1rem', color: '#FFB800', letterSpacing: '0.05em' }}>{'★'.repeat(r.stars)}</Box>
                    <Box sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{r.label}</Box>
                  </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── CTA ──────────────────────────────────────────── */}
        {!isAuthenticated && (
            <Box component="section" sx={{ py: '8rem', px: '5%', textAlign: 'center', background: t.dark, position: 'relative', zIndex: 2 }}>
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h2" sx={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, mb: '1.5rem', letterSpacing: '-0.02em' }}>
                  Gata să începi călătoria ta?
                </Typography>
                <Typography sx={{ fontSize: '1.3rem', color: 'rgba(248,249,250,0.7)', mb: '3rem', fontWeight: 300 }}>
                  Alătură-te comunității FitMoldova astăzi și descoperă o nouă modalitate de a-ți atinge obiectivele de fitness alături de mii de alți pasionați.
                </Typography>
                <Button component={Link} to={ROUTES.REGISTER} variant="contained" color="primary" sx={{ fontSize: '1.1rem', px: '3rem', py: '1.2rem' }}>
                  Creează Cont Gratuit
                </Button>
              </Box>
            </Box>
        )}

        {/* ── FOOTER ───────────────────────────────────────── */}
        <Box component="footer" sx={{
          p: '4rem 5%', background: 'rgba(10,14,39,0.8)',
          borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 2,
        }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(250px, 1fr))' }, gap: '3rem', mb: '3rem' }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1.2rem', mb: '1.5rem', fontWeight: 700 }}>FitMoldova</Typography>
              <Typography sx={{ color: 'rgba(248,249,250,0.6)', lineHeight: 1.6 }}>
                Platforma ta completă pentru fitness, comunitate și progres. Transformă-ți obiectivele în realitate.
              </Typography>
            </Box>
            {[
              { title: 'Platformă', links: [
                  { label: 'Features', action: () => scrollToSection('features') },
                  { label: 'Tracking Activități', to: ROUTES.ACTIVITIES },
                  { label: 'Evenimente', to: ROUTES.EVENTS },
                  { label: 'Provocări', to: ROUTES.CHALLENGES },
                ]},
              { title: 'Comunitate', links: [
                  { label: 'Forum', to: ROUTES.FORUM },
                  { label: 'Cluburi', to: ROUTES.CLUBS },
                  { label: 'Rute', to: ROUTES.ROUTES_MAP },
                  { label: 'Galerie', to: ROUTES.GALLERY },
                ]},
              { title: 'Suport', links: [
                  { label: 'Feedback', to: ROUTES.FEEDBACK },
                  { label: 'Contact', to: ROUTES.CONTACT },
                ]},
            ].map(section => (
                <Box key={section.title}>
                  <Typography variant="h6" sx={{ fontSize: '1.2rem', mb: '1.5rem', fontWeight: 700 }}>{section.title}</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {section.links.map(link => (
                        <Box component="li" key={link.label} sx={{ mb: '0.8rem' }}>
                          {'to' in link ? (
                              <Box component={Link} to={link.to!} sx={{
                                color: 'rgba(248,249,250,0.6)', textDecoration: 'none', transition: 'color 0.3s ease',
                                '&:hover': { color: t.primary },
                              }}>{link.label}</Box>
                          ) : (
                              <Box component="button" type="button" onClick={link.action} sx={{
                                background: 'none', border: 'none', p: 0, cursor: 'pointer',
                                color: 'rgba(248,249,250,0.6)', fontFamily: t.fontBody, fontSize: 'inherit', textAlign: 'left',
                                transition: 'color 0.3s ease', '&:hover': { color: t.primary },
                              }}>{link.label}</Box>
                          )}
                        </Box>
                    ))}
                  </Box>
                </Box>
            ))}
          </Box>
          <Box sx={{ pt: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', color: 'rgba(248,249,250,0.5)' }}>
            <Typography>© 2026 FitMoldova. Toate drepturile rezervate.</Typography>
          </Box>
        </Box>
      </Box>
  );
};

export default Home;
