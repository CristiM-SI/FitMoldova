import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import '../styles/Contact.css';

interface ContactInfo {
  icon: string;
  title: string;
  details: string;
  sub: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: '📍',
    title: 'Adresă',
    details: 'Str. Ștefan cel Mare 1',
    sub: 'Chișinău, Moldova',
  },
  {
    icon: '📧',
    title: 'Email',
    details: 'contact@fitmoldova.md',
    sub: 'Răspundem în 24 de ore',
  },
  {
    icon: '📞',
    title: 'Telefon',
    details: '+373 22 123 456',
    sub: 'Luni–Vineri, 9:00–18:00',
  },
  {
    icon: '💬',
    title: 'Chat Live',
    details: 'Disponibil în aplicație',
    sub: 'Timp de răspuns ~5 min',
  },
];

const FAQS: FAQ[] = [
  {
    question: 'Cum îmi pot reseta parola?',
    answer:
      'Accesează pagina de Login și apasă „Am uitat parola". Vei primi un email cu instrucțiuni în câteva minute.',
  },
  {
    question: 'Cum pot raporta o problemă tehnică?',
    answer:
      'Folosește formularul de contact de pe această pagină sau trimite un email la contact@fitmoldova.md cu descrierea problemei și, dacă este posibil, un screenshot.',
  },
  {
    question: 'Pot solicita o demonstrație pentru organizația mea?',
    answer:
      'Desigur! Completează formularul de contact selectând subiectul „Parteneriat / B2B" și echipa noastră te va contacta în cel mult 48 de ore.',
  },
  {
    question: 'Unde pot urmări stadiul unui tichet de suport?',
    answer:
      'După trimiterea formularului vei primi un email de confirmare cu numărul tichetului. Poți urmări statusul direct în acel email sau în secțiunea Feedback din cont.',
  },
];

const Contact: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = 'Numele este obligatoriu.';
    if (!form.email.trim()) {
      newErrors.email = 'Emailul este obligatoriu.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Emailul nu este valid.';
    }
    if (!form.subject.trim()) newErrors.subject = 'Subiectul este obligatoriu.';
    if (!form.message.trim()) {
      newErrors.message = 'Mesajul este obligatoriu.';
    } else if (form.message.trim().length < 20) {
      newErrors.message = 'Mesajul trebuie să aibă cel puțin 20 de caractere.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    // Simulated submit — replace with real API call
    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="noise-bg" />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <div className="contact-hero-badge">Suport & Contact</div>
          <h1>
            Suntem aici <span className="highlight">pentru tine</span>
          </h1>
          <p>
            Ai o întrebare, o sugestie sau ai nevoie de ajutor? Scrie-ne —
            echipa FitMoldova îți va răspunde cât mai repede posibil.
          </p>
        </div>
      </section>

      {/* ── INFO CARDS ───────────────────────────────────── */}
      <section className="contact-info-section">
        <div className="contact-info-grid">
          {CONTACT_INFO.map((item, idx) => (
            <div key={idx} className="contact-info-card">
              <div className="contact-info-icon">{item.icon}</div>
              <h3 className="contact-info-title">{item.title}</h3>
              <p className="contact-info-details">{item.details}</p>
              <p className="contact-info-sub">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + MAP PLACEHOLDER ───────────────────────── */}
      <section className="contact-main-section">
        <div className="contact-main-inner">

          {/* Form */}
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Trimite un mesaj</h2>
            <p className="contact-form-subtitle">
              Completează formularul de mai jos și te vom contacta în cel mai
              scurt timp.
            </p>

            {status === 'success' && (
              <div className="contact-success-msg">
                ✅ Mesajul tău a fost trimis cu succes! Te vom contacta în
                curând.
              </div>
            )}

            {status === 'error' && (
              <div className="contact-error-msg">
                ❌ A apărut o eroare. Te rugăm să încerci din nou.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Nume complet *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ion Ionescu"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && (
                    <span className="field-error">{errors.name}</span>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ion@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">Subiect *</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'input-error' : ''}
                >
                  <option value="">Selectează un subiect</option>
                  <option value="suport-tehnic">Suport tehnic</option>
                  <option value="cont-abonament">Cont / Abonament</option>
                  <option value="parteneriat">Parteneriat / B2B</option>
                  <option value="feedback">Feedback & Sugestii</option>
                  <option value="altele">Altele</option>
                </select>
                {errors.subject && (
                  <span className="field-error">{errors.subject}</span>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="message">Mesaj *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Descrie problema sau întrebarea ta..."
                  value={form.message}
                  onChange={handleChange}
                  className={errors.message ? 'input-error' : ''}
                />
                {errors.message && (
                  <span className="field-error">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary contact-submit-btn">
                Trimite Mesajul
              </button>
            </form>
          </div>

          {/* Map / social sidebar */}
          <div className="contact-sidebar">
            <div className="contact-map-embed">
              <iframe
                title="FitMoldova Location"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1200.3019609866276!2d28.844215832910013!3d47.01626473852786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1771784359709!5m2!1sen!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="contact-map-label">
                <span>📍</span> Str. Ștefan cel Mare 1, Chișinău
              </div>
            </div>

            <div className="contact-social">
              <h3>Urmărește-ne</h3>
              <div className="social-links">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <span className="social-icon">📘</span> Facebook
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <span className="social-icon">📸</span> Instagram
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <span className="social-icon">✈️</span> Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="contact-faq-section">
        <div className="section-header">
          <h2 className="section-title">Întrebări frecvente</h2>
          <p className="section-subtitle">
            Răspunsuri rapide la cele mai comune întrebări
          </p>
        </div>

        <div className="contact-faq-grid">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openFaq === idx ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                {faq.question}
                <span className="faq-icon">{openFaq === idx ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEEDBACK PROMO ───────────────────────────────── */}
      <section className="contact-feedback-promo">
        <div className="contact-feedback-promo-inner">
          <div className="contact-feedback-promo-icon">⭐</div>
          <div className="contact-feedback-promo-text">
            <h3>Ești deja membru? Lasă un feedback!</h3>
            <p>
              Spune-ne ce funcționează bine și ce am putea îmbunătăți.
              Opinia ta ajută comunitatea să crească.
            </p>
          </div>
          <Link to={ROUTES.FEEDBACK} className="btn btn-primary contact-feedback-promo-btn">
            Lasă Feedback
          </Link>
        </div>
      </section>

      {/* ── CTA FOOTER STRIP ─────────────────────────────── */}
      <section className="contact-cta-section">
        <div className="contact-cta-content">
          <h2>Nu ești încă membru?</h2>
          <p>
            Alătură-te comunității FitMoldova și descoperă o nouă modalitate
            de a-ți atinge obiectivele de fitness.
          </p>
          <Link to={ROUTES.REGISTER} className="btn btn-primary">
            Creează Cont Gratuit
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

export default Contact;
