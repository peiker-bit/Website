import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { getJobs } from '../lib/jobsClient';
import '../careers.css';

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchJobs = async () => {
            try {
                const data = await getJobs(false);
                setJobs(data || []);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const benefits = [
        {
            title: "Sicherer Arbeitsplatz",
            description: "Ein unbefristeter Vertrag in einer zukunftssicheren und krisenfesten Kanzlei."
        },
        {
            title: "Moderne digitale Kanzlei",
            description: "Ergonomische Arbeitsplätze, neueste Software (DATEV) und papierloses Arbeiten."
        },
        {
            title: "Flexible Arbeitszeiten",
            description: "Gleitzeit und die Möglichkeit für Home-Office zur besseren Work-Life-Balance."
        },
        {
            title: "Weiterbildung",
            description: "Wir fördern und finanzieren Ihre berufliche und persönliche Entwicklung aktiv."
        },
        {
            title: "Attraktive Vergütung",
            description: "Überdurchschnittliches Gehalt, BAV und viele steuerfreien Extras."
        },
        {
            title: "Wertschätzendes Team",
            description: "Ein familiäres, herzliches Umfeld, in dem Zusammenarbeit großgeschrieben wird."
        }
    ];

    return (
        <div className="careers-page">
            <Helmet>
                <title>Karriere & Stellenangebote | Steuerkanzlei</title>
                <meta name="description" content="Werden Sie Teil unseres Teams und gestalten Sie mit uns die Zukunft der steuerlichen Beratung. Aktuelle Stellenangebote und Karrieremöglichkeiten." />
            </Helmet>

            {/* Hero Section */}
            <section className="container">
                <div className="careers-hero animate-in">
                    <span className="careers-badge">Wir stellen ein</span>
                    <h1>Ihre Karriere bei uns</h1>
                    <p>
                        Werden Sie Teil unseres Teams und gestalten Sie mit uns die Zukunft der steuerlichen Beratung in einem modernen, digitalen Umfeld.
                    </p>
                    <a href="#open-positions" className="btn btn-primary">
                        Offene Stellen ansehen
                    </a>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="why-us-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Darum wir</h2>
                        <p>
                            Bei uns erwartet Sie nicht nur ein Job, sondern ein Umfeld, in dem Sie sich wohlfühlen und entfalten können.
                        </p>
                    </div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card">
                                <div className="benefit-icon">
                                    <CheckCircle2 size={24} />
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="open-positions" className="container">
                <div className="section-header">
                    <h2>Unsere offenen Stellen</h2>
                    <p>Wir wachsen und suchen Verstärkung. Ist die richtige Position für Sie dabei?</p>
                </div>

                <div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <p>Stellenangebote werden geladen...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="jobs-list">
                            {jobs.map((job) => (
                                <div key={job.id} className="job-card">
                                    <div className="job-card-main">
                                        <h3>
                                            <Link to={`/karriere/${job.slug}`}>{job.title}</Link>
                                        </h3>
                                        <div className="job-meta">
                                            {job.employment_type && (
                                                <div className="job-meta-item">
                                                    <Clock size={16} /> {job.employment_type}
                                                </div>
                                            )}
                                            {job.location && (
                                                <div className="job-meta-item">
                                                    <MapPin size={16} /> {job.location}
                                                </div>
                                            )}
                                        </div>
                                        <p className="job-description-teaser">
                                            {job.short_description || job.description?.substring(0, 150) + "..."}
                                        </p>
                                    </div>
                                    <div>
                                        <Link to={`/karriere/${job.slug}`} className="btn btn-outline" style={{ width: '100%' }}>
                                            Details ansehen <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-jobs-state">
                            <Briefcase size={48} style={{ color: '#cbd5e1', margin: '0 auto 1.5rem' }} />
                            <h3>Aktuell keine offenen Stellen</h3>
                            <p>
                                Derzeit haben wir leider keine vakanten Positionen zu besetzen.
                                Senden Sie uns aber gerne eine Initiativbewerbung über unser Kontaktformular.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Careers;
