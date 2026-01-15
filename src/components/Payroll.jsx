import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle, Upload, Shield, Users, HelpCircle } from 'lucide-react';

const Payroll = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="payroll-page">
            {/* Hero Section */}
            <section className="payroll-hero section">
                <div className="container">
                    <div className="hero-content text-center">
                        <h1 className="fade-in">Digitale Lohnabrechnung – zuverlässig, sicher und verständlich</h1>
                        <p className="subheadline fade-in" style={{ animationDelay: '0.2s' }}>
                            Übermitteln Sie Ihre Lohndaten einfach online – wir kümmern uns um die korrekte Abrechnung.
                        </p>
                        <p className="hero-text fade-in" style={{ animationDelay: '0.4s' }}>
                            Mit unserer digitalen Lohnabrechnung sparen Sie Zeit und reduzieren Verwaltungsaufwand.
                            Über unseren Online-Fragebogen und DATEV-Lösungen erfassen und übermitteln Sie Ihre Lohndaten strukturiert, sicher und nachvollziehbar.
                        </p>
                        <div className="hero-actions fade-in" style={{ animationDelay: '0.6s' }}>
                            <a href="#contact" className="btn btn-primary">
                                Jetzt Lohnabrechnung digital starten <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </a>
                            <a href="#contact" className="btn btn-outline">
                                Persönlich beraten lassen
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Digital Payroll */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title text-center">Warum digitale Lohnabrechnung?</h2>
                    <p className="section-subtitle text-center">
                        Die Lohnabrechnung ist rechtlich anspruchsvoll und fehleranfällig. Digitale Prozesse sorgen für Struktur, Sicherheit und Transparenz.
                    </p>

                    <div className="benefits-grid">
                        {[
                            "Weniger Verwaltungsaufwand",
                            "Keine Papierunterlagen",
                            "Keine unsicheren E-Mail-Anhänge",
                            "Strukturierte Datenerfassung",
                            "Pünktliche und korrekte Abrechnung"
                        ].map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                <CheckCircle className="text-secondary" size={24} />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="section-title text-center">So funktioniert die digitale Zusammenarbeit</h2>
                    <div className="process-steps">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Online-Fragebogen ausfüllen</h3>
                            <p>Über unseren Online-Fragebogen erfassen Sie alle relevanten Daten: Stammdaten, Mitarbeiterdaten, Arbeitszeiten und Entgeltbestandteile. Der Fragebogen führt Sie verständlich durch alle Angaben.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Digitale Übermittlung über DATEV</h3>
                            <p>Die Daten werden sicher verarbeitet und über DATEV-Systeme (Unternehmen online, Arbeitnehmer online) genutzt.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Lohnabrechnung & Bereitstellung</h3>
                            <p>Wir erstellen die laufende Lohnabrechnung und stellen diese digital bereit. Optional erhalten Ihre Mitarbeiter Zugriff über DATEV Arbeitnehmer online.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Channels */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title text-center">Digitale Übermittlungswege im Überblick</h2>
                    <div className="channels-grid">
                        <div className="channel-card">
                            <Upload className="channel-icon" size={40} />
                            <h3>DATEV Unternehmen online</h3>
                            <p>Zentrale Plattform zur Übermittlung von Lohndaten, Unterlagen und Änderungen.</p>
                        </div>
                        <div className="channel-card">
                            <Users className="channel-icon" size={40} />
                            <h3>DATEV Arbeitnehmer online</h3>
                            <p>Digitale Bereitstellung von Abrechnungen und Bescheinigungen für Mitarbeiter.</p>
                        </div>
                        <div className="channel-card">
                            <Shield className="channel-icon" size={40} />
                            <h3>Digitaler Upload</h3>
                            <p>Ergänzende Möglichkeit zur schnellen Übermittlung einzelner Dokumente.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Target Audience */}
            <section className="section bg-primary text-light">
                <div className="container">
                    <h2 className="text-center text-light mb-lg">Für wen ist diese Lösung geeignet?</h2>
                    <div className="audience-list text-center">
                        <span className="audience-tag">Kleine Unternehmen</span>
                        <span className="audience-tag">Handwerksbetriebe</span>
                        <span className="audience-tag">Freiberufler</span>
                        <span className="audience-tag">Bis ca. 100 Mitarbeiter</span>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title text-center">Häufige Fragen</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Wie aufwendig ist der Online-Fragebogen?</h4>
                            <p>Der Fragebogen ist übersichtlich aufgebaut und in wenigen Schritten ausfüllbar.</p>
                        </div>
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Benötige ich DATEV-Kenntnisse?</h4>
                            <p>Nein. Die Systeme sind mandantenfreundlich gestaltet. Wir unterstützen bei der Einrichtung.</p>
                        </div>
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Sind meine Daten sicher?</h4>
                            <p>Ja. Die Übermittlung erfolgt über gesicherte DATEV-Infrastruktur.</p>
                        </div>
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Können Mitarbeiter ihre Abrechnungen selbst abrufen?</h4>
                            <p>Ja, optional über DATEV Arbeitnehmer online.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Styles specific to Payroll page */}
            <style>{`
        .payroll-hero {
            padding-top: 8rem;
            padding-bottom: 4rem;
            background: linear-gradient(135deg, var(--color-bg-light) 0%, #e2e8f0 100%);
        }
        
        .subheadline {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--color-primary);
            margin-bottom: 1.5rem;
        }

        .hero-text {
            max-width: 800px;
            margin: 0 auto 2rem;
            color: var(--color-text-muted);
        }

        .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 3rem;
        }

        .benefit-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background: var(--color-bg-light);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
        }

        .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .step-card {
            background: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            position: relative;
            overflow: hidden;
        }

        .step-number {
            font-size: 4rem;
            font-weight: 700;
            color: var(--color-accent);
            opacity: 0.1;
            position: absolute;
            top: -10px;
            right: 10px;
        }

        .step-card h3 {
            margin-bottom: 1rem;
            color: var(--color-primary);
        }

        .channels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .channel-card {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            transition: transform 0.3s ease;
        }

        .channel-card:hover {
            transform: translateY(-5px);
        }

        .channel-icon {
            color: var(--color-secondary);
            margin-bottom: 1.5rem;
        }

        .audience-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
        }

        .audience-tag {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .faq-item h4 {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--color-primary);
        }
        
        .section-subtitle {
            max-width: 700px;
            margin: 0 auto 3rem;
            color: var(--color-text-muted);
        }

        .text-light {
            color: var(--color-text-light) !important;
        }
        
        .mb-lg {
            margin-bottom: var(--spacing-lg);
        }
        
        .bg-white {
            background-color: var(--color-bg-white);
        }
        
        .bg-light {
            background-color: var(--color-bg-light);
        }
        
        .bg-primary {
            background-color: var(--color-primary);
        }
      `}</style>
        </div>
    );
};

export default Payroll;
