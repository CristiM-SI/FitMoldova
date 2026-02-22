import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="notfound-page">
      <div className="noise-bg" />
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />

      <Navbar />

      <main className="notfound-content">
        <div className="notfound-inner">
          <div className="notfound-code">404</div>
          <h1 className="notfound-title">Pagina nu a fost găsită</h1>
          <p className="notfound-description">
            Ne pare rău, pagina pe care o cauți nu există sau este în curs de dezvoltare.
            Între timp, poți explora celelalte secțiuni ale platformei.
          </p>

          <div className="notfound-actions">
            <Link to={ROUTES.HOME} className="notfound-btn notfound-btn-primary">
              &#8592; Pagina Principală
            </Link>
            <Link to={ROUTES.CONTACT} className="notfound-btn notfound-btn-outline">
              Contact
            </Link>
          </div>

          <div className="notfound-path">
            <code>{location.pathname}</code>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
