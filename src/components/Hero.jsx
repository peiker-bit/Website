import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
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
                    <motion.div
                        animate={{
                            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                            rotate: [0, 180, 360],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="abstract-shape"
                    ></motion.div>

                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="card-float card-1"
                        >
                            <div className="card-icon">€</div>
                            <div className="card-content">
                                <div className="card-label">Steuervorteil</div>
                                <div className="card-value">+12.5%</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                    >
                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="card-float card-2"
                        >
                            <div className="card-icon">✓</div>
                            <div className="card-content">
                                <div className="card-label">Jahresabschluss</div>
                                <div className="card-value">Erledigt</div>
                            </div>
                        </motion.div>
                    </motion.div>
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
          background: linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%);
          z-index: -1;
        }
        
        /* Animated gradient overlay */
        .hero-bg::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.8), transparent 60%);
            animation: rotateBg 20s linear infinite;
        }
        
        @keyframes rotateBg {
             from { transform: rotate(0deg); }
             to { transform: rotate(360deg); }
        }

        .hero-bg::before {
          content: '';
          position: absolute;
          top: -10%;
          right: -5%;
          width: 50%;
          height: 80%;
          background: radial-gradient(circle, rgba(0, 163, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
          position: relative; 
          z-index: 1; 
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.8);
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
           background: rgba(0, 163, 255, 0.2);
           z-index: -1;
           border-radius: 4px;
        }

        .hero-text {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          margin-bottom: 2.5rem;
          max-width: 540px;
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

        .hero-visual {
            position: relative;
            height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .abstract-shape {
            width: 300px;
            height: 300px;
            background: linear-gradient(120deg, var(--color-primary), var(--color-accent));
            opacity: 0.8;
            box-shadow: 0 20px 50px rgba(0, 163, 255, 0.3);
        }

        .card-float {
            position: absolute;
            background: white;
            padding: 1rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 2;
        }

        .card-1 {
            top: 10%;
            left: 0;
        }

        .card-2 {
            bottom: 20%;
            right: 0;
        }

        .card-icon {
            width: 40px;
            height: 40px;
            background: var(--color-bg-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: var(--color-primary);
        }

        .card-label {
            font-size: 0.75rem;
            color: var(--color-text-muted);
        }

        .card-value {
            font-weight: 700;
            color: var(--color-primary);
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
