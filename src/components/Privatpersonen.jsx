import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle, Upload, Shield, Users, HelpCircle, FileText, Home, PieChart } from 'lucide-react';

const Privatpersonen = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="privatpersonen-page">
            {/* Hero Section */}
            <section className="hero section">
                <div className="container">
                    <div className="hero-content text-center">
                        <h1 className="fade-in">Steuererklärung für Privatpersonen – digital, sicher und persönlich</h1>
                        <p className="subheadline fade-in" style={{ animationDelay: '0.2s' }}>
                            Einkommensteuererklärungen mit Schwerpunkt Vermietung & Verpachtung – einfach online zusammenarbeiten.
                        </p>
                        <p className="hero-text fade-in" style={{ animationDelay: '0.4s' }}>
                            Wir unterstützen Privatpersonen bei der Erstellung ihrer Einkommensteuererklärung – insbesondere bei Einkünften aus Vermietung und Verpachtung.
                            Die Zusammenarbeit erfolgt digital über DATEV Meine Steuern, einen strukturierten Online-Fragebogen und ein persönliches Mandantenportal.
                        </p>
                        <div className="hero-actions fade-in" style={{ animationDelay: '0.6s' }}>
                            <a href="#contact" className="btn btn-primary">
                                Jetzt Steuererklärung digital vorbereiten <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </a>
                            <a href="#contact" className="btn btn-outline">
                                Persönlich beraten lassen
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro / Einkommensteuererklärung */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title text-center">Einkommensteuererklärung für Privatpersonen</h2>
                    <p className="section-subtitle text-center">
                        Die Einkommensteuererklärung ist für viele Privatpersonen mit Unsicherheit und Aufwand verbunden – insbesondere bei Immobilienvermietung.
                        Abschreibungen, Werbungskosten, Darlehen, Nebenkostenabrechnungen und Sonderfälle erfordern Erfahrung und Sorgfalt.
                    </p>
                    <p className="text-center" style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
                        Wir übernehmen die Erstellung Ihrer Einkommensteuererklärung und sorgen für eine korrekte, vollständige und nachvollziehbare Bearbeitung.
                    </p>
                </div>
            </section>

            {/* Focus: Vermietung & Verpachtung */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="section-title text-center">Schwerpunkt Vermietung & Verpachtung</h2>
                    <p className="section-subtitle text-center">
                        Ein besonderer Fokus liegt auf der steuerlichen Betreuung von Vermietern. Typische Themen sind:
                    </p>

                    <div className="benefits-grid">
                        {[
                            "Einnahmen aus Vermietung",
                            "Abschreibung (AfA)",
                            "Finanzierungskosten",
                            "Instandhaltungs- und Renovierungskosten",
                            "Nebenkostenabrechnungen",
                            "Kauf, Verkauf oder Übertragung von Immobilien"
                        ].map((topic, index) => (
                            <div key={index} className="benefit-card">
                                <Home className="text-secondary" size={24} />
                                <span>{topic}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-4" style={{ marginTop: '2rem', color: 'var(--color-text-muted)' }}>
                        Gerade hier ist eine saubere Dokumentation entscheidend – digital unterstützt und strukturiert.
                    </p>
                </div>
            </section>


            {/* How it works */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title text-center">So funktioniert die digitale Zusammenarbeit</h2>
                    <p className="section-subtitle text-center">
                        Der gesamte Ablauf ist transparent, klar strukturiert und auf Privatpersonen abgestimmt.
                    </p>
                    <div className="process-steps">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Online-Fragebogen für Neumandanten</h3>
                            <p>Zu Beginn erfassen Sie Ihre persönlichen und steuerlich relevanten Angaben über unseren Online-Fragebogen für Neumandanten.</p>
                            <ul className="step-list">
                                <li>persönliche Stammdaten</li>
                                <li>Angaben zur Immobilie / zu Immobilien</li>
                                <li>Einkünfte und Besonderheiten</li>
                                <li>Bankverbindungen</li>
                                <li>familiäre Verhältnisse</li>
                            </ul>
                            <p className="mt-2">Der Fragebogen ist verständlich aufgebaut und kann bequem online ausgefüllt werden.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Digitale Belegübermittlung mit DATEV Meine Steuern</h3>
                            <p>Für die laufende Zusammenarbeit nutzen wir DATEV Meine Steuern.</p>
                            <ul className="step-list">
                                <li>Belege digital hochladen</li>
                                <li>Unterlagen strukturiert einreichen</li>
                                <li>Rückfragen einfach beantworten</li>
                                <li>jederzeit den Überblick behalten</li>
                            </ul>
                            <p className="mt-2">Die Übermittlung erfolgt sicher über DATEV-Infrastruktur – ohne E-Mail-Anhänge oder Papier.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Mandantenportal für Stammdaten & Dokumente</h3>
                            <p>Zusätzlich steht Ihnen ein Onlineportal zur Verfügung, in dem Sie:</p>
                            <ul className="step-list">
                                <li>Ihre Stammdaten einsehen und aktualisieren</li>
                                <li>wichtige Dokumente zentral verwalten</li>
                                <li>steuerliche Unterlagen sicher ablegen</li>
                            </ul>
                            <p className="mt-2">So bleiben Ihre Daten aktuell und übersichtlich – auch über mehrere Jahre hinweg.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Erstellung & Übermittlung der Steuererklärung</h3>
                            <p>Auf Basis der übermittelten Angaben und Unterlagen erstellen wir Ihre Einkommensteuererklärung und übernehmen die elektronische Übermittlung an das Finanzamt.</p>
                            <p>Etwaige Rückfragen klären wir digital und transparent.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="section bg-light">
                <div className="container">
                    <h2 className="section-title text-center">Ihre Vorteile auf einen Blick</h2>
                    <div className="benefits-grid center-grid">
                        {[
                            "Digitale und sichere Zusammenarbeit",
                            "Klare Abläufe ohne Papier",
                            "Strukturierte Datenerfassung",
                            "Spezialisierung auf Vermietung & Verpachtung",
                            "Persönliche Betreuung"
                        ].map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                <CheckCircle className="text-secondary" size={24} />
                                <span>{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Target Audience */}
            <section className="section bg-primary text-light">
                <div className="container">
                    <h2 className="text-center text-light mb-lg">Für wen ist dieses Angebot geeignet?</h2>
                    <div className="audience-list text-center">
                        <span className="audience-tag">Privatpersonen</span>
                        <span className="audience-tag">Vermieter von Wohn- oder Gewerbeimmobilien</span>
                        <span className="audience-tag">Eigentümer mit einer oder mehreren Immobilien</span>
                        <span className="audience-tag">Steuerpflichtige ohne eigene Buchhaltungskenntnisse</span>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title text-center">Häufige Fragen</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Benötige ich DATEV-Kenntnisse?</h4>
                            <p>Nein. DATEV Meine Steuern ist mandantenfreundlich gestaltet. Wir unterstützen Sie bei der Einrichtung.</p>
                        </div>
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Kann ich meine Unterlagen auch mobil hochladen?</h4>
                            <p>Ja, der Zugriff ist auch über mobile Endgeräte möglich.</p>
                        </div>
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Wie sicher sind meine Daten?</h4>
                            <p>Die Datenübermittlung erfolgt über gesicherte DATEV-Systeme.</p>
                        </div>
                        <div className="faq-item">
                            <h4><HelpCircle size={20} className="text-accent" /> Kann ich meine Daten später ändern?</h4>
                            <p>Ja, Stammdaten können im Mandantenportal aktualisiert werden.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reuse Styles from Payroll page + specifics */}
            <style>{`
        .hero {
            padding-top: 10rem;
            padding-bottom: 6rem;
            background: var(--gradient-hero);
            position: relative;
        }
        
        .hero::before {
             content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
            background-size: 32px 32px;
            opacity: 0.4;
            pointer-events: none;
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

        .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .benefits-grid.center-grid {
             justify-content: center;
        }

        .benefit-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--color-border);
            transition: all var(--transition-normal);
        }
        
        .benefit-card:hover { 
            transform: translateY(-3px);
            box-shadow: var(--shadow-md);
            border-color: var(--color-accent-light);
        }
        
        .bg-light .benefit-card {
            background: white;
        }

        .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }

        .step-card {
            background: var(--color-bg-subtle);
            padding: 2.5rem;
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-sm);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--color-border);
            transition: all var(--transition-normal);
        }
        
        .step-card:hover {
            box-shadow: var(--shadow-xl);
            transform: translateY(-5px);
        }
        
        .bg-white .step-card {
             background: var(--color-bg-subtle);
        }

        .step-number {
             font-size: 5rem;
            font-weight: 800;
            color: var(--color-accent);
            opacity: 0.1;
            position: absolute;
            top: -10px;
            right: 10px;
            line-height: 1;
        }

        .step-card h3 {
            margin-bottom: 1rem;
            color: var(--color-primary);
            padding-right: 2rem;
            font-weight: 700;
        }
        
        .step-list {
            margin-top: 1rem;
            padding-left: 1.5rem;
            margin-bottom: 1rem;
            flex-grow: 1;
        }
        
        .step-list li {
            margin-bottom: 0.5rem;
            color: var(--color-text-muted);
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
            border-radius: var(--radius-full);
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
        }

        .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .faq-item {
             background: white;
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
        }

        .faq-item h4 {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 1.1rem;
            color: var(--color-primary);
            font-weight: 600;
        }

        .section-title {
            font-size: var(--text-4xl);
            margin-bottom: 1rem;
            color: var(--color-primary);
        }
        
        .section-subtitle {
            max-width: 700px;
            margin: 0 auto 3rem;
            color: var(--color-text-muted);
             font-size: 1.125rem;
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
            background-color: var(--color-bg-subtle);
        }
        
        .bg-primary {
             background-color: var(--color-primary);
            background-image: var(--gradient-primary);
        }
        
        /* Utility for top margin */
        .mt-4 { margin-top: 2rem; }
        .mt-2 { margin-top: 1rem; }
      `}</style>
        </div>
    );
};

export default Privatpersonen;
