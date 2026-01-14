import React from 'react';
import { ArrowRight, CheckCircle, TrendingDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-bg"></div>
            <div className="container hero-container">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="badge"
                    >
                        <span className="badge-dot"></span>
                        Ihre Experten für Finanzen & Steuern
                    </motion.div>

                    <h1 className="hero-title">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            style={{ display: 'block' }}
                        >
                            Steuerberatung,
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-highlight"
                        >
                            die sich auszahlt.
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="hero-text"
                    >
                        Wir begleiten Privatpersonen und Unternehmen in Deutschland mit moderner, kompetenter und persönlicher Beratung in ihre finanzielle Zukunft.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="hero-actions"
                    >
                        <motion.a
                            href="#contact"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Termin vereinbaren <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </motion.a>
                        <motion.a
                            href="#services"
                            className="btn btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Unsere Leistungen
                        </motion.a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="hero-trust"
                    >
                        <div className="trust-item">
                            <CheckCircle size={16} color="var(--color-accent)" />
                            <span>Digital & Effizient</span>
                        </div>
                        <div className="trust-item">
                            <CheckCircle size={16} color="var(--color-accent)" />
                            <span>Persönliche Betreuung</span>
                        </div>
                    </motion.div>
                </div>

                <div className="hero-visual">
                    <div className="cycle-container">
                        <svg viewBox="0 0 500 500" className="digital-cycle">
                            <defs>
                                <radialGradient id="center-glow" cx="0.5" cy="0.5" r="0.5">
                                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* Center Glow Area */}
                            <circle cx="250" cy="250" r="180" fill="url(#center-glow)" />

                            {/* Outer Ring - Connection Points */}
                            <motion.g
                                style={{ transformOrigin: "250px 250px" }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            >
                                <circle cx="250" cy="250" r="200" stroke="var(--color-border)" strokeWidth="1" fill="none" strokeDasharray="4 4" opacity="0.6" />
                                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                    <circle key={i} cx={250 + 200 * Math.cos(deg * Math.PI / 180)} cy={250 + 200 * Math.sin(deg * Math.PI / 180)} r="5" fill={['var(--color-accent)', 'var(--color-indigo)', 'var(--color-secondary)', 'var(--color-emerald)', 'var(--color-gold)', 'var(--color-rose)'][i]} opacity="0.9" />
                                ))}
                            </motion.g>

                            {/* Middle Ring - The "Locking" Mechanism */}
                            <motion.g
                                style={{ transformOrigin: "250px 250px" }}
                                animate={{ rotate: [0, 120, 120, 240, 240, 360] }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                                }}
                            >
                                <circle cx="250" cy="250" r="160" stroke="var(--color-primary)" strokeWidth="2" fill="none" strokeDasharray="80 20" opacity="0.1" />
                                {/* Segments representing data blocks */}
                                <circle cx="250" cy="250" r="160" stroke="var(--color-indigo)" strokeWidth="3" fill="none" strokeDasharray="100 905" strokeLinecap="round" />
                                <circle cx="250" cy="250" r="160" stroke="var(--color-secondary)" strokeWidth="3" fill="none" strokeDasharray="60 945" strokeDashoffset="-200" strokeLinecap="round" />
                                <circle cx="250" cy="250" r="160" stroke="var(--color-rose)" strokeWidth="3" fill="none" strokeDasharray="40 965" strokeDashoffset="-500" strokeLinecap="round" />
                            </motion.g>

                            {/* Inner Ring - Rapid Data Flow */}
                            <motion.g
                                style={{ transformOrigin: "250px 250px" }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <circle cx="250" cy="250" r="120" stroke="var(--color-border)" strokeWidth="1" fill="none" />
                                <path d="M250,130 L250,140" stroke="var(--color-emerald)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M250,360 L250,370" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M130,250 L140,250" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M360,250 L370,250" stroke="var(--color-indigo)" strokeWidth="2" strokeLinecap="round" />
                            </motion.g>

                            {/* Center Icon - Dynamic Pulse */}
                            <motion.g
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <circle cx="250" cy="250" r="80" fill="white" stroke="var(--color-border)" strokeWidth="1" className="center-circle" />
                                <motion.circle
                                    cx="250" cy="250" r="75"
                                    stroke="var(--color-accent)" strokeWidth="1" fill="none" opacity="0.2"
                                    animate={{ r: [75, 85, 75], opacity: [0.2, 0, 0.2] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                {/* Shield/Check Icon */}
                                <path d="M230 250 L245 265 L275 235" stroke="var(--color-primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.g>
                        </svg>

                        {/* Floating Cards */}
                        <motion.div
                            className="card-float card-optimize"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1, y: [-5, 5, -5] }}
                            transition={{
                                x: { delay: 0.5, duration: 0.5 },
                                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            <div className="card-icon icon-optimize" style={{ color: 'var(--color-emerald)', background: '#ECFDF5' }}>
                                <TrendingDown size={20} />
                            </div>
                            <div className="card-content">
                                <div className="card-label">Steuerlast</div>
                                <div className="card-value">Optimiert</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="card-float card-secure"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1, y: [5, -5, 5] }}
                            transition={{
                                x: { delay: 0.8, duration: 0.5 },
                                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                            }}
                        >
                            <div className="card-icon icon-secure" style={{ color: 'var(--color-indigo)', background: '#EEF2FF' }}>
                                <Clock size={20} />
                            </div>
                            <div className="card-content">
                                <div className="card-label">Zeitaufwand</div>
                                <div className="card-value">Minimal</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style>{`
        .hero {
          position: relative;
          padding: 8rem 0 6rem;
          overflow: hidden;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #F8FAFC;
          background-image: radial-gradient(#CCD5E0 1px, transparent 1px), linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%);
          background-size: 24px 24px, 100% 100%;
          background-position: 0 0, 0 0;
          z-index: -1;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative; 
          z-index: 1; 
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-primary);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent);
          border-radius: 50%;
        }

        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .text-highlight {
          color: var(--color-accent);
          position: relative;
          display: inline-block;
        }
        
        .text-highlight::after {
           content: '';
           position: absolute;
           bottom: 5px;
           left: 0;
           width: 100%;
           height: 8px;
           background: var(--color-accent);
           opacity: 0.2;
           z-index: -1;
           border-radius: 4px;
        }

        .hero-text {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          max-width: 540px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .hero-trust {
          display: flex;
          gap: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--color-primary);
          font-size: 0.9rem;
        }

        /* --- Digital Cycle Visual Styles --- */
        .hero-visual {
            position: relative;
            height: 500px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .cycle-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .digital-cycle {
            width: 100%;
            max-width: 500px;
            height: auto;
            overflow: visible;
        }
        
        .center-circle {
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.05));
        }

        .card-float {
            position: absolute;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            padding: 0.75rem 1rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            border: 1px solid rgba(255,255,255,0.5);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 2;
        }

        .card-optimize {
            top: 20%;
            left: 0%;
        }

        .card-secure {
            bottom: 20%;
            right: 0%;
        }

        .card-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .icon-optimize {
            background: #F0FDFA; /* Teal tint */
            color: var(--color-secondary);
        }
        
        .icon-secure {
            background: #ECFDF5;
            color: #059669;
        }

        .card-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .card-value {
            font-weight: 700;
            color: var(--color-primary);
            font-size: 0.95rem;
        }

        @media (max-width: 968px) {
            .hero-container {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .hero-content {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-text {
                margin-left: auto;
                margin-right: auto;
            }

            .hero-actions {
                justify-content: center;
            }

            .hero-trust {
                justify-content: center;
            }

            .hero-visual {
                display: none; 
            }
            
            .hero {
                padding-top: 6rem;
            }
        }
      `}</style>
        </section>
    );
};

export default Hero;
