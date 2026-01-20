import React from 'react';
import { Target, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';

const About = () => {
    return (
        <section id="about" className="section">
            <div className="container">
                <div className="about-grid">
                    <div className="about-content">
                        <ScrollReveal>
                            <div className="label-text">Die Kanzlei</div>
                            <h2>Steuerberatung, die Orientierung schafft und Entscheidungen unterstützt</h2>
                            <p>
                                Ich verstehe mich als Partner auf Augenhöhe. Steuerberatung bedeutet für mich mehr als das Ausfüllen von Formularen – sie schafft Struktur, Orientierung und eine verlässliche Grundlage für fundierte wirtschaftliche Entscheidungen.
                            </p>
                            <p>
                                Durch klare Abläufe, digitale Prozesse und persönliche Betreuung begleite ich dich bei steuerlichen Fragestellungen. So bleiben steuerliche Themen nachvollziehbar und planbar und fügen sich sinnvoll in dein unternehmerisches Handeln ein.
                            </p>
                        </ScrollReveal>

                        <div className="features-list">
                            {[
                                {
                                    icon: <Target size={24} />,
                                    title: 'Zielorientiert',
                                    subtitle: 'Beratung mit Blick nach vorn',
                                    desc: 'Ich denke steuerliche Themen vorausschauend und spreche relevante Entwicklungen frühzeitig an, statt nur auf Vergangenes zu reagieren.'
                                },
                                {
                                    icon: <ShieldCheck size={24} />,
                                    title: 'Verlässlich',
                                    subtitle: 'Struktur, Transparenz und klare Absprachen',
                                    desc: 'Klare Prozesse, nachvollziehbare Abläufe und offene Kommunikation bilden die Grundlage einer verlässlichen Zusammenarbeit.'
                                },
                                {
                                    icon: <Clock size={24} />,
                                    title: 'Zeitgemäß',
                                    subtitle: 'Digitale Prozesse, persönlich umgesetzt',
                                    desc: 'Digitale Arbeitsweisen sorgen für effiziente Abläufe – ohne auf persönliche Beratung und Erreichbarkeit zu verzichten.'
                                }
                            ].map((item, index) => (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <div className="feature-item">
                                        <div className="feature-icon">{item.icon}</div>
                                        <div>
                                            <h4>{item.title}</h4>
                                            <div className="feature-desc">
                                                <strong>{item.subtitle}</strong><br />
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                    <div className="about-visual">
                        <div className="image-stack">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="stack-card bg-primary text-white"
                            >
                                <h3>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    >15+</motion.span>
                                </h3>
                                <p>Jahre Erfahrung</p>
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0, rotate: -15, x: -20, y: -20 }}
                                whileInView={{ scale: 1, opacity: 1, rotate: -5, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="stack-card bg-secondary text-white offset-card"
                            >
                                <h3>100%</h3>
                                <p>Digital</p>
                            </motion.div>
                        </div>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="circle-deco"
                        ></motion.div>
                    </div>
                </div>
            </div>

            <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-24);
          align-items: center;
        }

        .label-text {
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-accent);
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .about-content h2 {
          font-size: var(--text-4xl);
          margin-bottom: 2rem;
          line-height: 1.1;
          color: var(--color-primary);
        }

        .about-content p {
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
          line-height: 1.7;
        }

        .features-list {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
        }

        .feature-icon {
          color: var(--color-accent);
          flex-shrink: 0;
          margin-top: 4px;
          background: var(--color-accent-light);
          padding: 10px;
          border-radius: 50%;
        }

        .feature-item h4 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
          color: var(--color-primary);
        }

        .feature-desc {
          color: var(--color-text-muted);
          font-size: 1rem;
        }

        .about-visual {
            position: relative;
            height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-stack {
            position: relative;
            z-index: 2;
        }

        .stack-card {
            width: 320px;
            height: 320px;
            padding: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .stack-card h3 {
            font-size: 5rem;
            color: white;
            line-height: 1;
            margin-bottom: 0.5rem;
            font-weight: 800;
        }
        
        .stack-card p {
            color: rgba(255,255,255,0.9);
            font-size: 1.5rem;
            font-weight: 500;
            margin: 0;
        }

        .bg-primary { 
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
        }
        .bg-secondary { 
            background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
        }

        .offset-card {
            position: absolute;
            top: 60px;
            left: 60px;
            z-index: -1;
            transform: rotate(-5deg);
        }

        .circle-deco {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -250px; /* Half of width */
            margin-top: -250px; /* Half of height */
            width: 500px;
            height: 500px;
            border: 2px dashed var(--color-border); /* Changed to dashed for more texture */
            border-radius: 50%;
            z-index: 0;
        }

        @media (max-width: 968px) {
            .about-grid {
                grid-template-columns: 1fr;
                gap: 4rem;
            }
            
            .about-visual {
                display: flex; /* Show on mobile */
                height: 400px;
                margin-top: 2rem;
            }

            .stack-card {
                width: 260px;
                height: 260px;
                padding: 2rem;
            }
             
            .stack-card h3 {
                font-size: 3.5rem;
            }

            .offset-card {
                top: 30px;
                left: 30px;
            }
            
            .circle-deco {
                width: 350px;
                height: 350px;
                margin-left: -175px; 
                margin-top: -175px;
            }
        }
      `}</style>
        </section>
    );
};

export default About;
