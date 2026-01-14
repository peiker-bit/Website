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
                            <h2>Mehr als nur<br />Steuern sparen.</h2>
                            <p>
                                Wir verstehen uns als Ihr Partner auf Augenhöhe. Steuerberatung ist für uns mehr als das Abarbeiten von Formularen – es geht um Ihre wirtschaftliche Zukunft und Sicherheit.
                            </p>
                            <p>
                                Mit modernster Software und einem engagierten Team sorgen wir dafür, dass Sie den Kopf frei haben für das Wesentliche: Ihren Erfolg.
                            </p>
                        </ScrollReveal>

                        <div className="features-list">
                            {[
                                { icon: <Target size={24} />, title: 'Zielorientiert', desc: 'Proaktive Beratung statt bloße Reaktion' },
                                { icon: <ShieldCheck size={24} />, title: 'Verlässlich', desc: 'Fristgerecht, rechtssicher, transparent' },
                                { icon: <Clock size={24} />, title: 'Zeitgemäß', desc: 'Digitale Prozesse für schnelle Ergebnisse' }
                            ].map((item, index) => (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <div className="feature-item">
                                        <div className="feature-icon">{item.icon}</div>
                                        <div>
                                            <h4>{item.title}</h4>
                                            <span className="feature-desc">{item.desc}</span>
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
                                    >20+</motion.span>
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
          gap: 6rem;
          align-items: center;
        }

        .label-text {
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .about-content h2 {
          font-size: 3rem;
          margin-bottom: 2rem;
        }

        .about-content p {
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          font-size: 1.05rem;
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
          gap: 1rem;
        }

        .feature-icon {
          color: var(--color-accent);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .feature-item h4 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .feature-desc {
          color: var(--color-text-muted);
          font-size: 0.9rem;
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
            width: 280px;
            height: 280px;
            padding: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
        }

        .stack-card h3 {
            font-size: 4rem;
            color: white;
            line-height: 1;
            margin-bottom: 0.5rem;
        }
        
        .stack-card p {
            color: rgba(255,255,255,0.9);
            font-size: 1.25rem;
            font-weight: 500;
            margin: 0;
        }

        .bg-primary { background: var(--color-primary); }
        .bg-accent { background: var(--color-accent); }
        .bg-secondary { background: var(--color-secondary); }

        .offset-card {
            position: absolute;
            top: 40px;
            left: 40px;
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
                display: none; 
            }
        }
      `}</style>
        </section>
    );
};

export default About;
