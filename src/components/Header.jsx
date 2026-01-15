import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { label: 'Startseite', path: '/' },
    { label: 'Leistungen', path: '/leistungen' }, // New page planned
    { label: 'Privatpersonen', path: '/privatpersonen' },
    { label: 'Unternehmen', path: '/unternehmen' }, // New page planned
    { label: 'Lohn', path: '/lohn' },
    { label: 'Digital', path: '/digitale-zusammenarbeit' }, // Shortened for mobile fit? Or full name: 'Digitale Zusammenarbeit'
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Peiker Steuerberater" className="logo-img" />
        </Link>

        {/* Desktop Nav */}
        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}

          <Link to="/kontakt" className="nav-item" onClick={closeMenu}>Kontakt</Link>

          <a href="tel:+49123456789" className="contact-btn">
            <Phone size={16} />
            <span>Kontakt aufnehmen</span>
          </a>
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
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
          transition: all var(--transition-normal);
          padding: 1.25rem 0;
          background: transparent;
        }

        .header.scrolled {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.75rem 0;
          box-shadow: var(--shadow-sm);
          border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          z-index: 1001;
        }

        .logo-img {
          height: 100px;
          width: auto;
          transition: height var(--transition-normal);
        }
        
        .header.scrolled .logo-img {
          height: 70px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-item {
          font-weight: 500;
          color: var(--color-primary);
          font-size: 0.95rem;
          position: relative;
          padding: 0.5rem 0;
          transition: color var(--transition-fast);
        }
        
        .nav-item:hover, .nav-item.active {
          color: var(--color-accent);
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-accent);
          transition: width var(--transition-normal);
          border-radius: var(--radius-full);
        }

        .nav-item:hover::after, .nav-item.active::after {
          width: 100%;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--gradient-accent);
          border-radius: var(--radius-full);
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-normal);
        }
        
        .contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          color: white;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-primary);
          cursor: pointer;
          z-index: 1001;
        }

        @media (max-width: 1024px) {
          .nav-links {
            gap: 1.5rem;
          }
          .nav-item {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 900px) {
          .mobile-menu-btn { display: block; }

          .nav-links {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 100%; /* Full width for mobile immersion */
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            gap: 2rem;
          }

          .nav-links.open {
            transform: translateX(0);
          }

          .nav-item {
            font-size: 1.25rem;
            font-weight: 600;
          }
          
          .logo-img {
             height: 60px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
