import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';
import '../../styles/Footer.css';

const Footer: React.FC = () => (
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
          <li><Link to={ROUTES.ROUTES_MAP} className="footer-link">Trasee</Link></li>
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
);

export default Footer;
