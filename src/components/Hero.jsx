import React from 'react';
import { ArrowRight, CheckCircle, TrendingDown, Clock, Briefcase, Laptop, Store, Home, User, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="hero-bg"></div>
            <div className="container hero-container">
                <div className="hero-content">


                    <h1 className="hero-title">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            style={{ display: 'block', marginBottom: '0.5rem' }}
                        >
                            Steuern verstehen. Entscheidungen sicher treffen.

                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-highlight"
                        >
                            Zukunft gestalten.

                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="hero-text"
                    >
                        Ich unterstütze Unternehmer, Selbständige und anspruchsvolle Privatpersonen dabei, steuerliche Pflichten effizient zu erfüllen und steuerliche Gestaltungsspielräume gezielt zu nutzen – verständlich, vorausschauend und auf Augenhöhe.

                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="hero-actions"
                    >
                        <motion.a
                            href="https://terminbuchung-three.vercel.app/buchen"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Termin vereinbaren <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </motion.a>
                        <motion.a
                            href="#services"
                            className="btn btn-outline"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Meine Leistungen
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
                                {[0, 90, 180, 270].map((deg, i) => (
                                    <circle key={i} cx={250 + 200 * Math.cos(deg * Math.PI / 180)} cy={250 + 200 * Math.sin(deg * Math.PI / 180)} r="4" fill="var(--color-text-muted)" opacity="0.5" />
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
                                <circle cx="250" cy="250" r="160" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeDasharray="100 905" strokeLinecap="round" />
                                <circle cx="250" cy="250" r="160" stroke="var(--color-accent)" strokeWidth="3" fill="none" strokeDasharray="60 945" strokeDashoffset="-200" strokeLinecap="round" />
                                <circle cx="250" cy="250" r="160" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeDasharray="40 965" strokeDashoffset="-500" strokeLinecap="round" />
                            </motion.g>

                            {/* Inner Ring - Rapid Data Flow */}
                            <motion.g
                                style={{ transformOrigin: "250px 250px" }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <circle cx="250" cy="250" r="120" stroke="var(--color-border)" strokeWidth="1" fill="none" />
                                <path d="M250,130 L250,140" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M250,360 L250,370" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M130,250 L140,250" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                                <path d="M360,250 L370,250" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
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

                        {/* Floating Cards - Target Groups */}
                        <div className="hero-cards-wrapper">
                            {[
                                { label: 'Unternehmen', icon: Briefcase, color: '#3B82F6', bg: '#EFF6FF', pos: { top: '5%', left: '50%', transform: 'translateX(-50%)' }, delay: 0.5 },
                                { label: 'Freiberufler', icon: Laptop, color: '#8B5CF6', bg: '#F5F3FF', pos: { top: '25%', left: '85%' }, delay: 0.7 },
                                { label: 'Gewerbetreibende', icon: Store, color: '#10B981', bg: '#ECFDF5', pos: { bottom: '25%', left: '85%' }, delay: 0.9 },
                                { label: 'Vermieter', icon: Home, color: '#F59E0B', bg: '#FFFBEB', pos: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }, delay: 1.1 },
                                { label: 'Arbeitnehmer', icon: User, color: '#EC4899', bg: '#FDF2F8', pos: { bottom: '25%', right: '85%' }, delay: 1.3 },
                                { label: 'Erbschaft & Schenkung', icon: Gift, color: '#14b8a6', bg: '#ccfbf1', pos: { top: '25%', right: '85%' }, delay: 1.5 }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="card-float"
                                    style={{ ...item.pos }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                                    transition={{
                                        opacity: { delay: item.delay, duration: 0.5 },
                                        scale: { delay: item.delay, duration: 0.5 },
                                        y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
                                    }}
                                >
                                    <div className="card-icon" style={{ color: item.color, background: item.bg }}>
                                        <item.icon size={18} />
                                    </div>
                                    <div className="card-content-simple">
                                        <div className="card-value-simple">{item.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
          background: var(--gradient-hero);
          z-index: -1;
        }
        
        .hero-bg::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
            background-size: 32px 32px;
            opacity: 0.4;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: center;
          position: relative; 
          z-index: 1; 
          max-width: var(--container-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid var(--color-accent-light);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--color-accent);
        }

        .hero-title {
          font-size: var(--text-5xl);
          margin-bottom: 1.5rem;
          line-height: 1.3;
          letter-spacing: -0.01em;
          font-weight: 800;
        }

        .text-highlight {
          color: var(--color-accent);
          position: relative;
          display: inline-block;
          background: linear-gradient(120deg, var(--color-accent) 0%, var(--color-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .hero-cards-wrapper {
            display: contents;
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
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            padding: 0.75rem 1rem;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
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
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .icon-optimize {
            background: var(--color-accent-light); /* Teal tint */
            color: var(--color-accent);
        }
        
        .icon-secure {
            background: #ECFDF5;
            color: #059669;
        }

        .card-content-simple {
            display: flex;
            align-items: center;
        }

        .card-value-simple {
            font-weight: 600;
            color: var(--color-primary);
            font-size: 0.9rem;
        }

            @media (max-width: 968px) {
                .hero-container {
                    grid-template-columns: 1fr;
                    text-align: center;
                    gap: 3rem;
                    padding-left: var(--space-4);
                    padding-right: var(--space-4);
                }
                
                .hero-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
    
                .hero-title {
                    font-size: 2.25rem; /* Adjusted for better mobile fit */
                    line-height: 1.2;
                }
                
                .hero-text {
                    margin-left: auto;
                    margin-right: auto;
                    font-size: 1rem;
                }
    
                .hero-actions {
                    justify-content: center;
                    width: 100%;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .hero-actions .btn {
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                }
    
                .hero-trust {
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }
    
                .hero-visual {
                    height: auto;
                    min-height: auto;
                    margin-top: 2rem;
                    flex-direction: column;
                    padding-bottom: 2rem;
                }
    
                .cycle-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: auto;
                }
    
                .digital-cycle {
                    max-width: 280px; /* Smaller cycle on mobile */
                    margin-bottom: 2rem;
                }
    
                .hero-cards-wrapper {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                    width: 100%;
                    margin-top: 1rem;
                }
    
                /* Override motion styles and absolute positioning on mobile */
                .card-float {
                    position: relative !important;
                    top: auto !important;
                    bottom: auto !important;
                    left: auto !important;
                    right: auto !important;
                    transform: none !important;
                    margin: 0 !important;
                    width: 100%;
                    justify-content: flex-start;
                    padding: 0.6rem 0.75rem; /* Compact padding */
                }
				
				.card-value-simple {
					font-size: 0.8rem;
				}

                .hero {
                    padding-top: 6rem;
                    padding-bottom: 3rem;
                    height: auto;
                    min-height: auto;
                }
            }
      `}</style>
        </section>
    );
};

export default Hero;
