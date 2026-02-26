import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { scrollToSection } from '../utils/navigation';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#features') {
      setTimeout(() => scrollToSection('features'), 100);
    }
  }, [location.hash]);

  const features: Feature[] = [
    {
      icon: '📊',
      title: 'Dashboard Personal',
      description: 'Vizualizează statistici detaliate, urmărește progresul tău și editează informațiile profilului într-un singur loc centralizat și intuitiv.'
    },
    {
      icon: '🏃',
      title: 'Tracking Activități',
      description: 'Înregistrează sesiunile de alergare, ciclism sau sală cu introducere manuală sau timer live. Monitorizează distanța, durata și caloriile.'
    },
    {
      icon: '🏆',
      title: 'Provocări & Competiții',
      description: 'Participă la challenges motivante, urmărește progresul în timp real și trimite dovezi pentru verificare. Câștigă premii și recunoaștere.'
    },
    {
      icon: '📅',
      title: 'Evenimente Sportive',
      description: 'Creează și gestionează evenimente, caută și filtrează după preferințe, înscrie-te la competiții și conectează-te cu alți participanți.'
    },
    {
      icon: '🗺️',
      title: 'Rute Interactive',
      description: 'Explorează hărți interactive cu rute recomandate de ciclism și alergare. Adaugă propriile tale rute și descoperă noi trasee.'
    },
    {
      icon: '💬',
      title: 'Forum & Comunitate',
      description: 'Participă la discuții pe categorii (general, ciclism, alergare, sală), pune întrebări, împărtășește sfaturi și conectează-te cu comunitatea.'
    },
    {
      icon: '📱',
      title: 'Mesagerie Privată',
      description: 'Comunicare directă între utilizatori prin mesaje private sau grupuri de discuție pentru planificarea antrenamentelor și evenimente.'
    },
    {
      icon: '📸',
      title: 'Galerii Multimedia',
      description: 'Încarcă și partajează fotografii de la antrenamente, evenimente și competiții. Creează amintiri alături de comunitate.'
    },
    {
      icon: '👥',
      title: 'Cluburi Locale',
      description: 'Creează sau alătură-te cluburilor și comunităților locale sau tematice. Organizează întâlniri și evenimente de grup.'
    },
    {
      icon: '⭐',
      title: 'Feedback & Recenzii',
      description: 'Împărtășește experiența ta, evaluează platforma și citește recenziile comunității. Opinia ta ne ajută să creștem.'
    }
  ];

  return (
    <div className="home-page">
      <div className="noise-bg"></div>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>

      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>
            Transformă-ți <span className="highlight">Fitness-ul</span> într-o Comunitate
          </h1>
          <p>
            Alătură-te celei mai vibrantă platforme de fitness din Moldova.
            Urmărește progresul, participă la provocări și conectează-te cu pasionați de sport.
          </p>
          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD} className="btn btn-primary">Mergi la Dashboard</Link>
            ) : (
              <Link to={ROUTES.REGISTER} className="btn btn-primary">Creează Cont Gratuit</Link>
            )}
            <button onClick={() => scrollToSection("features")} className="btn btn-outline">Descoperă Mai Mult</button>
          </div>

          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Utilizatori Activi</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2.5M+</div>
              <div className="stat-label">Km Parcurși</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1.2K+</div>
              <div className="stat-label">Evenimente</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">300+</div>
              <div className="stat-label">Cluburi Locale</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="section-header">
          <h2 className="section-title">Totul ce ai nevoie pentru succes</h2>
          <p className="section-subtitle">
            O platformă completă care te ajută să-ți atingi obiectivele de fitness
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-feedback-section">
        <div className="home-feedback-inner">
          <div className="home-feedback-left">
            <div className="home-feedback-badge">Comunitate</div>
            <h2>Ce spun membrii noștri?</h2>
            <p>
              Alătură-te celor 3.200+ utilizatori care și-au împărtășit
              experiența. Citește recenziile sau lasă propriul tău feedback.
            </p>
            <Link to={ROUTES.FEEDBACK} className="btn btn-primary">
              Vezi Recenziile
            </Link>
          </div>
          <div className="home-feedback-ratings">
            {[
              { score: '4.7', label: 'Rating general', stars: 5 },
              { score: '94%', label: 'Utilizatori mulțumiți', stars: 5 },
              { score: '3.2K+', label: 'Recenzii scrise', stars: 4 },
            ].map((item, i) => (
              <div key={i} className="home-feedback-rating-card">
                <div className="home-feedback-score">{item.score}</div>
                <div className="home-feedback-stars">
                  {'★'.repeat(item.stars)}
                </div>
                <div className="home-feedback-rating-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Gata să începi călătoria ta?</h2>
            <p className="cta-description">
              Alătură-te comunității FitMoldova astăzi și descoperă o nouă modalitate
              de a-ți atinge obiectivele de fitness alături de mii de alți pasionați.
            </p>
            <Link to={ROUTES.REGISTER} className="btn btn-primary cta-btn">
              Creează Cont Gratuit
            </Link>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FitMoldova</h3>
            <p>
              Platforma ta completă pentru fitness, comunitate și progres.
              Transformă-ți obiectivele în realitate.
            </p>
          </div>
          <div className="footer-section">
            <h3>Platformă</h3>
            <ul>
              <li><button onClick={() => scrollToSection("features")} className="footer-link">Features</button></li>
              <li><Link to={ROUTES.ACTIVITIES} className="footer-link">Tracking Activități</Link></li>
              <li><Link to={ROUTES.EVENTS} className="footer-link">Evenimente</Link></li>
              <li><Link to={ROUTES.CHALLENGES} className="footer-link">Provocări</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Comunitate</h3>
            <ul>
              <li><Link to={ROUTES.FORUM} className="footer-link">Forum</Link></li>
              <li><Link to={ROUTES.CLUBS} className="footer-link">Cluburi</Link></li>
              <li><Link to={ROUTES.ROUTES_MAP} className="footer-link">Rute</Link></li>
              <li><Link to={ROUTES.GALLERY} className="footer-link">Galerie</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Suport</h3>
            <ul>
              <li><Link to={ROUTES.FEEDBACK} className="footer-link">Feedback</Link></li>
              <li><Link to={ROUTES.CONTACT} className="footer-link">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FitMoldova. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
