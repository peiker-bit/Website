import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { submitApplication } from '../lib/jobsClient';

const ApplicationForm = ({ job }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        privacyAccepted: false
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Bitte laden Sie Ihre Dokumente ausschließlich als PDF-Datei hoch.');
            e.target.value = null;
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Die Datei ist zu groß. Bitte laden Sie eine PDF-Datei mit maximal 5 MB hoch.');
            e.target.value = null;
            return;
        }

        setFile(file);
    };

    const removeFile = (setFile, inputId) => {
        setFile(null);
        const fileInput = document.getElementById(inputId);
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resumeFile) {
            setErrorMessage('Bitte laden Sie Ihren Lebenslauf hoch.');
            return;
        }

        if (!formData.privacyAccepted) {
            setErrorMessage('Bitte akzeptieren Sie die Datenschutzerklärung.');
            return;
        }

        try {
            setStatus('submitting');
            setErrorMessage('');

            await submitApplication({
                job_id: job.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                message: formData.message || null
            }, resumeFile);

            setStatus('success');
        } catch (error) {
            console.error('Error submitting application:', error);
            setStatus('error');
            setErrorMessage('Es gab einen Fehler bei der Übermittlung. Bitte versuchen Sie es später erneut.');
        }
    };

    if (status === 'success') {
        return (
            <div className="application-form-wrapper success-message">
                <CheckCircle size={48} className="success-icon" />
                <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: 'none' }}>Ihre Bewerbung war erfolgreich!</h3>
                <p>
                    Vielen Dank für Ihr Interesse. Wir haben Ihre Unterlagen erhalten und werden uns schnellstmöglich bei Ihnen melden.
                </p>
                <button
                    onClick={() => {
                        setStatus('idle');
                        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', privacyAccepted: false });
                        setResumeFile(null);
                    }}
                    className="btn btn-ghost"
                    style={{ marginTop: '1rem' }}
                >
                    Weitere Bewerbung absenden
                </button>
            </div>
        );
    }

    return (
        <div className="application-form-wrapper" id="application-form">
            <h3 className="section-title text-left" style={{ fontSize: '2rem' }}>Jetzt bewerben</h3>

            {status === 'error' && (
                <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                    <AlertCircle size={20} />
                    <p style={{ margin: 0 }}>{errorMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                    <div className="form-field">
                        <label htmlFor="firstName" className="app-label">Vorname *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="app-input"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="lastName" className="app-label">Nachname *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="app-input"
                        />
                    </div>
                </div>

                <div className="form-grid-2">
                    <div className="form-field">
                        <label htmlFor="email" className="app-label">E-Mail Adresse *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="app-input"
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="phone" className="app-label">Telefonnummer (optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="app-input"
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="message" className="app-label">Ihre Nachricht an uns (optional)</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="app-input"
                        style={{ resize: 'vertical' }}
                        placeholder="Warum möchten Sie Teil unseres Teams werden?"
                    ></textarea>
                </div>

                <div className="form-field">
                    <label className="app-label">Lebenslauf hochladen (Nur PDF, max. 5 MB) *</label>
                    <div className={`file-upload-area ${resumeFile ? 'has-file' : ''}`}>
                        {resumeFile ? (
                            <div>
                                <CheckCircle size={32} style={{ color: 'var(--color-secondary)', margin: '0 auto 1rem' }} />
                                <p className="file-upload-text">{resumeFile.name}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                                    ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removeFile(setResumeFile, 'resume-upload')}
                                    className="btn btn-ghost"
                                    style={{ color: '#ef4444' }}
                                >
                                    <X size={16} /> Datei entfernen
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Upload size={32} className="file-upload-icon" />
                                <div style={{ position: 'relative' }}>
                                    <label
                                        htmlFor="resume-upload"
                                        className="file-upload-text"
                                        style={{ cursor: 'pointer', display: 'inline-block' }}
                                    >
                                        Datei auswählen
                                        <input
                                            id="resume-upload"
                                            name="resume-upload"
                                            type="file"
                                            accept=".pdf"
                                            style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer' }}
                                            onChange={(e) => handleFileChange(e, setResumeFile)}
                                        />
                                    </label>
                                    <span> oder in dieses Feld ziehen</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                    PDF bis maximal 5MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="checkbox-row">
                    <input
                        id="privacy"
                        name="privacyAccepted"
                        type="checkbox"
                        required
                        checked={formData.privacyAccepted}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="privacy">
                        <strong>Datenschutzerklärung akzeptieren *</strong><br />
                        Ich erkläre mich damit einverstanden, dass meine Daten zur Bearbeitung meiner Bewerbung verarbeitet und gespeichert werden. Weitere Informationen finden Sie in der <a href="/datenschutz" target="_blank" style={{ color: 'var(--color-secondary)', textDecoration: 'underline' }}>Datenschutzerklärung</a>.
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="btn btn-primary btn-submit"
                        style={status === 'submitting' ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    >
                        {status === 'submitting' ? (
                            <><Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} /> Bewerbung wird gesendet...</>
                        ) : (
                            'Bewerbung absenden'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;
