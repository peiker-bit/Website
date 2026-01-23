import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Plus, Trash2, Save, Edit2, X,
    CheckCircle, AlertCircle, Loader2, StopCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import {
    getAppointmentTypes, createAppointmentType, updateAppointmentType, deleteAppointmentType,
    getBookingSettings, updateBookingSettings,
    getBlockedPeriods, addBlockedPeriod, deleteBlockedPeriod,
    reorderAppointmentTypes
} from '../../lib/bookingClient';

const TerminToolSettings = () => {
    const [activeTab, setActiveTab] = useState('types'); // types, availability, blocked
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    // Data States
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [settings, setSettings] = useState({
        buffer_minutes: 15,
        available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        min_booking_notice_hours: 24,
        max_booking_future_days: 60
    });
    const [blockedPeriods, setBlockedPeriods] = useState([]);

    // Modal States
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null); // null = create new
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [reordering, setReordering] = useState(false);

    // Form States
    const [typeForm, setTypeForm] = useState({ name: '', duration_minutes: 30, description: '', price: 0, is_active: true });
    const [blockForm, setBlockForm] = useState({ start_date: '', end_date: '', reason: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [types, settingsData, blocks] = await Promise.all([
                getAppointmentTypes(),
                getBookingSettings(),
                getBlockedPeriods()
            ]);

            setAppointmentTypes(types || []);
            if (settingsData) setSettings(settingsData);
            setBlockedPeriods(blocks || []);
        } catch (err) {
            console.error(err);
            setError("Fehler beim Laden der Daten. Bitte stellen Sie sicher, dass die Datenbank-Tabellen existieren.");
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // --- Type Handlers ---
    const handleSaveType = async (e) => {
        e.preventDefault();
        try {
            if (editingType) {
                await updateAppointmentType(editingType.id, typeForm);
                showSuccess("Terminart aktualisiert");
            } else {
                await createAppointmentType(typeForm);
                showSuccess("Terminart erstellt");
            }
            setIsTypeModalOpen(false);
            setEditingType(null);
            fetchData(); // Refresh list
        } catch (err) {
            alert("Fehler beim Speichern: " + err.message);
        }
    };

    const handleDeleteType = async (id) => {
        if (!window.confirm("Wirklich löschen?")) return;
        try {
            await deleteAppointmentType(id);
            showSuccess("Terminart gelöscht");
            fetchData();
        } catch (err) {
            alert("Fehler: " + err.message);
        }
    };

    const moveType = async (index, direction) => {
        if (reordering) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= appointmentTypes.length) return;

        const newTypes = [...appointmentTypes];
        const [movedType] = newTypes.splice(index, 1);
        newTypes.splice(newIndex, 0, movedType);

        setAppointmentTypes(newTypes); // Optimistic update
        setReordering(true);

        try {
            const orderedIds = newTypes.map(t => t.id);
            await reorderAppointmentTypes(orderedIds);
            // No need to show success message for every click, keep it fluid
        } catch (err) {
            console.error("Reorder failed", err);
            fetchData(); // Revert on error
            alert("Fehler beim Sortieren");
        } finally {
            setReordering(false);
        }
    };

    const openTypeModal = (type = null) => {
        if (type) {
            setEditingType(type);
            setTypeForm({
                name: type.name,
                duration_minutes: type.duration_minutes,
                description: type.description || '',
                price: type.price || 0,
                is_active: type.is_active
            });
        } else {
            setEditingType(null);
            setTypeForm({ name: '', duration_minutes: 30, description: '', price: 0, is_active: true });
        }
        setIsTypeModalOpen(true);
    };

    // --- Settings Handlers ---
    const weekDays = [
        { id: 'Monday', label: 'Montag' },
        { id: 'Tuesday', label: 'Dienstag' },
        { id: 'Wednesday', label: 'Mittwoch' },
        { id: 'Thursday', label: 'Donnerstag' },
        { id: 'Friday', label: 'Freitag' },
        { id: 'Saturday', label: 'Samstag' },
        { id: 'Sunday', label: 'Sonntag' },
    ];

    const toggleDay = (dayId) => {
        const current = settings.available_days || [];
        const updated = current.includes(dayId)
            ? current.filter(d => d !== dayId)
            : [...current, dayId];
        setSettings({ ...settings, available_days: updated });
    };

    const handleSaveSettings = async () => {
        try {
            await updateBookingSettings(settings);
            showSuccess("Einstellungen gespeichert");
        } catch (err) {
            alert("Fehler: " + err.message);
        }
    };

    // --- Block Handlers ---
    const handleSaveBlock = async (e) => {
        e.preventDefault();
        try {
            // Convert strings to dates or keep strings? Supabase expects proper timestamps usually, but input date is YYYY-MM-DD
            // Let's create proper ISO strings
            const start = new Date(blockForm.start_date).toISOString();
            const end = new Date(blockForm.end_date).toISOString();

            if (new Date(blockForm.start_date) > new Date(blockForm.end_date)) {
                alert("Enddatum muss nach Startdatum liegen.");
                return;
            }

            await addBlockedPeriod({
                start_date: start,
                end_date: end,
                reason: blockForm.reason
            });
            showSuccess("Blocker erstellt");
            setIsBlockModalOpen(false);
            setBlockForm({ start_date: '', end_date: '', reason: '' });
            fetchData();
        } catch (err) {
            alert("Fehler: " + err.message);
        }
    };

    const handleDeleteBlock = async (id) => {
        if (!window.confirm("Wirklich löschen?")) return;
        try {
            await deleteBlockedPeriod(id);
            showSuccess("Blocker gelöscht");
            fetchData();
        } catch (err) {
            alert("Fehler: " + err.message);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-container">
                    <Loader2 size={48} className="spin-icon" />
                    <p>Lade Termintool Daten...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="settings-container">
                <div className="settings-header">
                    <h1>Termintool Verwaltung</h1>
                    <p>Konfigurieren Sie Ihre Terminbuchung.</p>
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
                        className={`tab ${activeTab === 'types' ? 'active' : ''}`}
                        onClick={() => setActiveTab('types')}
                    >
                        Terminarten
                    </button>
                    <button
                        className={`tab ${activeTab === 'availability' ? 'active' : ''}`}
                        onClick={() => setActiveTab('availability')}
                    >
                        Verfügbarkeit & Einstellungen
                    </button>
                    <button
                        className={`tab ${activeTab === 'blocked' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blocked')}
                    >
                        Urlaub & Blocker
                    </button>
                </div>

                <div className="tab-content">
                    {/* --- APPOINTMENT TYPES --- */}
                    {activeTab === 'types' && (
                        <div className="types-section">
                            <div className="section-header">
                                <h2>Angebotene Terminarten</h2>
                                <button className="btn-primary" onClick={() => openTypeModal()}>
                                    <Plus size={18} /> Neu erstellen
                                </button>
                            </div>

                            <div className="types-grid">
                                {appointmentTypes.map((type, index) => (
                                    <div key={type.id} className="type-card">
                                        <div className="type-header">
                                            <h3>{type.name}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    className="btn-icon small"
                                                    onClick={() => moveType(index, 'up')}
                                                    disabled={index === 0 || reordering}
                                                    title="Nach oben verschieben"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    className="btn-icon small"
                                                    onClick={() => moveType(index, 'down')}
                                                    disabled={index === appointmentTypes.length - 1 || reordering}
                                                    title="Nach unten verschieben"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <span className={`status-badge ${type.is_active ? 'active' : 'inactive'}`}>
                                                {type.is_active ? 'Aktiv' : 'Inaktiv'}
                                            </span>
                                        </div>
                                        <div className="type-details">
                                            <p><Clock size={14} /> {type.duration_minutes} Minuten</p>
                                            {type.price > 0 && <p className="price">{type.price}€</p>}
                                        </div>
                                        <p className="type-desc">{type.description}</p>
                                        <div className="type-actions">
                                            <button className="btn-icon" onClick={() => openTypeModal(type)}>
                                                <Edit2 size={16} /> Bearbeiten
                                            </button>
                                            <button className="btn-icon delete" onClick={() => handleDeleteType(type.id)}>
                                                <Trash2 size={16} /> Löschen
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- AVAILABILITY --- */}
                    {activeTab === 'availability' && (
                        <div className="availability-section">
                            <div className="form-group-section">
                                <h2>Allgemeine Verfügbarkeit</h2>
                                <p className="help-text">An welchen Wochentagen sind Termine generell möglich?</p>
                                <div className="weekdays-grid">
                                    {weekDays.map(day => (
                                        <label key={day.id} className={`day-checkbox ${settings.available_days?.includes(day.id) ? 'checked' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={settings.available_days?.includes(day.id) || false}
                                                onChange={() => toggleDay(day.id)}
                                            />
                                            {day.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group-section">
                                <h2>Zeitregeln</h2>
                                <div className="input-row">
                                    <div className="form-group">
                                        <label>Pufferzeit zwischen Terminen (Minuten)</label>
                                        <input
                                            type="number"
                                            value={settings.buffer_minutes}
                                            onChange={(e) => setSettings({ ...settings, buffer_minutes: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Min. Vorlaufzeit für Buchung (Stunden)</label>
                                        <input
                                            type="number"
                                            value={settings.min_booking_notice_hours || 24}
                                            onChange={(e) => setSettings({ ...settings, min_booking_notice_hours: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max. Buchungsvorlauf (Tage)</label>
                                        <input
                                            type="number"
                                            value={settings.max_booking_future_days || 60}
                                            onChange={(e) => setSettings({ ...settings, max_booking_future_days: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="actions-footer">
                                <button className="btn-primary large" onClick={handleSaveSettings}>
                                    <Save size={18} /> Einstellungen speichern
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- BLOCKED PERIODS --- */}
                    {activeTab === 'blocked' && (
                        <div className="blocked-section">
                            <div className="section-header">
                                <h2>Urlaub & Abwesenheiten</h2>
                                <button className="btn-primary" onClick={() => setIsBlockModalOpen(true)}>
                                    <Plus size={18} /> Abwesenheit eintragen
                                </button>
                            </div>

                            <div className="blocked-list">
                                {blockedPeriods.length === 0 ? (
                                    <p className="empty-text">Keine Abwesenheiten eingetragen.</p>
                                ) : (
                                    blockedPeriods.map(block => (
                                        <div key={block.id} className="block-item">
                                            <div className="block-dates">
                                                <Calendar size={18} className="text-muted" />
                                                <span>{new Date(block.start_date).toLocaleDateString()}</span>
                                                <span className="arrow">→</span>
                                                <span>{new Date(block.end_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="block-reason">
                                                {block.reason || 'Kein Grund angegeben'}
                                            </div>
                                            <button className="btn-icon delete" onClick={() => handleDeleteBlock(block.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <AnimatePresence>
                {isTypeModalOpen && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{editingType ? 'Terminart bearbeiten' : 'Neue Terminart'}</h3>
                                <button onClick={() => setIsTypeModalOpen(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveType}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            required
                                            value={typeForm.name}
                                            onChange={e => setTypeForm({ ...typeForm, name: e.target.value })}
                                            placeholder="z.B. Erstgespräch"
                                        />
                                    </div>
                                    <div className="input-row">
                                        <div className="form-group">
                                            <label>Dauer (Minuten)</label>
                                            <input
                                                type="number"
                                                required
                                                value={typeForm.duration_minutes}
                                                onChange={e => setTypeForm({ ...typeForm, duration_minutes: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Preis (Optional)</label>
                                            <input
                                                type="number"
                                                value={typeForm.price}
                                                onChange={e => setTypeForm({ ...typeForm, price: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Beschreibung</label>
                                        <textarea
                                            value={typeForm.description}
                                            onChange={e => setTypeForm({ ...typeForm, description: e.target.value })}
                                            rows="3"
                                        />
                                    </div>
                                    <div className="form-group checkbox">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={typeForm.is_active}
                                                onChange={e => setTypeForm({ ...typeForm, is_active: e.target.checked })}
                                            />
                                            In der Buchung aktiv anzeigen
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsTypeModalOpen(false)}>Abbrechen</button>
                                    <button type="submit" className="btn-primary">Speichern</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {isBlockModalOpen && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Abwesenheit eintragen</h3>
                                <button onClick={() => setIsBlockModalOpen(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveBlock}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Grund (Optional)</label>
                                        <input
                                            value={blockForm.reason}
                                            onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })}
                                            placeholder="z.B. Urlaub, Feiertag"
                                        />
                                    </div>
                                    <div className="input-row">
                                        <div className="form-group">
                                            <label>Von</label>
                                            <input
                                                type="date"
                                                required
                                                value={blockForm.start_date}
                                                onChange={e => setBlockForm({ ...blockForm, start_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bis (Einschließlich)</label>
                                            <input
                                                type="date"
                                                required
                                                value={blockForm.end_date}
                                                onChange={e => setBlockForm({ ...blockForm, end_date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-secondary" onClick={() => setIsBlockModalOpen(false)}>Abbrechen</button>
                                    <button type="submit" className="btn-primary">Hinzufügen</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .settings-container { max-width: 900px; margin: 0 auto; }
                .settings-header { margin-bottom: 2rem; }
                .settings-header h1 { font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem; }
                
                .error-banner, .success-banner { 
                    padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; gap: 0.5rem; align-items: center; 
                }
                .error-banner { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
                .success-banner { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

                .tabs { display: flex; gap: 1rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 2rem; }
                .tab { 
                    padding: 1rem 1.5rem; background: none; border: none; border-bottom: 2px solid transparent; 
                    font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s;
                }
                .tab:hover { color: var(--color-primary); }
                .tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }

                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .btn-primary:hover { background: var(--color-primary-dark); }
                .btn-primary.large { padding: 0.8rem 2rem; font-size: 1.1rem; }
                
                .btn-secondary { padding: 0.6rem 1.2rem; background: white; border: 1px solid #cbd5e1; color: #475569; border-radius: 8px; font-weight: 600; cursor: pointer; }

                /* Types Grid */
                .types-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
                .type-card { background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .type-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
                .type-header h3 { font-size: 1.1rem; color: var(--color-primary); margin: 0; }
                .status-badge { font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 600; }
                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.inactive { background: #f1f5f9; color: #64748b; }
                
                .type-details { display: flex; gap: 1rem; font-size: 0.9rem; color: #64748b; margin-bottom: 0.75rem; }
                .type-details p { display: flex; align-items: center; gap: 0.4rem; }
                .type-desc { font-size: 0.9rem; color: #475569; margin-bottom: 1.5rem; line-height: 1.4; }
                
                .type-actions { display: flex; gap: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
                .btn-icon { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem; border: none; background: #f8fafc; color: #475569; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; }
                .btn-icon:hover { background: #e2e8f0; }
                .btn-icon.delete { color: #dc2626; background: #fef2f2; }
                .btn-icon.delete:hover { background: #fee2e2; }

                /* Availability */
                .form-group-section { background: white; padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 2rem; }
                .form-group-section h2 { font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--color-text-main); }
                .help-text { color: #64748b; margin-bottom: 1.5rem; }
                
                .weekdays-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
                .day-checkbox { 
                    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; 
                    border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-weight: 500;
                }
                .day-checkbox:hover { border-color: var(--color-primary-light); }
                .day-checkbox.checked { border-color: var(--color-primary); background: #eff6ff; color: var(--color-primary); }
                .day-checkbox input { display: none; }

                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #475569; font-size: 0.9rem; }
                .form-group input, .form-group textarea { 
                    width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px; 
                    font-size: 1rem; font-family: inherit; transition: border-color 0.2s;
                }
                .form-group input:focus { border-color: var(--color-primary); outline: none; }
                
                .actions-footer { display: flex; justify-content: flex-end; }
                
                /* Blocked List */
                .blocked-list { display: flex; flex-direction: column; gap: 1rem; }
                .block-item { 
                    display: flex; align-items: center; justify-content: space-between; 
                    background: white; padding: 1rem 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; 
                }
                .block-dates { display: flex; align-items: center; gap: 1rem; font-weight: 600; color: #334155; }
                .block-dates .arrow { color: #94a3b8; }
                .block-reason { color: #64748b; flex: 1; margin-left: 2rem; }

                /* Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; }
                .modal-content { background: white; width: 100%; max-width: 500px; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-xl); }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
                .modal-header h3 { margin: 0; font-size: 1.25rem; }
                .modal-header button { background: none; border: none; cursor: pointer; color: #64748b; }
                .modal-body { padding: 1.5rem; }
                .modal-footer { padding: 1.5rem; background: #f8fafc; display: flex; justify-content: flex-end; gap: 1rem; }
                
                .checkbox label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .checkbox input { width: auto; }
            `}</style>
        </AdminLayout>
    );
};

export default TerminToolSettings;
