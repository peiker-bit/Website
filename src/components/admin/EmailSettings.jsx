import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Save, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from './AdminLayout';

const EmailSettings = () => {
    const [notificationEmail, setNotificationEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_settings')
                .select('*')
                .eq('setting_key', 'notification_email')
                .single();

            if (error) {
                // If no row exists yet, use default
                if (error.code === 'PGRST116') {
                    setNotificationEmail('kontakt@peiker-Steuerberatung.de');
                    setOriginalEmail('kontakt@peiker-Steuerberatung.de');
                } else {
                    throw error;
                }
            } else {
                setNotificationEmail(data.setting_value);
                setOriginalEmail(data.setting_value);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setErrorMessage('Fehler beim Laden der Einstellungen.');
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSave = async () => {
        // Reset status
        setStatus('idle');
        setErrorMessage('');

        // Validate email
        if (!notificationEmail) {
            setErrorMessage('Bitte geben Sie eine E-Mail-Adresse ein.');
            setStatus('error');
            return;
        }

        if (!validateEmail(notificationEmail)) {
            setErrorMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            setStatus('error');
            return;
        }

        // Sanitize input (remove dangerous characters)
        const sanitizedEmail = notificationEmail.trim().toLowerCase();

        setSaving(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            // Upsert the setting
            const { error } = await supabase
                .from('admin_settings')
                .upsert({
                    setting_key: 'notification_email',
                    setting_value: sanitizedEmail,
                    updated_by: user?.id,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });

            if (error) throw error;

            setNotificationEmail(sanitizedEmail);
            setOriginalEmail(sanitizedEmail);
            setStatus('success');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setErrorMessage('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
            setStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = notificationEmail !== originalEmail;

    if (loading) {
        return (
            <AdminLayout>
                <div className="settings-loading">
                    <Loader2 size={48} className="spin-icon" />
                    <p>Einstellungen werden geladen...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="settings-container">
                <div className="settings-header">
                    <h1>Einstellungen</h1>
                    <p>Verwalten Sie die Konfiguration für Kontaktformular-Benachrichtigungen</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="settings-card"
                >
                    <div className="card-header">
                        <div className="card-icon">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h2>Benachrichtigungs-E-Mail</h2>
                            <p>Diese E-Mail-Adresse erhält Benachrichtigungen über neue Kontaktformular-Nachrichten</p>
                        </div>
                    </div>

                    <div className="card-body">
                        {/* Info Alert */}
                        <div className="info-alert">
                            <Info size={20} />
                            <div>
                                <strong>Wichtig:</strong> Stellen Sie sicher, dass diese E-Mail-Adresse in Microsoft Graph konfiguriert ist und Senderechte besitzt.
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="form-group">
                            <label htmlFor="notificationEmail">E-Mail-Adresse</label>
                            <div className="input-with-icon">
                                <Mail size={20} />
                                <input
                                    type="email"
                                    id="notificationEmail"
                                    value={notificationEmail}
                                    onChange={(e) => {
                                        setNotificationEmail(e.target.value);
                                        if (status === 'error') {
                                            setStatus('idle');
                                            setErrorMessage('');
                                        }
                                    }}
                                    placeholder="beispiel@domain.de"
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        {/* Status Messages */}
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="success-message"
                            >
                                <CheckCircle size={20} />
                                <span>Einstellungen erfolgreich gespeichert!</span>
                            </motion.div>
                        )}

                        {status === 'error' && errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="error-message"
                            >
                                <AlertCircle size={20} />
                                <span>{errorMessage}</span>
                            </motion.div>
                        )}

                        {/* Save Button */}
                        <motion.button
                            className="save-btn"
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            whileHover={{ scale: saving || !hasChanges ? 1 : 1.02 }}
                            whileTap={{ scale: saving || !hasChanges ? 1 : 0.98 }}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={20} className="spin-icon" />
                                    Wird gespeichert...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Änderungen speichern
                                </>
                            )}
                        </motion.button>

                        {hasChanges && !saving && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="unsaved-changes"
                            >
                                Sie haben ungespeicherte Änderungen
                            </motion.p>
                        )}
                    </div>
                </motion.div>

                {/* Additional Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="info-section"
                >
                    <h3>Wie funktioniert es?</h3>
                    <ul>
                        <li>
                            <strong>Automatische Benachrichtigungen:</strong> Wenn ein Besucher das Kontaktformular ausfüllt, wird die Nachricht in der Datenbank gespeichert und eine E-Mail-Benachrichtigung an die hier angegebene Adresse gesendet.
                        </li>
                        <li>
                            <strong>Microsoft Graph:</strong> Die E-Mails werden über Microsoft Graph API versendet. Stellen Sie sicher, dass die E-Mail-Adresse in Ihrem Microsoft 365-Konto existiert.
                        </li>
                        <li>
                            <strong>Sofortige Wirkung:</strong> Änderungen werden sofort wirksam. Die nächste Kontaktformular-Nachricht wird an die neue E-Mail-Adresse gesendet.
                        </li>
                    </ul>
                </motion.div>
            </div>

            <style>{`
        .settings-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .settings-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          min-height: 50vh;
        }

        .spin-icon {
          color: #3b82f6;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .settings-header {
          margin-bottom: 2rem;
        }

        .settings-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .settings-header p {
          color: #64748b;
          font-size: 1.05rem;
        }

        .settings-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .card-header {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .card-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.375rem;
        }

        .card-header p {
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .card-body {
          padding: 2rem;
        }

        .info-alert {
          display: flex;
          gap: 1rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .info-alert svg {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .input-with-icon {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 1.25rem;
          transition: all 0.3s;
        }

        .input-with-icon:focus-within {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-with-icon svg {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .input-with-icon input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 1rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .input-with-icon input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message,
        .error-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .success-message {
          background: #f0fdf4;
          border: 1px solid #86efac;
          color: #166534;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }

        .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1.125rem;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .save-btn:hover:not(:disabled) {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .unsaved-changes {
          text-align: center;
          color: #f59e0b;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 1rem;
        }

        .info-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .info-section h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .info-section ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .info-section li {
          display: flex;
          gap: 1rem;
          line-height: 1.6;
          color: #475569;
        }

        .info-section li::before {
          content: "→";
          color: #3b82f6;
          font-weight: 700;
          flex-shrink: 0;
        }

        .info-section strong {
          color: #1e293b;
        }

        @media (max-width: 768px) {
          .settings-header h1 {
            font-size: 1.5rem;
          }

          .card-header {
            padding: 1.5rem;
          }

          .card-header h2 {
            font-size: 1.25rem;
          }

          .card-body,
          .info-section {
            padding: 1.5rem;
          }
        }
      `}</style>
        </AdminLayout>
    );
};

export default EmailSettings;
