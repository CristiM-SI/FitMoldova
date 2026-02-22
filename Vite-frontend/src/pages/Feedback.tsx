import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import '../styles/Feedback.css';

interface Review {
  name: string;
  initials: string;
  date: string;
  stars: number;
  category: string;
  text: string;
}

const STAR_LABELS: Record<number, string> = {
  1: 'Foarte nemulțumit',
  2: 'Nemulțumit',
  3: 'Neutru',
  4: 'Mulțumit',
  5: 'Foarte mulțumit',
};

const CATEGORIES = [
  'Interfață (UX)',
  'Performanță',
  'Funcționalități',
  'Comunitate',
  'Suport',
  'Altele',
];

const RATING_BREAKDOWN: { label: string; pct: number }[] = [
  { label: '5 ★', pct: 62 },
  { label: '4 ★', pct: 22 },
  { label: '3 ★', pct: 9 },
  { label: '2 ★', pct: 4 },
  { label: '1 ★', pct: 3 },
];

const RECENT_REVIEWS: Review[] = [
  {
    name: 'Alexandru Moraru',
    initials: 'AM',
    date: '18 feb 2026',
    stars: 5,
    category: 'Funcționalități',
    text: 'Platforma este extraordinară! Tracking-ul de activități funcționează perfect și îmi place că pot vedea progresul în timp real. Recomand tuturor pasionaților de sport.',
  },
  {
    name: 'Maria Popescu',
    initials: 'MP',
    date: '14 feb 2026',
    stars: 5,
    category: 'Comunitate',
    text: 'Comunitatea de pe FitMoldova este incredibil de prietenoasă. Am găsit parteneri de alergare și am participat la primul meu eveniment sportiv. Mulțumesc!',
  },
  {
    name: 'Ion Cebanu',
    initials: 'IC',
    date: '10 feb 2026',
    stars: 4,
    category: 'Interfață (UX)',
    text: 'Design modern și intuitiv. M-ar bucura câteva îmbunătățiri la filtrarea provocărilor, dar în rest totul este bine pus la punct.',
  },
  {
    name: 'Elena Rusu',
    initials: 'ER',
    date: '5 feb 2026',
    stars: 5,
    category: 'Performanță',
    text: 'Aplicația se încarcă rapid și nu am întâmpinat niciun bug. Echipa de suport a răspuns în mai puțin de o oră la întrebarea mea. Impresionant!',
  },
  {
    name: 'Andrei Lungu',
    initials: 'AL',
    date: '1 feb 2026',
    stars: 4,
    category: 'Funcționalități',
    text: 'Provocările sunt motivante și bine organizate. Aș vrea mai multe tipuri de activități disponibile, dar per total sunt foarte mulțumit de platformă.',
  },
  {
    name: 'Cristina Bălan',
    initials: 'CB',
    date: '28 ian 2026',
    stars: 5,
    category: 'Suport',
    text: 'Am avut o problemă cu contul și echipa de suport a rezolvat totul în câteva ore. Servicii excelente și oameni dedicați. FitMoldova merită fiecare stea!',
  },
];

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form & { rating: string }>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const validate = (): boolean => {
    const newErrors: Partial<typeof form & { rating: string }> = {};
    if (rating === 0) newErrors.rating = 'Te rugăm să selectezi o notă.';
    if (!form.title.trim()) newErrors.title = 'Titlul este obligatoriu.';
    if (!form.message.trim()) {
      newErrors.message = 'Mesajul este obligatoriu.';
    } else if (form.message.trim().length < 20) {
      newErrors.message = 'Mesajul trebuie să aibă cel puțin 20 de caractere.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof form]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('success');
    setForm({ title: '', message: '' });
    setRating(0);
    setSelectedCategories([]);
  };

  const displayRating = hovered || rating;

  return (
    <div className="feedback-page">
      <div className="noise-bg" />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="feedback-hero">
        <div className="feedback-hero-content">
          <div className="feedback-hero-badge">Feedback & Recenzii</div>
          <h1>
            Opinia ta <span className="highlight">contează</span>
          </h1>
          <p>
            Ajută-ne să îmbunătățim FitMoldova. Împărtășește experiența ta,
            sugestiile și ideile — fiecare feedback ne face mai buni.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <div className="feedback-stats-bar">
        <div className="feedback-stat">
          <div className="feedback-stat-number">4.7</div>
          <div className="feedback-stat-label">Rating Mediu</div>
        </div>
        <div className="feedback-stat">
          <div className="feedback-stat-number">3.2K+</div>
          <div className="feedback-stat-label">Recenzii</div>
        </div>
        <div className="feedback-stat">
          <div className="feedback-stat-number">94%</div>
          <div className="feedback-stat-label">Utilizatori Mulțumiți</div>
        </div>
        <div className="feedback-stat">
          <div className="feedback-stat-number">&lt;2h</div>
          <div className="feedback-stat-label">Timp Răspuns Suport</div>
        </div>
      </div>

      {/* ── FORM + SIDEBAR ───────────────────────────────── */}
      <section className="feedback-main-section">
        <div className="feedback-main-inner">

          {/* Form */}
          <div className="feedback-form-wrapper">
            <h2 className="feedback-form-title">Lasă un feedback</h2>
            <p className="feedback-form-subtitle">
              Spune-ne ce funcționează bine și ce am putea îmbunătăți.
              Fiecare sugestie este citită de echipa noastră.
            </p>

            {status === 'success' && (
              <div className="feedback-success-msg">
                ✅ Mulțumim pentru feedback! Îl vom analiza cu atenție.
              </div>
            )}
            {status === 'error' && (
              <div className="feedback-error-msg">
                ❌ A apărut o eroare. Te rugăm să încerci din nou.
              </div>
            )}

            <form className="feedback-form" onSubmit={handleSubmit} noValidate>

              {/* Star rating */}
              <div className="feedback-rating-section">
                <span className="feedback-rating-label">
                  Notă generală *
                </span>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${displayRating >= star ? 'active' : ''}`}
                      onClick={() => {
                        setRating(star);
                        setErrors((prev) => ({ ...prev, rating: undefined }));
                      }}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      aria-label={`${star} stele`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="star-rating-text">
                  {displayRating > 0 ? STAR_LABELS[displayRating] : ''}
                </div>
                {errors.rating && (
                  <span className="field-error">{errors.rating}</span>
                )}
              </div>

              {/* Category chips */}
              <div className="feedback-category-section">
                <span className="feedback-category-label">
                  Categorie (opțional)
                </span>
                <div className="feedback-chips">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`chip ${selectedCategories.includes(cat) ? 'chip--selected' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="feedback-field">
                <label htmlFor="fb-title">Titlu *</label>
                <input
                  id="fb-title"
                  name="title"
                  type="text"
                  placeholder="Rezumă experiența ta în câteva cuvinte"
                  value={form.title}
                  onChange={handleChange}
                  className={errors.title ? 'input-error' : ''}
                />
                {errors.title && (
                  <span className="field-error">{errors.title}</span>
                )}
              </div>

              {/* Message */}
              <div className="feedback-field">
                <label htmlFor="fb-message">Mesaj *</label>
                <textarea
                  id="fb-message"
                  name="message"
                  rows={6}
                  placeholder="Descrie în detaliu experiența ta, ce ți-a plăcut sau ce am putea îmbunătăți..."
                  value={form.message}
                  onChange={handleChange}
                  className={errors.message ? 'input-error' : ''}
                />
                {errors.message && (
                  <span className="field-error">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary feedback-submit-btn"
              >
                Trimite Feedback
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="feedback-sidebar">

            {/* Overall rating card */}
            <div className="feedback-overall-card">
              <h3>Rating General</h3>
              <div className="feedback-big-rating">4.7</div>
              <div className="feedback-big-stars">★★★★★</div>
              <div className="feedback-review-count">bazat pe 3.247 recenzii</div>

              <div className="feedback-breakdown">
                {RATING_BREAKDOWN.map((row) => (
                  <div key={row.label} className="breakdown-row">
                    <span className="breakdown-label">{row.label}</span>
                    <div className="breakdown-bar-bg">
                      <div
                        className="breakdown-bar-fill"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="breakdown-pct">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip card */}
            <div className="feedback-tip-card">
              <h3>Sfat util</h3>
              <p>
                Feedback-ul detaliat ne ajută cel mai mult. Menționează ce
                funcționalitate ai folosit, ce ai așteptat să se întâmple și
                ce s-a întâmplat de fapt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT REVIEWS ───────────────────────────────── */}
      <section className="feedback-reviews-section">
        <div className="section-header">
          <h2 className="section-title">Ce spun utilizatorii noștri</h2>
          <p className="section-subtitle">
            Recenzii recente din comunitatea FitMoldova
          </p>
        </div>

        <div className="feedback-reviews-grid">
          {RECENT_REVIEWS.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{review.initials}</div>
                <div className="review-meta">
                  <div className="review-name">{review.name}</div>
                  <div className="review-date">{review.date}</div>
                </div>
                <div className="review-stars">
                  {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                </div>
              </div>
              <div className="review-category-chip">{review.category}</div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────── */}
      <section className="feedback-cta-section">
        <div className="feedback-cta-content">
          <h2>Ai o problemă sau o sugestie urgentă?</h2>
          <p>
            Folosește pagina de Contact pentru a ne trimite un mesaj direct
            și echipa noastră te va contacta cât mai curând.
          </p>
          <Link to={ROUTES.CONTACT} className="btn btn-primary">
            Contactează-ne
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
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
              <li><Link to={ROUTES.COMMUNITY} className="footer-link">Comunitate</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Suport</h3>
            <ul>
              <li><Link to={ROUTES.CONTACT} className="footer-link">Contact</Link></li>
              <li><Link to={ROUTES.FEEDBACK} className="footer-link">Feedback</Link></li>
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

export default Feedback;
