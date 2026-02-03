import React, { useEffect, useState } from 'react';
import { CheckCircle2, Calculator, FileText, PieChart, Shield, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import SEO from './SEO';
import { motion } from 'framer-motion';

const PayrollAnimation = () => {
    // Floating particles configuration
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div className="payroll-animation-container">
            {/* Background Gradient Pulse */}
            <motion.div
                className="bg-pulse"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Floating Income/Doc Icons */}
            <div className=" floating-icons">
                {[Calculator, FileText, CheckCircle2, Clock, Shield].map((Icon, index) => (
                    <motion.div
                        key={index}
                        className="floating-icon"
                        style={{
                            left: `${15 + index * 18}%`,
                            top: `${20 + (index % 2) * 40}%`
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.4, 0.8, 0.4],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 5 + index,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                        }}
                    >
                        <Icon size={24 + (index % 3) * 8} strokeWidth={1.5} />
                    </motion.div>
                ))}
            </div>

            {/* Particle Dust */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="particle"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

const Payroll = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Fristen – Wann müssen die Daten da sein?",
            answer: "Damit wir Ihre Abrechnungen pünktlich fertigstellen können, benötigen wir alle abrechnungsrelevanten Daten in der Regel bis zum 20. des Monats. Individuelle Absprachen sind möglich."
        },
        {
            question: "Verspätete Daten – Was passiert dann?",
            answer: "Sollten Daten nach dem vereinbarten Stichtag eingehen, können wir eine pünktliche Abrechnung für den laufenden Monat nicht garantieren. Nachberechnungen erfolgen dann im Folgemonat."
        },
        {
            question: "Meldungen an Finanzamt & Sozialversicherung",
            answer: "Keine Sorge, wir übernehmen alle gesetzlich vorgeschriebenen Meldungen (Lohnsteueranmeldung, Beitragsnachweise etc.) fristgerecht für Sie."
        },
        {
            question: "Minijobber – Was ist zu beachten?",
            answer: "Auch für Minijobber gelten Aufzeichnungspflichten (Stunden). Wir stellen Ihnen Vorlagen zur Verfügung und prüfen die Einhaltung der Geringfügigkeitsgrenzen."
        },
        {
            question: "Datensicherheit – Wie sicher sind meine Daten?",
            answer: "Höchste Sicherheit durch Nutzung der DATEV-Rechenzentren. DSGVO-konforme Übermittlung und Speicherung statt unsicherer E-Mail-Anhänge."
        }
    ];

    return (
        <div className="payroll-page">
            <SEO
                title="Lohnbuchhaltung"
                description="Professionelle Lohnbuchhaltung für Ihr Unternehmen. Wir übernehmen Abrechnungen, Meldungen und beraten Sie zu steuerfreien Extras."
                url="/lohn"
                keywords="Lohnbuchhaltung, Gehaltsabrechnung, Baulohn, Lohnsteuer, Sozialversicherung, Nettolohnoptimierung"
            />

            {/* Hero Section */}
            <section className="payroll-hero section">
                <PayrollAnimation />
                <div className="container">
                    <div className="hero-content text-center">
                        <h1 className="fade-in">Lohnabrechnung – digital, effizient und rechtssicher</h1>
                        <p className="subheadline fade-in" style={{ animationDelay: '0.2s' }}>
                            Konzentrieren Sie sich auf Ihr Geschäft – wir kümmern uns um Ihre Lohnbuchhaltung.
                        </p>
                        <p className="hero-text fade-in" style={{ animationDelay: '0.4s' }}>
                            Korrekte Abrechnungen, digitaler Datenfluss und persönliche Betreuung für kleine und mittelständische Unternehmen.
                        </p>
                        <div className="hero-actions fade-in" style={{ animationDelay: '0.6s' }}>
                            <a href="https://termine.peiker-steuer.de" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                Termin vereinbaren <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview / Benefits */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title text-center">Warum professionelle Lohnabrechnung?</h2>
                    <p className="section-subtitle text-center">
                        Lohnabrechnung ist mehr als eine Überweisung. Sie erfordert aktuelles Fachwissen und Rechtssicherheit.
                    </p>

                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <Shield className="benefit-icon" size={32} />
                            <h3>Rechtssicherheit</h3>
                            <p>Wir berücksichtigen laufend aktuelle Gesetzesänderungen im Steuer- und Sozialversicherungsrecht.</p>
                        </div>
                        <div className="benefit-card">
                            <Clock className="benefit-icon" size={32} />
                            <h3>Zeitersparnis</h3>
                            <p>Digitale Prozesse reduzieren Ihren Verwaltungsaufwand auf ein Minimum.</p>
                        </div>
                        <div className="benefit-card">
                            <Users className="benefit-icon" size={32} />
                            <h3>Feste Ansprechpartner</h3>
                            <p>Persönliche Betreuung bei Fragen zu Urlaub, Krankheit oder Einstellungen.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DATEV / Tools Section */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="section-title text-center">Digitale Zusammenarbeit mit DATEV</h2>
                    <p className="section-subtitle text-center">
                        Zwei Wege für maximale Effizienz – passend zu Ihrer Unternehmensgröße.
                    </p>

                    <div className="tools-grid">
                        {/* Digitale Personalakte */}
                        <div className="tool-card featured">
                            <div className="tool-badge">Empfehlung</div>
                            <h3>Digitale Personalakte (DATEV)</h3>
                            <p className="tool-desc">Die professionelle Lösung für strukturierte Prozesse und digitale Archivierung.</p>
                            <ul className="tool-features">
                                <li><CheckCircle size={16} /> Alle Verträge & Bescheinigungen an einem Ort</li>
                                <li><CheckCircle size={16} /> Revisionssichere Archivierung</li>
                                <li><CheckCircle size={16} /> Automatische Schnittstellen</li>
                                <li><CheckCircle size={16} /> Ideal für wachsende Unternehmen</li>
                            </ul>
                        </div>

                        {/* Online-Mitarbeiterverwaltung */}
                        <div className="tool-card">
                            <h3>Online-Mitarbeiterverwaltung</h3>
                            <p className="tool-desc">Die schlanke Alternative ohne eigenen DATEV-Zugang.</p>
                            <ul className="tool-features">
                                <li><CheckCircle size={16} /> Einfache Bedienung ohne Schulung</li>
                                <li><CheckCircle size={16} /> Strukturierte Datenübermittlung</li>
                                <li><CheckCircle size={16} /> Kein DATEV-Stick notwendig</li>
                                <li><CheckCircle size={16} /> Perfekt für kleine Teams</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center mt-3rem">
                        <p className="note-text">Welche Lösung für Sie am besten passt, klären wir gemeinsam im Beratungsgespräch.</p>
                    </div>
                </div>
            </section>

            {/* Process / Workflow */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title text-center">Ablauf der monatlichen Abrechnung</h2>
                    <div className="process-timeline">
                        <div className="timeline-item">
                            <div className="timeline-marker">1</div>
                            <div className="timeline-content">
                                <h3>Daten erfassen</h3>
                                <p>Sie übermitteln uns Stunden, Fehlzeiten und Änderungen bequem digital (per App, Portal oder Upload).</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker">2</div>
                            <div className="timeline-content">
                                <h3>Verarbeitung & Prüfung</h3>
                                <p>Wir erstellen die Abrechnungen, prüfen Meldungen und übermitteln alles an Ämter und Krankenkassen.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker">3</div>
                            <div className="timeline-content">
                                <h3>Fertigstellung & Zahlung</h3>
                                <p>Sie erhalten die Auswertungen und Zahlungsdateien. Ihre Mitarbeiter erhalten ihre Abrechnung digital.</p>
                            </div>
                        </div>
                    </div>

                    <div className="new-employee-box">
                        <h3><Users size={24} /> Neuer Mitarbeiter?</h3>
                        <p>Nutzen Sie unseren digitalen Onboarding-Fragebogen für eine reibungslose Anmeldung.</p>
                        <div className="text-center">
                            <span className="placeholder-link">Link zum Personalfragebogen (folgt)</span>
                        </div>
                    </div>
                </div>
            </section>


            {/* Pricing Section */}
            <section className="section bg-primary text-light">
                <div className="container">
                    <h2 className="section-title text-center text-light">Transparente Preise</h2>
                    <p className="section-subtitle text-center text-light-muted">
                        Keine versteckten Kosten. Klare Pauschalen pro Mitarbeiter.
                    </p>

                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Lohnabrechnung</h3>
                                <div className="price">20 € <span className="period">netto / AN / Monat</span></div>
                            </div>
                            <ul className="pricing-features">
                                <li><CheckCircle size={16} className="text-accent" /> Laufende Lohnabrechnung</li>
                                <li><CheckCircle size={16} className="text-accent" /> Meldungen an KK & Finanzamt</li>
                                <li><CheckCircle size={16} className="text-accent" /> Digitale Auswertungen</li>
                                <li><CheckCircle size={16} className="text-accent" /> Erstattungsanträge (U1/U2)</li>
                            </ul>
                        </div>
                        <div className="pricing-card construction">
                            <div className="pricing-header">
                                <h3>Baulohn</h3>
                                <div className="price">25 € <span className="period">netto / AN / Monat</span></div>
                            </div>
                            <ul className="pricing-features">
                                <li><CheckCircle size={16} className="text-accent" /> Inkl. SOKA-Bau Meldungen</li>
                                <li><CheckCircle size={16} className="text-accent" /> Urlaubskassenverfahren</li>
                                <li><CheckCircle size={16} className="text-accent" /> Saison-KUG (Schlechtwetter)</li>
                                <li><CheckCircle size={16} className="text-accent" /> Sofortmeldungen</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title text-center">Häufige Fragen (FAQ)</h2>
                    <div className="faq-container">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`faq-accordion ${openFaq === index ? 'active' : ''}`}>
                                <button className="faq-question" onClick={() => toggleFaq(index)}>
                                    <span>{faq.question}</span>
                                    {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section final-cta text-center">
                <div className="container">
                    <h2>Bereit für eine entspannte Lohnbuchhaltung?</h2>
                    <p>Lassen Sie uns unverbindlich über Ihre Anforderungen sprechen.</p>
                    <a href="https://termine.peiker-steuer.de" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                        Jetzt Online-Termin vereinbaren
                    </a>
                </div>
            </section>


            {/* Styles specific to Payroll page */}
            <style>{`
        .payroll-hero {
            padding-top: 10rem;
            padding-bottom: 8rem;
            background: var(--gradient-hero);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .payroll-animation-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }
        
        .bg-pulse {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05), transparent 70%);
        }

        .floating-icon {
            position: absolute;
            color: var(--color-secondary-light);
            pointer-events: none;
            opacity: 0.6;
        }
        
        .particle {
            position: absolute;
            background: var(--color-accent);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.4;
        }


        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 900px;
            margin: 0 auto;
        }

        .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }

        .subheadline {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--color-primary);
            margin-bottom: 1.5rem;
        }

        .hero-text {
            max-width: 800px;
            margin: 0 auto 2.5rem;
            color: var(--color-text-muted);
            font-size: 1.125rem;
            line-height: 1.7;
        }



        /* Benefits */
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .benefit-card {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
            transition: transform var(--transition-normal);
        }

        .benefit-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
        }

        .benefit-icon {
            color: var(--color-accent);
            margin-bottom: 1.5rem;
        }
        
        .benefit-card h3 {
            margin-bottom: 1rem;
            color: var(--color-primary);
        }

        /* Tools / DATEV */
        .tools-grid {
             display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .tool-card {
            background: white;
            padding: 2.5rem;
            border-radius: var(--radius-xl);
            border: 1px solid var(--color-border);
            position: relative;
        }

        .tool-card.featured {
            border-color: var(--color-accent);
            box-shadow: 0 0 20px rgba(var(--color-accent-rgb), 0.1);
        }

        .tool-badge {
            position: absolute;
            top: -12px;
            right: 20px;
            background: var(--color-accent);
            color: white;
            padding: 4px 12px;
            border-radius: var(--radius-full);
            font-size: 0.8rem;
            font-weight: 600;
        }

        .tool-card h3 {
            color: var(--color-primary);
            margin-bottom: 1rem;
        }

        .tool-desc {
            color: var(--color-text-muted);
            margin-bottom: 1.5rem;
            font-style: italic;
        }

        .tool-features {
            list-style: none;
            padding: 0;
        }

        .tool-features li {
            display: flex;
            gap: 0.75rem;
            align-items: center;
            margin-bottom: 0.75rem;
            color: var(--color-text);
        }
        
        .tool-features li svg {
            color: var(--color-secondary);
            flex-shrink: 0;
        }

        .note-text {
            color: var(--color-text-muted);
            font-style: italic;
        }
        
        .mt-3rem { margin-top: 3rem; }

        /* Process */
        .process-timeline {
            max-width: 800px;
            margin: 3rem auto;
            position: relative;
        }

        .process-timeline::before {
            content: '';
            position: absolute;
            left: 24px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--color-border);
        }

        .timeline-item {
            display: flex;
            gap: 2rem;
            margin-bottom: 3rem;
            position: relative;
        }

        .timeline-marker {
            width: 50px;
            height: 50px;
            background: white;
            border: 2px solid var(--color-accent);
            color: var(--color-accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.25rem;
            flex-shrink: 0;
            z-index: 1;
        }

        .timeline-content h3 {
            color: var(--color-primary);
            margin-bottom: 0.5rem;
        }

        .new-employee-box {
            background: var(--color-bg-subtle);
            border-radius: var(--radius-lg);
            padding: 2rem;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
            border: 2px dashed var(--color-border);
        }

        .new-employee-box h3 {
             display: flex;
             justify-content: center;
             align-items: center;
             gap: 0.75rem;
             margin-bottom: 1rem;
             color: var(--color-primary);
        }
        
        .placeholder-link {
            display: inline-block;
            margin-top: 1rem;
            color: var(--color-text-muted);
            text-decoration: underline;
            cursor: not-allowed;
            opacity: 0.7;
        }

        /* Pricing */
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }

        .pricing-card {
            background: white;
            border-radius: var(--radius-xl);
            padding: 2.5rem;
            color: var(--color-text);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }

        .pricing-card h3 {
            color: var(--color-primary);
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .pricing-card .price {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--color-accent);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1;
        }
        
        .pricing-card .price .period {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            font-weight: 400;
            margin-top: 0.5rem;
        }

        .pricing-header {
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--color-border);
            padding-bottom: 1.5rem;
        }

        .pricing-features {
            list-style: none;
            padding: 0;
        }

        .pricing-features li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .text-light-muted {
            color: rgba(255, 255, 255, 0.8);
        }

        /* FAQ */
        .faq-container {
            max-width: 800px;
            margin: 3rem auto 0;
        }

        .faq-accordion {
            border-bottom: 1px solid var(--color-border);
        }

        .faq-question {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 0;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--color-primary);
            text-align: left;
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        
        .faq-accordion.active .faq-answer {
            max-height: 200px; /* Adjust as needed */
            padding-bottom: 1.5rem;
        }

        .faq-answer p {
            color: var(--color-text-muted);
            margin: 0;
        }

        .final-cta {
             padding: 6rem 0;
        }
        
        .final-cta h2 {
            margin-bottom: 1rem;
        }
        
         .final-cta p {
            font-size: 1.25rem;
            color: var(--color-text-muted);
            margin-bottom: 2rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .process-timeline::before {
                left: 20px;
            }
            
            .timeline-item {
                flex-direction: column;
                gap: 0.5rem;
                padding-left: 3rem;
            }
            
            .timeline-marker {
                position: absolute;
                left: 0;
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
        }

      `}</style>
        </div>
    );
};

export default Payroll;
