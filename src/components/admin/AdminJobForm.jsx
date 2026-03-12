import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Save, Loader2, Briefcase, Eye,
    Settings, Target, Type, Link as LinkIcon,
    ListTree, Edit3, AlertCircle, CheckCircle
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getJobById, createJob, updateJob } from '../../lib/jobsClient';

const AdminJobForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        short_description: '',
        description: '',
        tasks: '',
        requirements: '',
        benefits: '',
        location: '',
        employment_type: '',
        start_date: '',
        salary: '',
        contact_person: '',
        contact_email: '',
        status: 'draft',
        sort_order: 0,
        seo_title: '',
        seo_description: ''
    });

    useEffect(() => {
        if (!isNew) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const job = await getJobById(id);
            if (job) {
                setFormData({
                    title: job.title || '',
                    slug: job.slug || '',
                    short_description: job.short_description || '',
                    description: job.description || '',
                    tasks: job.tasks || '',
                    requirements: job.requirements || '',
                    benefits: job.benefits || '',
                    location: job.location || '',
                    employment_type: job.employment_type || '',
                    start_date: job.start_date || '',
                    salary: job.salary || '',
                    contact_person: job.contact_person || '',
                    contact_email: job.contact_email || '',
                    status: job.status || 'draft',
                    sort_order: job.sort_order || 0,
                    seo_title: job.seo_title || '',
                    seo_description: job.seo_description || ''
                });
            }
        } catch (err) {
            console.error('Error fetching job details:', err);
            setError('Stellenangebot konnte nicht geladen werden.');
            setTimeout(() => navigate('/admin/jobs'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (name === 'title') {
                const slugified = value.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)+/g, '');
                if (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)+/g, '')) {
                    newData.slug = slugified;
                }
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!formData.title || !formData.slug) {
            setError('Bitte füllen Sie mindestens Titel und URL-Slug aus.');
            setActiveTab('general');
            setTimeout(() => setError(null), 5000);
            return;
        }

        try {
            setSaving(true);
            if (isNew) {
                await createJob(formData);
                setSuccessMsg('Stelle erfolgreich angelegt.');
                setTimeout(() => navigate('/admin/jobs'), 1500);
            } else {
                await updateJob(id, formData);
                setSuccessMsg('Stelle erfolgreich aktualisiert.');
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (err) {
            console.error('Error saving job:', err);
            setError('Fehler beim Speichern: ' + (err.message || 'Unbekannter Fehler'));
            setTimeout(() => setError(null), 5000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-container" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={48} className="spin-icon text-blue-500" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>Lade Stellendetails...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="settings-container" style={{ paddingBottom: '4rem' }}>
                <div className="settings-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <Link to="/admin/jobs" className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }}>
                                <ArrowLeft size={20} />
                            </Link>
                            <h1 style={{ margin: 0 }}>{isNew ? 'Neue Stelle anlegen' : 'Stelle bearbeiten'}</h1>
                        </div>
                        <p style={{ marginLeft: '3rem' }}>{formData.title ? formData.title : 'Details der Stellenanzeige konfigurieren.'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isNew && (
                            <a
                                href={`/karriere/${formData.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Eye size={18} /> Ansicht
                            </a>
                        )}
                        <button
                            onClick={handleSubmit}
                            className="btn-primary"
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer' }}
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                            Speichern
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="success-banner">
                        <CheckCircle size={20} />
                        {successMsg}
                    </div>
                )}

                <div className="tabs">
                    <button
                        type="button"
                        className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Settings size={18} /> Allgemein
                    </button>
                    <button
                        type="button"
                        className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Target size={18} /> Rahmenbedingungen
                    </button>
                    <button
                        type="button"
                        className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                        onClick={() => setActiveTab('content')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Type size={18} /> Texte & Inhalte
                    </button>
                    <button
                        type="button"
                        className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seo')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <LinkIcon size={18} /> Kontakt & SEO
                    </button>
                </div>

                <div className="tab-content">
                    {/* --- GENERAL TAB --- */}
                    {activeTab === 'general' && (
                        <div className="form-group-section">
                            <h2>Allgemeine Informationen</h2>
                            <p className="help-text">Grundlegende Daten für die Sichtbarkeit in der Tabelle.</p>

                            <div className="form-group">
                                <label>Jobtitel *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="z.B. Steuerfachangestellte/r (m/w/d)"
                                    required
                                    style={{ fontSize: '1.1rem', padding: '0.875rem 1rem' }}
                                />
                            </div>

                            <div className="input-row">
                                <div className="form-group">
                                    <label>URL-Slug *</label>
                                    <div style={{ display: 'flex' }}>
                                        <span style={{
                                            display: 'flex', alignItems: 'center', padding: '0 1rem',
                                            background: '#f1f5f9', border: '2px solid #e2e8f0',
                                            borderRight: 'none', borderTopLeftRadius: '10px',
                                            borderBottomLeftRadius: '10px', color: '#64748b', fontSize: '0.9rem'
                                        }}>
                                            /karriere/
                                        </span>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            placeholder="stellenname"
                                            required
                                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%', padding: '0.75rem 1rem', border: '2px solid #e2e8f0',
                                            borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit',
                                            backgroundColor: '#f8fafc', color: '#1e293b'
                                        }}
                                    >
                                        <option value="draft">Entwurf (Nicht sichtbar)</option>
                                        <option value="published">Veröffentlicht (Online)</option>
                                        <option value="inactive">Deaktiviert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Kurzbeschreibung (Teaser)</span>
                                    <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '0.8rem' }}>Wird in der Job-Übersicht angezeigt</span>
                                </label>
                                <textarea
                                    name="short_description"
                                    value={formData.short_description}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Eine kurze, knackige Zusammenfassung der Stelle (ca. 2-3 Sätze)..."
                                />
                            </div>
                        </div>
                    )}

                    {/* --- DETAILS TAB --- */}
                    {activeTab === 'details' && (
                        <div className="form-group-section">
                            <h2>Rahmenbedingungen</h2>
                            <p className="help-text">Eckdaten zum Arbeitsverhältnis, Standort und Gehalt.</p>

                            <div className="input-row">
                                <div className="form-group">
                                    <label>Arbeitszeitmodell</label>
                                    <input
                                        type="text"
                                        name="employment_type"
                                        value={formData.employment_type}
                                        onChange={handleChange}
                                        placeholder="z.B. Vollzeit / Teilzeit"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Standort</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="z.B. München"
                                    />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="form-group">
                                    <label>Eintrittstermin</label>
                                    <input
                                        type="text"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        placeholder="z.B. Ab sofort"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gehalt (Optional)</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        placeholder="z.B. Nach Vereinbarung"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CONTENT TAB --- */}
                    {activeTab === 'content' && (
                        <div className="form-group-section" style={{ paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h2>Texte & Inhalte</h2>
                                    <p className="help-text" style={{ marginBottom: '1rem' }}>Die detaillierte Beschreibung der Stelle für die Detailansicht.</p>
                                </div>
                                <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.85rem' }}>
                                    <strong>Tipp:</strong> Verwenden Sie "-" am Anfang einer Zeile für Aufzählungen.
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Hauptbeschreibung (Fließtext)</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Ein ausführlicher Einleitungstext für die Stelle..."
                                />
                            </div>

                            <div className="input-row">
                                <div className="form-group" style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: 0 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
                                        <ListTree size={16} /> Ihre Aufgaben
                                    </label>
                                    <textarea
                                        name="tasks"
                                        value={formData.tasks}
                                        onChange={handleChange}
                                        rows="8"
                                        placeholder="- Erstens&#10;- Zweitens"
                                        style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}
                                    />
                                </div>
                                <div className="form-group" style={{ background: '#fafafa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: 0 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
                                        <Edit3 size={16} /> Ihr Profil / Anforderungen
                                    </label>
                                    <textarea
                                        name="requirements"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                        rows="8"
                                        placeholder="- Qualifikation A&#10;- Erfahrung B"
                                        style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0', marginTop: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a' }}>
                                    <Target size={16} /> Wir bieten (Benefits)
                                </label>
                                <textarea
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="- 30 Tage Urlaub&#10;- Home-Office Möglichkeit"
                                    style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- SEO TAB --- */}
                    {activeTab === 'seo' && (
                        <>
                            <div className="form-group-section" style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Ansprechperson</h2>
                                <div className="input-row">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            name="contact_person"
                                            value={formData.contact_person}
                                            onChange={handleChange}
                                            placeholder="z.B. Max Mustermann"
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>E-Mail für Rückfragen (Optional)</label>
                                        <input
                                            type="email"
                                            name="contact_email"
                                            value={formData.contact_email}
                                            onChange={handleChange}
                                            placeholder="karriere@firma.de"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group-section" style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>SEO Optimierung</h2>
                                <div className="form-group">
                                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>SEO Titel (Meta Title)</span>
                                        <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '0.8rem' }}>Ideal: 50-60 Zeichen</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="seo_title"
                                        value={formData.seo_title}
                                        onChange={handleChange}
                                        placeholder="Titel für die Google-Suche (falls leer, wird Jobtitel verwendet)"
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>SEO Beschreibung (Meta Description)</span>
                                        <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '0.8rem' }}>Ideal: 150-160 Zeichen</span>
                                    </label>
                                    <textarea
                                        name="seo_description"
                                        value={formData.seo_description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Zusammenfassung des Inhalts für die Google-Suche"
                                    />
                                </div>
                            </div>

                            <div className="form-group-section">
                                <h2 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Sichtbarkeit & Ordnung</h2>
                                <div className="form-group" style={{ maxWidth: '300px', marginBottom: 0 }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Sortierung</span>
                                        <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '0.8rem' }}>Kleinere Zahl = weiter oben</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="sort_order"
                                        value={formData.sort_order}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Save button at bottom too for convenience */}
                <div className="actions-footer" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', marginTop: '1rem' }}>
                    <button
                        onClick={handleSubmit}
                        className="btn-primary large"
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1, cursor: saving ? 'wait' : 'pointer', padding: '0.8rem 2rem', fontSize: '1.05rem' }}
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Speichere...
                            </>
                        ) : (
                            <>
                                <Save size={18} /> Speichern
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                /* Base styling identical to TerminToolSettings */
                .settings-container { max-width: 1200px; margin: 0 auto; }
                .settings-header { margin-bottom: 2rem; }
                .settings-header h1 { font-size: 2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem; }
                .settings-header p { color: #64748b; }

                .error-banner, .success-banner { 
                    padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; gap: 0.5rem; align-items: center; 
                    font-weight: 500;
                }
                .error-banner { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
                .success-banner { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

                /* Mobile-friendly Tabs */
                .tabs { 
                    display: flex; gap: 0.5rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 5px;
                    scrollbar-width: none; /* Firefox */
                }
                .tabs::-webkit-scrollbar { display: none; } /* Chrome/Safari */

                .tab { 
                    padding: 0.75rem 1.5rem; background: white; border: 2px solid #e2e8f0; 
                    border-radius: 10px; cursor: pointer; font-weight: 600; color: #64748b; 
                    white-space: nowrap; transition: all 0.2s;
                    font-family: inherit; font-size: 0.95rem; display: flex; align-items: center;
                }
                .tab:hover { border-color: #cbd5e1; color: #475569; }
                .tab.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }

                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn-primary:hover { background: var(--color-primary-dark); }
                .btn-primary.large { padding: 0.8rem 2rem; font-size: 1.05rem; }
                
                .btn-secondary { padding: 0.6rem 1.2rem; background: white; border: 1px solid #cbd5e1; color: #475569; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-secondary:hover { background: #f1f5f9; border-color: #94a3b8; }

                /* Form Layout */
                .form-group-section { background: white; padding: 2rem; border-radius: 12px; border: 2px solid #e2e8f0; margin-bottom: 2rem; }
                .form-group-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-main); margin-top: 0; }
                .help-text { color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem; margin-top: 0; }
                
                .input-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155; font-size: 0.9rem; }
                .form-group input, .form-group textarea { 
                    width: 100%; padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; 
                    font-size: 0.95rem; font-family: inherit; transition: all 0.2s; color: #1e293b;
                    background: #f8fafc;
                }
                .form-group input:focus, .form-group textarea:focus { border-color: var(--color-primary); outline: none; background: white; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminJobForm;
