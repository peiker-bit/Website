import React, { useEffect } from 'react';
import { Calculator, TrendingUp, Users, FileText, PieChart, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    {
        icon: <Calculator size={32} />,
        title: 'Steuererklärung',
        desc: 'Professionelle Erstellung Ihrer Einkommensteuererklärung für Arbeitnehmer, Rentner und Vermieter.'
    },
    {
        icon: <Briefcase size={32} />,
        title: 'Jahresabschluss',
        desc: 'Erstellung von Jahresabschlüssen und Gewinnermittlungen nach Handels- und Steuerrecht.'
    },
    {
        icon: <TrendingUp size={32} />,
        title: 'Finanzbuchhaltung',
        desc: 'Digitale Buchführung mit DATEV Unternehmen online – effizient und papierlos.'
    },
    {
        icon: <Users size={32} />,
        title: 'Lohnbuchhaltung',
        desc: 'Zuverlässige Lohn- und Gehaltsabrechnungen inkl. aller Meldungen.'
    },
    {
        icon: <PieChart size={32} />,
        title: 'Betriebswirtschaft',
        desc: 'Analyse Ihrer Zahlen und Beratung zur Unternehmenssteuerung und Liquidität.'
    },
    {
        icon: <FileText size={32} />,
        title: 'Gründungsberatung',
        desc: 'Starten Sie erfolgreich in die Selbstständigkeit mit unserem Gründer-Coaching.'
    }
];

const ServicesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="services-page">
            <section className="page-hero section">
                <div className="container text-center">
                    <h1 className="hero-title fade-in">Unsere Leistungen</h1>
                    <p className="hero-subtitle fade-in" style={{ animationDelay: '0.1s' }}>
                        Wir unterstützen Sie in allen steuerlichen und betriebswirtschaftlichen Fragen.
                        Digital, kompetent und persönlich.
                    </p>
                </div>
            </section>

            <section className="section bg-white">
                <div className="container">
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="service-card-lg"
                            >
                                <div className="service-icon-lg">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <a href="#contact" className="service-link">
                                    Mehr erfahren <ArrowRight size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    <div className="cta-box text-center">
                        <h2>Bereit für eine moderne Steuerberatung?</h2>
                        <p className="mb-8">Lassen Sie uns gemeinsam Ihre steuerliche Zukunft gestalten.</p>
                        <a href="/kontakt" className="btn btn-primary">Jetzt Kontakt aufnehmen</a>
                    </div>
                </div>
            </section>

            <style>{`
            .page-hero {
                padding-top: 10rem;
                padding-bottom: 4rem;
                background: var(--gradient-hero);
            }
            
            .hero-title {
                font-size: var(--text-5xl);
                margin-bottom: 1rem;
            }
            
            .hero-subtitle {
                font-size: 1.25rem;
                color: var(--color-text-muted);
                max-width: 700px;
                margin: 0 auto;
            }

            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
            }

            .service-card-lg {
                background: white;
                padding: 3rem;
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-sm);
                border: 1px solid var(--color-border);
                transition: all var(--transition-normal);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .service-card-lg:hover {
                transform: translateY(-5px);
                box-shadow: var(--shadow-xl);
                border-color: var(--color-accent-light);
            }

            .service-icon-lg {
                width: 64px;
                height: 64px;
                background: var(--color-bg-subtle);
                color: var(--color-accent);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-lg);
                margin-bottom: 1.5rem;
                transition: all var(--transition-normal);
            }

            .service-card-lg:hover .service-icon-lg {
                background: var(--color-accent);
                color: white;
                transform: rotate(-5deg);
            }

            .service-card-lg h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }

            .service-card-lg p {
                color: var(--color-text-muted);
                line-height: 1.6;
                margin-bottom: 1.5rem;
                flex-grow: 1;
            }

            .service-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--color-accent);
                font-weight: 600;
                font-size: 0.95rem;
            }

            .service-link:hover {
                color: var(--color-accent-hover);
                gap: 0.75rem;
            }

            .cta-box {
                max-width: 800px;
                margin: 0 auto;
            }
            
            .cta-box h2 {
                margin-bottom: 1rem;
            }
            
            .mb-8 { margin-bottom: 2rem; }

        `}</style>
        </div>
    );
};

export default ServicesPage;
