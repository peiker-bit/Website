import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader2, User, MapPin, FileText, Heart, Baby,
  Building2, Upload, Shield, Clock, Eye, EyeOff, Save,
  History, ScrollText, AlertCircle, CheckCircle, Trash2
} from 'lucide-react';
import {
  getSessionDetail, getSessionVersions, getSessionAuditLog,
  updateSessionStatus, addSessionNote, deleteSession, isFragebogenEnabled
} from '../../lib/fragebogenClient';
import AdminLayout from './AdminLayout';

const STATUS_MAP = {
  neu: { label: 'Neu', color: '#3b82f6', bg: '#eff6ff' },
  in_bearbeitung: { label: 'In Bearbeitung', color: '#f59e0b', bg: '#fffbeb' },
  erledigt: { label: 'Erledigt', color: '#10b981', bg: '#ecfdf5' },
};

// ─── Helper for rendering complex audit log values ───
const renderAuditValue = (val) => {
  if (val === null || val === undefined || val === '') return '–';
  if (typeof val === 'object') {
    if (Object.keys(val).length === 0) return Array.isArray(val) ? '[]' : '{}';
    return (
      <pre className="nd-audit-json">
        {JSON.stringify(val, null, 2)}
      </pre>
    );
  }
  return String(val);
};

// ─── Static Section Component (outside to prevent re-renders) ───
const Section = ({ icon: Icon, title, children, badge }) => (
  <div className="nd-section">
    <div className="nd-section-header">
      <div className="nd-section-title">
        <Icon size={20} />
        <span>{title}</span>
        {badge && <span className="nd-section-badge">{badge}</span>}
      </div>
    </div>
    <div className="nd-section-body">
      <div className="nd-section-content">{children}</div>
    </div>
  </div>
);

const NeumandentenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [versions, setVersions] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('daten');
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  // Sensitive field visibility
  const [showSensitive, setShowSensitive] = useState({});

  // Status management
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  // Notes
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getSessionDetail(id);
      setSession(result.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchVersions = useCallback(async () => {
    try {
      setVersionsLoading(true);
      const result = await getSessionVersions(id);
      setVersions(result.versions || []);
    } catch (err) {
      console.error('Error fetching versions:', err);
    } finally {
      setVersionsLoading(false);
    }
  }, [id]);

  const fetchAudit = useCallback(async () => {
    try {
      setAuditLoading(true);
      const result = await getSessionAuditLog(id);
      setAuditLog(result.auditLog || []);
    } catch (err) {
      console.error('Error fetching audit log:', err);
    } finally {
      setAuditLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isFragebogenEnabled) fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (activeTab === 'versionen' && versions.length === 0 && !versionsLoading) {
      fetchVersions();
    }
    if (activeTab === 'audit' && auditLog.length === 0 && !auditLoading) {
      fetchAudit();
    }
  }, [activeTab]);

  const toggleSensitive = (fieldKey) => {
    setShowSensitive(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusUpdating(true);
      await updateSessionStatus(id, newStatus);
      setSession(prev => ({ ...prev, admin_status: newStatus }));
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } catch (err) {
      alert(`Statusänderung fehlgeschlagen: ${err.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      setNoteSaving(true);
      const result = await addSessionNote(id, noteText.trim());
      setSession(prev => ({ ...prev, admin_notes: result.notes }));
      setNoteText('');
    } catch (err) {
      alert(`Notiz speichern fehlgeschlagen: ${err.message}`);
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDelete = async () => {
    const name = cp ? `${cp.first_name} ${cp.last_name}` : 'Unbekannt';
    if (!window.confirm(`Möchten Sie den Datensatz von "${name}" wirklich unwiderruflich löschen?\n\nAlle zugehörigen Daten werden ebenfalls gelöscht.`)) {
      return;
    }
    try {
      await deleteSession(id);
      navigate('/admin/neumandanten');
    } catch (err) {
      alert(`Fehler beim Löschen: ${err.message}`);
    }
  };

  const formatDate = (d) => {
    if (!d) return '–';
    return new Date(d).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderField = (label, value, isSensitive = false, fieldKey = '') => {
    if (value === null || value === undefined) return null;
    const displayValue = isSensitive && fieldKey && !showSensitive[fieldKey]
      ? '•••• ' + String(value).slice(-4)
      : value;

    return (
      <div className="nd-field">
        <span className="nd-field-label">{label}</span>
        <span className="nd-field-value">
          {displayValue}
          {isSensitive && fieldKey && (
            <button
              className="nd-unmask-btn"
              onClick={() => toggleSensitive(fieldKey)}
              title={showSensitive[fieldKey] ? 'Verbergen' : 'Anzeigen'}
            >
              {showSensitive[fieldKey] ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          )}
        </span>
      </div>
    );
  };

  // ─── Render helpers ──────────────────────────────────────────
  const cp = session?.client_person;
  const addr = session?.address;
  const tax = session?.tax_data;
  const fam = session?.family_data;
  const spouse = session?.spouse;
  const children = session?.children || [];
  const biz = session?.business_data;
  const uploads = session?.uploads || [];
  const consents = session?.consents;

  const maritalMap = {
    SINGLE: 'Ledig', MARRIED: 'Verheiratet', DIVORCED: 'Geschieden',
    WIDOWED: 'Verwitwet', SEPARATED: 'Getrennt lebend',
    REGISTERED_PARTNERSHIP: 'Eingetragene Lebenspartnerschaft'
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="nd-loading">
          <Loader2 size={48} className="nd-spin" />
          <p>Datensatz wird geladen...</p>
        </div>
        <style>{styles}</style>
      </AdminLayout>
    );
  }

  if (error || !session) {
    return (
      <AdminLayout>
        <div className="nd-error-container">
          <AlertCircle size={48} />
          <h3>Fehler beim Laden</h3>
          <p>{error || 'Datensatz nicht gefunden.'}</p>
          <Link to="/admin/neumandanten" className="nd-back-link">
            <ArrowLeft size={16} /> Zurück zur Übersicht
          </Link>
        </div>
        <style>{styles}</style>
      </AdminLayout>
    );
  }

  const statusInfo = STATUS_MAP[session.admin_status] || STATUS_MAP.neu;

  return (
    <AdminLayout>
      <div className="nd-container">
        {/* Top bar */}
        <div className="nd-topbar">
          <Link to="/admin/neumandanten" className="nd-back-link">
            <ArrowLeft size={18} />
            Zurück zur Übersicht
          </Link>
          <div className="nd-topbar-right">
            <span className="nd-admin-status" style={{ color: statusInfo.color, background: statusInfo.bg }}>
              {statusInfo.label}
            </span>
            <select
              className="nd-status-select"
              value={session.admin_status || 'neu'}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusUpdating}
            >
              <option value="neu">Neu</option>
              <option value="in_bearbeitung">In Bearbeitung</option>
              <option value="erledigt">Erledigt</option>
            </select>
            {statusSuccess && <CheckCircle size={20} className="nd-status-ok" />}
            <button className="nd-delete-btn" onClick={handleDelete} title="Datensatz löschen">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="nd-detail-header">
          <h1>{cp ? `${cp.first_name} ${cp.last_name}` : 'Unbekannt'}</h1>
          <div className="nd-header-meta">
            <span>Typ: <strong>{session.type === 'PRIVATE' ? 'Privatperson' : session.type === 'SOLE' ? 'Einzelunternehmen' : 'Unternehmen'}</strong></span>
            <span>Eingang: <strong>{formatDate(session.created_at)}</strong></span>
            <span>Version: <strong>{session.current_version || 1}</strong></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="nd-tabs">
          <button className={`nd-tab ${activeTab === 'daten' ? 'active' : ''}`} onClick={() => setActiveTab('daten')}>
            <FileText size={16} /> Daten
          </button>
          <button className={`nd-tab ${activeTab === 'versionen' ? 'active' : ''}`} onClick={() => setActiveTab('versionen')}>
            <History size={16} /> Versionen
          </button>
          <button className={`nd-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            <ScrollText size={16} /> Audit-Log
          </button>
        </div>

        {/* Data Tab */}
        {activeTab === 'daten' && (
          <div className="nd-data-content">
            {/* Stammdaten */}
            {cp && (
              <Section icon={User} title="Stammdaten">
                <div className="nd-field-grid">
                  {renderField('Anrede', cp.salutation === 'HERR' ? 'Herr' : cp.salutation === 'FRAU' ? 'Frau' : cp.salutation)}
                  {renderField('Vorname', cp.first_name)}
                  {renderField('Nachname', cp.last_name)}
                  {renderField('Geburtsdatum', cp.birth_date ? new Date(cp.birth_date).toLocaleDateString('de-DE') : null)}
                  {renderField('Geburtsort', cp.birth_place)}
                  {renderField('Staatsangehörigkeit', cp.nationality)}
                </div>
              </Section>
            )}

            {/* Kontakt */}
            {cp && (
              <Section icon={User} title="Kontaktdaten">
                <div className="nd-field-grid">
                  {renderField('E-Mail', cp.email)}
                  {renderField('Telefon', cp.phone)}
                  {renderField('Kontaktpräferenz', cp.contact_preference)}
                </div>
              </Section>
            )}

            {/* Adresse */}
            {addr && (
              <Section icon={MapPin} title="Adresse">
                <div className="nd-field-grid">
                  {renderField('Straße', addr.street)}
                  {renderField('Hausnummer', addr.house_number)}
                  {renderField('PLZ', addr.zip_code)}
                  {renderField('Ort', addr.city)}
                  {renderField('Land', addr.country || 'Deutschland')}
                  {addr.has_different_postal && (
                    <>
                      <div className="nd-field-separator">Postanschrift</div>
                      {renderField('Straße (Post)', addr.postal_street)}
                      {renderField('Hausnr. (Post)', addr.postal_house_number)}
                      {renderField('PLZ (Post)', addr.postal_zip_code)}
                      {renderField('Ort (Post)', addr.postal_city)}
                    </>
                  )}
                </div>
              </Section>
            )}

            {/* Steuerangaben */}
            {tax && (
              <Section icon={FileText} title="Steuerangaben">
                <div className="nd-field-grid">
                  {renderField('Steuer-ID', tax.tax_id, true, 'tax_id')}
                  {renderField('Steuernummer', tax.tax_number, true, 'tax_number')}
                  {renderField('Finanzamt', tax.tax_office)}
                  {renderField('Steuerklasse', tax.tax_class)}
                </div>
              </Section>
            )}

            {/* Familie */}
            {fam && (
              <Section icon={Heart} title="Familienstand">
                <div className="nd-field-grid">
                  {renderField('Familienstand', maritalMap[fam.marital_status] || fam.marital_status)}
                  {renderField('Seit', fam.marital_since ? new Date(fam.marital_since).toLocaleDateString('de-DE') : null)}
                  {renderField('Ehepartner einbezogen', fam.spouse_included ? 'Ja' : 'Nein')}
                </div>
              </Section>
            )}

            {/* Ehepartner */}
            {spouse && (
              <Section icon={Heart} title="Ehepartner">
                <div className="nd-field-grid">
                  {renderField('Vorname', spouse.first_name)}
                  {renderField('Nachname', spouse.last_name)}
                  {renderField('Geburtsdatum', spouse.birth_date ? new Date(spouse.birth_date).toLocaleDateString('de-DE') : null)}
                  {renderField('Steuer-ID', spouse.tax_id, true, 'spouse_tax_id')}
                  {renderField('E-Mail', spouse.email)}
                  {renderField('Telefon', spouse.phone)}
                </div>
              </Section>
            )}

            {/* Kinder */}
            {children.length > 0 && (
              <Section icon={Baby} title="Kinder" badge={children.length}>
                {children.map((child, i) => (
                  <div key={child.id || i} className="nd-child-card">
                    <h4>Kind {i + 1}</h4>
                    <div className="nd-field-grid">
                      {renderField('Vorname', child.first_name)}
                      {renderField('Nachname', child.last_name)}
                      {renderField('Geburtsdatum', child.birth_date ? new Date(child.birth_date).toLocaleDateString('de-DE') : null)}
                      {renderField('Steuer-ID', child.tax_id, true, `child_${i}_tax_id`)}
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Unternehmen */}
            {biz && (
              <Section icon={Building2} title="Unternehmensdaten">
                <div className="nd-field-grid">
                  {renderField('Firma', biz.company_name)}
                  {renderField('Rechtsform', biz.legal_form)}
                  {renderField('Branche', biz.industry)}
                  {renderField('USt-IdNr.', biz.vat_id, true, 'vat_id')}
                  {renderField('GewerbestNr.', biz.business_tax_number, true, 'biz_tax')}
                  {renderField('Gründungsdatum', biz.founding_date ? new Date(biz.founding_date).toLocaleDateString('de-DE') : null)}
                </div>
              </Section>
            )}

            {/* Dokumente */}
            {uploads.length > 0 && (
              <Section icon={Upload} title="Dokumente" badge={uploads.length}>
                <div className="nd-uploads-list">
                  {uploads.map((file) => (
                    <div key={file.id} className="nd-upload-item">
                      <FileText size={18} />
                      <div className="nd-upload-info">
                        <span className="nd-upload-name">{file.original_name}</span>
                        <span className="nd-upload-meta">
                          {file.mime_type} · {(file.size_bytes / 1024).toFixed(1)} KB
                          {file.scan_result && ` · Scan: ${file.scan_result}`}
                        </span>
                      </div>
                      <span className="nd-upload-date">{formatDate(file.created_at)}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Einwilligungen */}
            {consents && (
              <Section icon={Shield} title="Einwilligungen">
                <div className="nd-field-grid">
                  {renderField('Datenschutz', consents.privacy_accepted ? '✅ Akzeptiert' : '❌ Nicht akzeptiert')}
                  {renderField('Widerruf', consents.revocation_acknowledged ? '✅ Zur Kenntnis genommen' : '❌')}
                  {renderField('AGBs', consents.terms_accepted ? '✅ Akzeptiert' : '❌')}
                  {renderField('Zeitpunkt', formatDate(consents.created_at))}
                </div>
              </Section>
            )}

            {/* Metadaten */}
            <Section icon={Clock} title="Metadaten">
              <div className="nd-field-grid">
                {renderField('Session-ID', session.id)}
                {renderField('Status (Fragebogen)', session.status)}
                {renderField('Erstellt', formatDate(session.created_at))}
                {renderField('Geändert', formatDate(session.updated_at))}
                {renderField('Eingereicht', formatDate(session.submitted_at))}
                {renderField('Version', session.current_version)}
              </div>
            </Section>

            {/* Interne Notizen */}
            <Section icon={FileText} title="Interne Notizen (Admin)">
              {session.admin_notes && (
                <div className="nd-notes-display">
                  {session.admin_notes.split('\n---\n').map((note, i) => (
                    <div key={i} className="nd-note-entry">{note}</div>
                  ))}
                </div>
              )}
              <div className="nd-note-input-row">
                <textarea
                  className="nd-note-textarea"
                  placeholder="Neue Notiz hinzufügen..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={3}
                />
                <button
                  className="nd-btn nd-btn-primary"
                  onClick={handleAddNote}
                  disabled={noteSaving || !noteText.trim()}
                >
                  {noteSaving ? <Loader2 size={16} className="nd-spin" /> : <Save size={16} />}
                  Speichern
                </button>
              </div>
            </Section>
          </div>
        )}

        {/* Versionen Tab */}
        {activeTab === 'versionen' && (
          <div className="nd-tab-content">
            {versionsLoading ? (
              <div className="nd-loading-small"><Loader2 size={24} className="nd-spin" /> Versionen laden...</div>
            ) : versions.length === 0 ? (
              <div className="nd-empty-tab">
                <History size={48} />
                <p>Keine Versionierung vorhanden.</p>
              </div>
            ) : (
              <div className="nd-versions-list">
                {versions.map((v) => (
                  <div key={v.id} className="nd-version-card">
                    <div className="nd-version-number">V{v.version_number}</div>
                    <div className="nd-version-info">
                      <span className="nd-version-date">{formatDate(v.created_at)}</span>
                      <span className="nd-version-source">Quelle: {v.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && (
          <div className="nd-tab-content">
            {auditLoading ? (
              <div className="nd-loading-small"><Loader2 size={24} className="nd-spin" /> Audit-Log laden...</div>
            ) : auditLog.length === 0 ? (
              <div className="nd-empty-tab">
                <ScrollText size={48} />
                <p>Keine Änderungsprotokolle vorhanden.</p>
              </div>
            ) : (
              <div className="nd-audit-list">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="nd-audit-entry">
                    <div className="nd-audit-header">
                      <span className="nd-audit-time">{formatDate(entry.created_at)}</span>
                      <span className="nd-audit-user">{entry.user_type}</span>
                      <span className="nd-audit-version">V{entry.version_number}</span>
                    </div>
                    {entry.changed_fields && (
                      <div className="nd-audit-changes">
                        {Object.entries(entry.changed_fields).map(([field, change]) => (
                          <div key={field} className="nd-audit-field">
                            <div className="nd-audit-field-header">
                              <code>{field}</code>
                            </div>
                            {typeof change === 'object' && change !== null && ('old' in change || 'new' in change) ? (
                              <div className="nd-audit-diff">
                                <div className="nd-audit-diff-row">
                                  <span className="nd-audit-diff-label">Vorher:</span>
                                  {renderAuditValue(change.old)}
                                </div>
                                <div className="nd-audit-diff-row">
                                  <span className="nd-audit-diff-label">Nachher:</span>
                                  {renderAuditValue(change.new)}
                                </div>
                              </div>
                            ) : (
                              <div className="nd-audit-diff-row">
                                {renderAuditValue(change)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <style>{styles}</style>
    </AdminLayout>
  );
};

const styles = `
  .nd-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .nd-loading, .nd-error-container {
    text-align: center;
    padding: 4rem 2rem;
    color: #94a3b8;
  }
  .nd-loading svg, .nd-error-container svg {
    margin-bottom: 1rem;
    opacity: 0.3;
  }
  .nd-spin {
    color: #3b82f6;
    animation: nd-spin 1s linear infinite;
  }
  @keyframes nd-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Top bar */
  .nd-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nd-back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: #64748b;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.2s;
  }
  .nd-back-link:hover { color: #3b82f6; }

  .nd-topbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nd-admin-status {
    padding: 0.3rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .nd-status-select {
    padding: 0.5rem 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.85rem;
    background: white;
    cursor: pointer;
  }
  .nd-status-select:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .nd-status-ok {
    color: #10b981;
    animation: nd-fade 2s ease forwards;
  }
  @keyframes nd-fade {
    0%,80% { opacity: 1; }
    100% { opacity: 0; }
  }

  .nd-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1.5px solid #e2e8f0;
    background: white;
    color: #94a3b8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nd-delete-btn:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #ef4444;
  }

  /* Header */
  .nd-detail-header {
    margin-bottom: 1.5rem;
  }
  .nd-detail-header h1 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }
  .nd-header-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    color: #64748b;
    font-size: 0.9rem;
  }
  .nd-header-meta strong {
    color: #334155;
  }

  /* Tabs */
  .nd-tabs {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0;
  }

  .nd-tab {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.75rem 1.25rem;
    background: none;
    border: none;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    font-size: 0.9rem;
    position: relative;
    transition: color 0.2s;
  }
  .nd-tab::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent;
    transition: background 0.2s;
  }
  .nd-tab:hover { color: #3b82f6; }
  .nd-tab.active {
    color: #3b82f6;
  }
  .nd-tab.active::after {
    background: #3b82f6;
  }

  /* Sections */
  .nd-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    margin-bottom: 0.75rem;
    overflow: hidden;
  }

  .nd-section-header {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
  }

  .nd-section-title {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }
  .nd-section-title svg {
    color: #3b82f6;
  }

  .nd-section-badge {
    background: #eff6ff;
    color: #3b82f6;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    border-radius: 10px;
    font-weight: 700;
  }

  .nd-section-body {
    overflow: hidden;
  }

  .nd-section-content {
    padding: 0 1.25rem 1.25rem;
  }

  /* Fields */
  .nd-field-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .nd-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nd-field-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .nd-field-value {
    font-size: 0.95rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nd-field-separator {
    grid-column: 1 / -1;
    font-size: 0.8rem;
    font-weight: 700;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }

  .nd-unmask-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.125rem;
    display: flex;
    transition: color 0.2s;
  }
  .nd-unmask-btn:hover { color: #3b82f6; }

  /* Children cards */
  .nd-child-card {
    padding: 1rem;
    background: #f8fafc;
    border-radius: 10px;
    margin-bottom: 0.75rem;
  }
  .nd-child-card h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #475569;
    margin-bottom: 0.75rem;
  }

  /* Uploads */
  .nd-uploads-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .nd-upload-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border-radius: 10px;
  }
  .nd-upload-item svg { color: #3b82f6; flex-shrink: 0; }
  .nd-upload-info { flex: 1; }
  .nd-upload-name {
    display: block;
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }
  .nd-upload-meta {
    font-size: 0.8rem;
    color: #94a3b8;
  }
  .nd-upload-date {
    font-size: 0.8rem;
    color: #64748b;
    white-space: nowrap;
  }

  /* Notes */
  .nd-notes-display {
    margin-bottom: 1rem;
  }
  .nd-note-entry {
    padding: 0.75rem 1rem;
    background: #fffbeb;
    border-left: 3px solid #f59e0b;
    border-radius: 0 8px 8px 0;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #1e293b;
    white-space: pre-wrap;
  }

  .nd-note-input-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .nd-note-textarea {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;
    resize: vertical;
    font-family: inherit;
  }
  .nd-note-textarea:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .nd-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .nd-btn-primary {
    background: #3b82f6;
    color: white;
  }
  .nd-btn-primary:hover { background: #2563eb; }
  .nd-btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Versions */
  .nd-tab-content {
    min-height: 200px;
  }

  .nd-loading-small {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #64748b;
    padding: 2rem;
    justify-content: center;
  }

  .nd-empty-tab {
    text-align: center;
    padding: 3rem 2rem;
    color: #94a3b8;
  }
  .nd-empty-tab svg {
    margin-bottom: 0.75rem;
    opacity: 0.3;
  }

  .nd-versions-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nd-version-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  .nd-version-number {
    width: 48px;
    height: 48px;
    background: #eff6ff;
    color: #3b82f6;
    font-weight: 800;
    font-size: 1rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nd-version-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  .nd-version-date {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
  }
  .nd-version-source {
    font-size: 0.85rem;
    color: #94a3b8;
  }

  /* Audit */
  .nd-audit-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nd-audit-entry {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem 1.25rem;
  }

  .nd-audit-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }
  .nd-audit-time {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }
  .nd-audit-user {
    background: #f1f5f9;
    color: #64748b;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  .nd-audit-version {
    color: #3b82f6;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .nd-audit-changes {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #f1f5f9;
  }
  .nd-audit-field {
    font-size: 0.85rem;
    color: #475569;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f8fafc;
  }
  .nd-audit-field:last-child {
    border-bottom: none;
  }
  .nd-audit-field-header {
    margin-bottom: 0.5rem;
  }
  .nd-audit-field-header code {
    background: #f1f5f9;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #0f172a;
  }
  .nd-audit-diff {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 0.25rem;
  }
  .nd-audit-diff-row {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .nd-audit-diff-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
  }
  .nd-audit-json {
    margin: 0;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.75rem;
    color: #334155;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  @media (max-width: 768px) {
    .nd-audit-diff {
      grid-template-columns: 1fr;
    }
    .nd-field-grid {
      grid-template-columns: 1fr;
    }
    .nd-topbar {
      flex-direction: column;
      align-items: flex-start;
    }
    .nd-header-meta {
      flex-direction: column;
      gap: 0.25rem;
    }
    .nd-note-input-row {
      flex-direction: column;
    }
  }
`;

export default NeumandentenDetail;
