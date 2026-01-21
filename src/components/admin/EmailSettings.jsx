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
          color: var(--color-secondary);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .settings-header {
          margin-bottom: var(--space-8);
        }

        .settings-header h1 {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-2);
          font-family: var(--font-heading);
        }

        .settings-header p {
          color: var(--color-text-muted);
          font-size: var(--text-lg);
        }

        .settings-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          margin-bottom: var(--space-8);
          border: 1px solid var(--color-border);
        }

        .card-header {
          background: var(--gradient-primary);
          color: white;
          padding: var(--space-8);
          display: flex;
          gap: var(--space-6);
          align-items: flex-start;
        }

        .card-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          backdrop-filter: blur(10px);
        }

        .card-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.375rem;
          color: white;
          font-family: var(--font-heading);
        }

        .card-header p {
          opacity: 0.9;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
        }

        .card-body {
          padding: var(--space-8);
        }

        .info-alert {
          display: flex;
          gap: 1rem;
          background: var(--color-bg-subtle);
          border: 1px solid var(--color-border);
          color: var(--color-primary);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          line-height: 1.6;
        }

        .info-alert svg {
          flex-shrink: 0;
          margin-top: 0.125rem;
          color: var(--color-secondary);
        }

        .form-group {
          margin-bottom: var(--space-6);
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.8rem;
        }

        .input-with-icon {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 0 1.25rem;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .input-with-icon:focus-within {
          background: white;
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        .input-with-icon svg {
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        .input-with-icon input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 1rem 0;
          font-size: 1rem;
          color: var(--color-text-main);
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
          border-radius: var(--radius-lg);
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
          background: var(--gradient-accent);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-bounce);
          box-shadow: var(--shadow-md);
        }

        .save-btn:hover:not(:disabled) {
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          background: var(--color-text-muted);
          box-shadow: none;
        }

        .unsaved-changes {
          text-align: center;
          color: var(--color-cta);
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 1rem;
        }

        .info-section {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-sm);
        }

        .info-section h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
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
          color: var(--color-text-muted);
        }

        .info-section li::before {
          content: "→";
          color: var(--color-secondary);
          font-weight: 700;
          flex-shrink: 0;
        }

        .info-section strong {
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .settings-header h1 {
            font-size: 1.5rem;
          }

          .card-header {
            padding: 1.5rem;
            flex-direction: column;
            gap: 1rem;
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
