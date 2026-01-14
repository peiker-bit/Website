import React from 'react';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src={logo} alt="Peiker Steuerberater" className="logo-img-footer" />
                        </div>
                        <p>
                            Moderne Steuerberatung für eine<br />erfolgreiche Zukunft.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Rechtliches</h4>
                        <a href="#">Impressum</a>
                        <a href="#">Datenschutz</a>
                        <a href="#">AGB</a>
                    </div>

                    <div className="footer-links">
                        <h4>Leistungen</h4>
                        <a href="#">Einkommensteuer</a>
                        <a href="#">Jahresabschluss</a>
                        <a href="#">Buchführung</a>
                        <a href="#">Beratung</a>
                    </div>

                    <div className="footer-links">
                        <h4>Kontakt</h4>
                        <span>Musterstraße 123</span>
                        <span>12345 Musterstadt</span>
                        <a href="mailto:info@peiker-steuerberatung.de">info@peiker-steuerberatung.de</a>
                        <a href="tel:+49123456789">0123 / 456 789</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Peiker Steuerberatung. Alle Rechte vorbehalten.</p>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--color-primary);
          background-image: radial-gradient(circle at 50% 0%, rgba(13, 148, 136, 0.15) 0%, transparent 70%);
          color: var(--color-text-light);
          padding: 5rem 0 2rem;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .logo-img-footer {
            height: 90px;
            width: auto;
            object-fit: contain;
            background: white;
            padding: 10px 15px;
            border-radius: 8px;
            opacity: 1;
            margin-bottom: 1rem;
            margin-left: 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .footer-brand p {
            color: rgba(255,255,255,0.6);
            line-height: 1.6;
        }

        .footer-links {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .footer-links h4 {
            color: white;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }

        .footer-links a, .footer-links span {
            color: rgba(255,255,255,0.6);
            font-size: 0.95rem;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: var(--color-accent);
        }

        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 2rem;
            text-align: center;
            color: rgba(255,255,255,0.4);
            font-size: 0.875rem;
        }

        @media (max-width: 968px) {
            .footer-top {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
