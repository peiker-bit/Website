import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, MapPin, Euro, Calendar as CalendarIcon, Loader2, Check } from 'lucide-react';
import { getJobBySlug } from '../lib/jobsClient';
import ApplicationForm from './ApplicationForm';
import '../careers.css';

const JobDetail = () => {
    const { slug } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchJob = async () => {
            try {
                const data = await getJobBySlug(slug);
                if (data && data.status === 'published') {
                    setJob(data);
                } else {
                    setJob(null);
                }
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [slug]);

    if (loading) {
        return (
            <div className="job-detail-page container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 size={48} className="spin-icon" style={{ color: 'var(--color-secondary)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                <p>Stellendetails werden geladen...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="job-detail-page container" style={{ textAlign: 'center', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Stelle nicht gefunden</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Das gesuchte Stellenangebot existiert leider nicht oder wurde in der Zwischenzeit besetzt.
                </p>
                <Link to="/karriere" className="btn btn-primary">Zurück zur Karriere-Übersicht</Link>
            </div>
        );
    }

    const parseList = (text) => {
        if (!text) return [];
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.startsWith('-') ? line.substring(1).trim() : line);
    };

    const tasksList = parseList(job.tasks);
    const requirementsList = parseList(job.requirements);
    const benefitsList = parseList(job.benefits);

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description || job.short_description,
        "identifier": {
            "@type": "PropertyValue",
            "name": "Peiker Steuerberatung",
            "value": job.slug
        },
        "datePosted": new Date(job.created_at).toISOString().split('T')[0],
        "employmentType": job.employment_type?.includes('Teilzeit') ? ["FULL_TIME", "PART_TIME"] : "FULL_TIME",
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location || "Berlin",
                "addressCountry": "DE"
            }
        }
    };

    return (
        <div className="job-detail-page">
            <Helmet>
                <title>{job.seo_title || `${job.title} | Karriere`}</title>
                <meta name="description" content={job.seo_description || job.short_description || `Bewerben Sie sich als ${job.title} bei unserer Kanzlei.`} />
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            <div className="container" style={{ maxWidth: '1100px' }}>
                <Link to="/karriere" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '2rem' }}>
                    <ArrowLeft size={20} />
                    Zurück zur Übersicht
                </Link>

                {/* Header Card */}
                <div className="job-detail-header-card">
                    <div>
                        <h1 className="job-detail-title">{job.title}</h1>
                        <div className="job-detail-meta">
                            {job.employment_type && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                    <Clock size={20} style={{ color: 'var(--color-secondary)' }} /> {job.employment_type}
                                </div>
                            )}
                            {job.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                                    <MapPin size={20} style={{ color: 'var(--color-secondary)' }} /> {job.location}
                                </div>
                            )}
                            {job.start_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                                    <CalendarIcon size={20} style={{ color: 'var(--color-secondary)' }} /> {job.start_date}
                                </div>
                            )}
                            {job.salary && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                                    <Euro size={20} style={{ color: 'var(--color-secondary)' }} /> {job.salary}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                        <a href="#application-form" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                            Jetzt bewerben
                        </a>
                    </div>
                </div>

                <div className="job-detail-grid">
                    {/* Main Content */}
                    <div className="job-content-card">
                        <div className="job-content-section">
                            <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.125rem', color: 'var(--color-text-main)', lineHeight: 1.8 }}>
                                {job.description}
                            </p>
                        </div>

                        {tasksList.length > 0 && (
                            <div className="job-content-section">
                                <h3 className="job-content-title">
                                    <div className="title-accent-bar"></div>
                                    Ihre Aufgaben
                                </h3>
                                <ul className="job-list-content">
                                    {tasksList.map((task, idx) => (
                                        <li key={idx} className="job-list-item">
                                            <Check className="job-list-icon" style={{ color: 'var(--color-secondary)' }} size={20} />
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {requirementsList.length > 0 && (
                            <div className="job-content-section">
                                <h3 className="job-content-title">
                                    <div className="title-accent-bar"></div>
                                    Ihr Profil
                                </h3>
                                <ul className="job-list-content">
                                    {requirementsList.map((req, idx) => (
                                        <li key={idx} className="job-list-item">
                                            <Check className="job-list-icon" style={{ color: 'var(--color-secondary)' }} size={20} />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {benefitsList.length > 0 && (
                            <div className="job-content-section">
                                <h3 className="job-content-title">
                                    <div className="title-accent-bar"></div>
                                    Wir bieten Ihnen
                                </h3>
                                <ul className="job-list-content">
                                    {benefitsList.map((benefit, idx) => (
                                        <li key={idx} className="job-list-item">
                                            <Check className="job-list-icon" style={{ color: 'var(--color-success)' }} size={20} />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="contact-sidebar-card">
                            <h3>Haben Sie Fragen?</h3>
                            <p>Gerne beantworten wir Ihre offenen Fragen zu dieser Position.</p>

                            <div style={{ marginTop: '1.5rem', fontWeight: 500 }}>
                                {job.contact_person && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>Ihre Ansprechperson:</span>
                                        {job.contact_person}
                                    </div>
                                )}
                                {job.contact_email && (
                                    <a href={`mailto:${job.contact_email}`} className="btn-white-outline">
                                        E-Mail schreiben
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Form */}
                <ApplicationForm job={job} />
            </div>
        </div>
    );
};

export default JobDetail;
