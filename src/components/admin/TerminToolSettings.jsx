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
        max_booking_future_days: 60,
        business_hours: {
            Monday: { start: '09:00', end: '17:00' },
            Tuesday: { start: '09:00', end: '17:00' },
            Wednesday: { start: '09:00', end: '17:00' },
            Thursday: { start: '09:00', end: '17:00' },
            Friday: { start: '09:00', end: '17:00' },
            Saturday: { start: '09:00', end: '13:00' },
            Sunday: { start: '10:00', end: '14:00' }
        }
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

    const updateBusinessHours = (day, field, value) => {
        setSettings({
            ...settings,
            business_hours: {
                ...settings.business_hours,
                [day]: {
                    ...settings.business_hours[day],
                    [field]: value
                }
            }
        });
    };

    const validateBusinessHours = () => {
        for (const day of settings.available_days || []) {
            const hours = settings.business_hours?.[day];
            if (hours && hours.start && hours.end) {
                if (hours.start >= hours.end) {
                    alert(`Geschäftszeiten für ${weekDays.find(d => d.id === day)?.label}: Startzeit muss vor Endzeit liegen.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSaveSettings = async () => {
        if (!validateBusinessHours()) return;

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

                                <div className="interval-settings">
                                    <h3>
                                        <Clock size={16} className="text-cyan-600" />
                                        Zeitslot-Intervall
                                    </h3>
                                    <p>
                                        Legen Sie fest, in welchem Rhythmus Termine angeboten werden sollen.
                                    </p>

                                    <div className="radio-group">
                                        <label className={`radio-option ${(!settings.slot_interval_minutes || settings.slot_interval_minutes === 15) ? 'checked' : ''}`}>
                                            <input
                                                type="radio"
                                                name="slotInterval"
                                                value="15"
                                                checked={(!settings.slot_interval_minutes || settings.slot_interval_minutes === 15)}
                                                onChange={() => setSettings({ ...settings, slot_interval_minutes: 15 })}
                                            />
                                            <span className="radio-label">
                                                <strong>Viertelstündlich</strong> (alle 15 Minuten)
                                                <span className="radio-hint">z.B. 9:00, 9:15, 9:30...</span>
                                            </span>
                                        </label>

                                        <label className={`radio-option ${settings.slot_interval_minutes === 30 ? 'checked' : ''}`}>
                                            <input
                                                type="radio"
                                                name="slotInterval"
                                                value="30"
                                                checked={settings.slot_interval_minutes === 30}
                                                onChange={() => setSettings({ ...settings, slot_interval_minutes: 30 })}
                                            />
                                            <span className="radio-label">
                                                <strong>Halbstündlich</strong> (alle 30 Minuten)
                                                <span className="radio-hint">z.B. 9:00, 9:30, 10:00...</span>
                                            </span>
                                        </label>

                                        <label className={`radio-option ${settings.slot_interval_minutes === 60 ? 'checked' : ''}`}>
                                            <input
                                                type="radio"
                                                name="slotInterval"
                                                value="60"
                                                checked={settings.slot_interval_minutes === 60}
                                                onChange={() => setSettings({ ...settings, slot_interval_minutes: 60 })}
                                            />
                                            <span className="radio-label">
                                                <strong>Stündlich</strong> (jede Stunde)
                                                <span className="radio-hint">z.B. 9:00, 10:00, 11:00...</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group-section">
                                <h2>Geschäftszeiten</h2>
                                <p className="help-text">Legen Sie die täglichen Zeitfenster fest, in denen Termine gebucht werden können.</p>
                                <div className="business-hours-grid">
                                    {weekDays
                                        .filter(day => settings.available_days?.includes(day.id))
                                        .map(day => (
                                            <div key={day.id} className="business-hours-row">
                                                <label className="day-label">{day.label}</label>
                                                <div className="time-inputs">
                                                    <div className="time-input-group">
                                                        <label>Von</label>
                                                        <input
                                                            type="time"
                                                            value={settings.business_hours?.[day.id]?.start || '09:00'}
                                                            onChange={(e) => updateBusinessHours(day.id, 'start', e.target.value)}
                                                        />
                                                    </div>
                                                    <span className="time-separator">–</span>
                                                    <div className="time-input-group">
                                                        <label>Bis</label>
                                                        <input
                                                            type="time"
                                                            value={settings.business_hours?.[day.id]?.end || '17:00'}
                                                            onChange={(e) => updateBusinessHours(day.id, 'end', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {settings.available_days?.length === 0 && (
                                    <p className="empty-text">Bitte wählen Sie zuerst verfügbare Wochentage aus.</p>
                                )}
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
                    font-family: inherit; font-size: 0.95rem;
                }
                .tab:hover { border-color: #cbd5e1; color: #475569; }
                .tab.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }

                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
                .section-header h2 { font-size: 1.5rem; font-weight: 700; color: var(--color-text-main); margin: 0; }
                
                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn-primary:hover { background: var(--color-primary-dark); }
                .btn-primary.large { padding: 0.8rem 2rem; font-size: 1.05rem; }
                
                .btn-secondary { padding: 0.6rem 1.2rem; background: white; border: 1px solid #cbd5e1; color: #475569; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-secondary:hover { background: #f1f5f9; border-color: #94a3b8; }

                /* Types Grid */
                .types-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                .type-card { 
                    background: white; padding: 1.5rem; border-radius: 12px; 
                    border: 2px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
                    transition: all 0.2s; position: relative;
                }
                .type-card:hover { border-color: var(--color-primary-light); transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                
                .type-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
                .type-header h3 { font-size: 1.15rem; font-weight: 700; color: var(--color-text-main); margin: 0; }
                
                .status-badge { display: inline-block; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 99px; font-weight: 600; letter-spacing: 0.025em; text-transform: uppercase; }
                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.inactive { background: #f1f5f9; color: #64748b; }
                
                .type-details { display: flex; gap: 1rem; font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; flex-wrap: wrap; }
                .type-details p { display: flex; align-items: center; gap: 0.4rem; background: #f8fafc; padding: 0.25rem 0.5rem; border-radius: 6px; }
                .type-desc { font-size: 0.95rem; color: #475569; margin-bottom: 1.5rem; line-height: 1.5; }
                
                .type-actions { display: flex; gap: 0.75rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
                .btn-icon { display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.75rem; border: 1px solid transparent; background: #f1f5f9; color: #475569; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; }
                .btn-icon:hover { background: #e2e8f0; }
                .btn-icon.small { padding: 0.25rem; }
                .btn-icon.delete { color: #dc2626; background: #fee2e2; }
                .btn-icon.delete:hover { background: #fecaca; }

                /* Availability Section - Cleaner Look */
                .form-group-section { background: white; padding: 2rem; border-radius: 12px; border: 2px solid #e2e8f0; margin-bottom: 2rem; }
                .form-group-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-main); }
                .help-text { color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem; }
                
                .weekdays-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .day-checkbox { 
                    display: flex; align-items: center; justify-content: center;
                    padding: 0.6rem 1rem; min-width: 100px;
                    border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; 
                    transition: all 0.2s; font-weight: 600; color: #64748b; background: white;
                }
                .day-checkbox:hover { border-color: #cbd5e1; }
                .day-checkbox.checked { border-color: var(--color-primary); background: var(--color-primary); color: white; }
                .day-checkbox input { display: none; }

                .input-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #334155; font-size: 0.9rem; }
                .form-group input, .form-group textarea { 
                    width: 100%; padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; 
                    font-size: 0.95rem; font-family: inherit; transition: all 0.2s; color: #1e293b;
                    background: #f8fafc;
                }
                .form-group input:focus, .form-group textarea:focus { border-color: var(--color-primary); outline: none; background: white; }
                
                .actions-footer { display: flex; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid #f1f5f9; margin-top: 1rem; }
                
                /* Blocked List */
                .blocked-list { display: flex; flex-direction: column; gap: 1rem; }
                .block-item { 
                    display: flex; align-items: center; justify-content: space-between; 
                    background: white; padding: 1.25rem 1.5rem; border-radius: 10px; border: 2px solid #e2e8f0;
                    transition: all 0.2s;
                }
                .block-item:hover { border-color: #cbd5e1; }
                .block-dates { display: flex; align-items: center; gap: 1rem; font-weight: 600; color: #334155; }
                .block-dates .arrow { color: #94a3b8; }
                .block-reason { color: #64748b; flex: 1; margin-left: 2rem; font-weight: 500; }

                /* Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); padding: 1rem; }
                .modal-content { background: white; width: 100%; max-width: 550px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); animation: modalIn 0.2s ease-out; }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
                .modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
                .modal-header button { background: none; border: none; cursor: pointer; color: #64748b; padding: 0.5rem; border-radius: 6px; transition: background 0.2s; }
                .modal-header button:hover { background: #e2e8f0; color: #334155; }
                
                .modal-body { padding: 1.5rem; }
                .modal-footer { padding: 1.5rem; background: #f8fafc; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #e2e8f0; }
                
                .checkbox label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; user-select: none; }
                .checkbox input { width: 20px; height: 20px; border-radius: 6px; accent-color: var(--color-primary); }

                /* Business Hours */
                .business-hours-grid { display: flex; flex-direction: column; gap: 0.75rem; }
                .business-hours-row { 
                    display: flex; align-items: center; gap: 1rem; padding: 1rem; 
                    background: #fff; border-radius: 10px; border: 2px solid #e2e8f0;
                    flex-wrap: wrap;
                }
                .day-label { font-weight: 700; color: #334155; width: 100px; }
                .time-inputs { display: flex; align-items: center; gap: 1rem; flex: 1; }
                .time-input-group { display: flex; flex-direction: column; gap: 0.2rem; }
                .time-input-group label { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; }
                .time-input-group input[type="time"] { 
                    padding: 0.5rem 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; 
                    font-size: 1rem; font-weight: 500; font-family: inherit; min-width: 120px;
                    background: #f8fafc; color: #334155;
                }
                .time-input-group input[type="time"]:focus { border-color: var(--color-primary); outline: none; background: white; }
                .time-separator { color: #cbd5e1; font-weight: 400; font-size: 1.5rem; margin-top: 1rem; }
                
                .empty-text { color: #64748b; font-style: italic; text-align: center; padding: 3rem; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1; }
                
                /* Interval Settings */
                .interval-settings { margin-top: 2rem; padding: 1.5rem; background: #f8fafc; border-radius: 10px; border: 2px solid #e2e8f0; }
                .interval-settings h3 { font-size: 1.1rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .interval-settings p { color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem; }
                
                .radio-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .radio-option { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: white; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .radio-option:hover { border-color: #cbd5e1; }
                .radio-option.checked { border-color: var(--color-primary); background: #eff6ff90; }
                .radio-option input { accent-color: var(--color-primary); width: 18px; height: 18px; margin: 0; }
                .radio-label { display: flex; flex-direction: column; font-size: 0.95rem; color: #334155; gap: 0.2rem; }
                .radio-hint { font-size: 0.8rem; color: #64748b; font-weight: 400; }
            `}</style>
        </AdminLayout>
    );
};

export default TerminToolSettings;
