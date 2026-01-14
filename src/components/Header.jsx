import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <img src={logo} alt="Peiker Steuerberater" className="logo-img" />
        </div>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Leistungen</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>Kanzlei</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Kontakt</a>
          <a href="tel:+49123456789" className="contact-link">
            <Phone size={16} /> 0123 / 456 789
          </a>
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 1.5rem 0;
          background: transparent;
        }

        .header.scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          box-shadow: var(--shadow-sm);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }


        .logo {
          display: flex;
          align-items: center;
        }

        .logo-img {
            height: 100px;
            width: auto;
            object-fit: contain;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links a {
          font-weight: 500;
          color: var(--color-text-main);
          font-size: 0.95rem;
          position: relative;
        }
        
        .nav-links a:not(.contact-link)::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-accent);
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--color-bg-light);
          border-radius: var(--radius-md);
          color: var(--color-primary) !important;
          font-weight: 600 !important;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            flex-direction: column;
            padding: 2rem;
            box-shadow: var(--shadow-lg);
            clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
            transition: clip-path 0.4s ease-in-out;
          }

          .nav-links.open {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }

          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
