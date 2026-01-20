import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Link to="/">
                                <img src={logo} alt="Peiker Steuerberater" className="logo-img-footer" />
                            </Link>
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
                        <span>Hauptstraße 34</span>
                        <span>78628 Rottweil</span>
                        <a href="mailto:Kontakt@Peiker-Steuerberatung.de">Kontakt@Peiker-Steuerberatung.de</a>
                        <a href="tel:+4974120688800">0741 / 206 88 800</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Peiker Steuerberatung. Alle Rechte vorbehalten.</p>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--color-primary);
          background-image: radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15) 0%, transparent 70%);
          color: var(--color-text-light);
          padding: 5rem 0 2rem;
          border-top: 5px solid var(--color-accent);
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
            border-radius: var(--radius-lg);
            opacity: 1;
            margin-bottom: 1.5rem;
            margin-left: 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .footer-brand p {
            color: var(--color-text-muted);
            color: rgba(248, 250, 252, 0.7);
            line-height: 1.6;
            font-size: 1.05rem;
        }

        .footer-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .footer-links h4 {
            color: white;
            margin-bottom: 1.25rem;
            font-size: 1.15rem;
            font-weight: 700;
            letter-spacing: -0.01em;
        }

        .footer-links a, .footer-links span {
            color: rgba(248, 250, 252, 0.6);
            font-size: 0.95rem;
            transition: color var(--transition-fast);
            text-decoration: none;
        }

        .footer-links a:hover {
            color: var(--color-accent);
            transform: translateX(2px);
            display: inline-block;
        }

        .footer-bottom {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 2rem;
            text-align: center;
            color: rgba(255,255,255,0.4);
            font-size: 0.875rem;
        }

        @media (max-width: 968px) {
            .footer {
                padding-top: 3rem;
            }

            .footer-top {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
            
            .footer-brand {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .footer-links {
                text-align: center;
                align-items: center;
            }
        }
      `}</style>
        </footer>
    );
};

export default Footer;
