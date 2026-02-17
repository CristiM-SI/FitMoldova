import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import '../styles/Pricing.css';

interface PricingPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: 1,
    name: 'Gratuit',
    description: 'Perfect pentru a începe călătoria ta fitness',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Tracking activități de bază',
      'Acces la comunitate',
      'Statistici săptămânale',
      'Până la 3 cluburi',
      'Profil personalizat',
    ],
  },
  {
    id: 2,
    name: 'Pro',
    description: 'Pentru sportivi dedicați care vor mai mult',
    monthlyPrice: 49,
    yearlyPrice: 469,
    isPopular: true,
    features: [
      'Totul din planul Gratuit',
      'Tracking avansat cu GPS',
      'Planuri de antrenament personalizate',
      'Cluburi nelimitate',
      'Statistici detaliate și grafice',
      'Provocări exclusive',
      'Suport prioritar',
    ],
  },
  {
    id: 3,
    name: 'Echipă',
    description: 'Ideal pentru cluburi și organizații sportive',
    monthlyPrice: 149,
    yearlyPrice: 1429,
    features: [
      'Totul din planul Pro',
      'Până la 50 membri',
      'Panou de administrare echipă',
      'Statistici de grup',
      'Organizare evenimente private',
      'Branding personalizat',
      'Manager de cont dedicat',
      'API access',
    ],
  },
];

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: 'Pot schimba planul în orice moment?',
    answer: 'Da, poți face upgrade sau downgrade oricând. Dacă faci upgrade, diferența de preț va fi calculată proporțional. La downgrade, noul preț se aplică de la următoarea facturare.',
  },
  {
    question: 'Există o perioadă de probă gratuită?',
    answer: 'Da! Planul Pro vine cu 14 zile de probă gratuită. Nu este nevoie de card de credit pentru a începe perioada de probă.',
  },
  {
    question: 'Ce metode de plată acceptați?',
    answer: 'Acceptăm carduri Visa, Mastercard, și transfer bancar. Pentru planul Echipă, oferim și opțiunea de facturare.',
  },
  {
    question: 'Pot anula abonamentul oricând?',
    answer: 'Absolut. Poți anula abonamentul în orice moment din setările contului. Vei avea acces la funcționalitățile plătite până la sfârșitul perioadei de facturare curente.',
  },
];

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) return 0;
    return isAnnual ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
  };

  return (
    <div className="pricing-page">
      <div className="noise-bg" />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />

      <Navbar />

      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <h1>
            Alege planul <span className="highlight">potrivit</span> pentru tine
          </h1>
          <p>
            Indiferent dacă ești la început sau un sportiv experimentat, avem un plan care se potrivește nevoilor tale.
          </p>

          <div className="pricing-toggle">
            <span className={!isAnnual ? 'active' : ''}>Lunar</span>
            <div
              className={`toggle-switch ${isAnnual ? 'annual' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <div className="toggle-knob" />
            </div>
            <span className={isAnnual ? 'active' : ''}>Anual</span>
            {isAnnual && <span className="save-badge">-20%</span>}
          </div>
        </div>
      </section>

      <section className="pricing-cards">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && <div className="popular-badge">Cel mai popular</div>}

            <div className="pricing-card-header">
              <h3 className="pricing-card-name">{plan.name}</h3>
              <p className="pricing-card-desc">{plan.description}</p>
            </div>

            <div className="pricing-card-price">
              {plan.monthlyPrice === 0 ? (
                <span className="price-free">Gratuit</span>
              ) : (
                <>
                  <span className="price-currency">MDL</span>
                  <span className="price-amount">{getPrice(plan)}</span>
                  <span className="price-period">/lună</span>
                </>
              )}
            </div>

            <ul className="pricing-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="feature-check">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to={ROUTES.REGISTER}
              className={`pricing-cta ${plan.isPopular ? 'pricing-cta-primary' : 'pricing-cta-outline'}`}
            >
              {plan.monthlyPrice === 0 ? 'Începe Gratuit' : 'Începe Acum'}
            </Link>
          </div>
        ))}
      </section>

      <section className="pricing-faq">
        <div className="section-header">
          <h2 className="section-title">Întrebări frecvente</h2>
          <p className="section-subtitle">Tot ce trebuie să știi despre planurile noastre</p>
        </div>

        <div className="faq-grid">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openFaq === idx ? 'open' : ''}`}
            >
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                {faq.question}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
