import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Move, Loader2, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Edit2, X, Menu as MenuIcon, CornerDownRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const MenuManager = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // New item state
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ label: '', path: '', order: 0, is_active: true });

    // Editing state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setMenuItems(data || []);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError('Fehler beim Laden der Menüpunkte');
        } finally {
            setLoading(false);
        }
    };

    const handleInitializeDefaults = async () => {
        const defaultItems = [
            { label: 'Startseite', path: '/#home', order: 0, is_active: true },
            { label: 'Leistungen', path: '/#services', order: 1, is_active: true },
            { label: 'Lohnabrechnung', path: '/lohnabrechnung', order: 2, is_active: true },
            { label: 'Kanzlei', path: '/#about', order: 3, is_active: true },
        ];

        try {
            setSaving(true);
            const { data, error } = await supabase
                .from('menu_items')
                .insert(defaultItems)
                .select();

            if (error) throw error;

            setMenuItems(data);
            setSuccess('Standard-Menüpunkte geladen');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error initializing defaults:', err);
            setError('Fehler beim Laden der Standards');
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = async () => {
        if (!newItem.label || !newItem.path) {
            setError('Bitte Label und Pfad ausfüllen');
            return;
        }

        try {
            setSaving(true);
            const nextOrder = newItem.order || (menuItems.length > 0 ? Math.max(...menuItems.map(i => i.order)) + 1 : 0);

            const { data, error } = await supabase
                .from('menu_items')
                .insert([{ ...newItem, order: nextOrder }])
                .select()
                .single();

            if (error) throw error;

            setMenuItems([...menuItems, data]);
            setNewItem({ label: '', path: '', order: 0, is_active: true });
            setIsAdding(false);
            setSuccess('Menüpunkt hinzugefügt');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error adding item:', err);
            setError('Fehler beim Hinzufügen');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id, updates) => {
        try {
            setSaving(true);
            const { data, error } = await supabase
                .from('menu_items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setMenuItems(menuItems.map(item => item.id === id ? data : item));
            setEditingId(null);
            setSuccess('Gespeichert');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating item:', err);
            setError('Fehler beim Speichern');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Sind Sie sicher?')) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMenuItems(menuItems.filter(item => item.id !== id));
            setSuccess('Gelöscht');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting item:', err);
            setError('Fehler beim Löschen');
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditForm({ ...item });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    if (loading) return (
        <div className="settings-loading">
            <Loader2 size={48} className="spin-icon" />
            <p>Menüpunkte werden geladen...</p>
        </div>
    );

    return (
        <React.Fragment>
            <div className="settings-header">
                <h1>Menüverwaltung</h1>
                <p>Konfigurieren Sie die Navigationsstruktur Ihrer Website.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="settings-card"
            >
                <div className="card-header">
                    <div className="card-icon">
                        <MenuIcon size={24} />
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <div>
                            <h2>Menüpunkte</h2>
                            <p>Übersicht aller aktiven und inaktiven Menüpunkte</p>
                        </div>
                        {!isAdding && (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="action-btn-light"
                            >
                                <Plus size={18} /> Neuer Eintrag
                            </button>
                        )}
                    </div>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            <CheckCircle size={20} />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Add New Item Form */}
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="add-form-container"
                        >
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Label</label>
                                    <input
                                        type="text"
                                        value={newItem.label}
                                        onChange={e => setNewItem({ ...newItem, label: e.target.value })}
                                        placeholder="z.B. Startseite"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pfad</label>
                                    <input
                                        type="text"
                                        value={newItem.path}
                                        onChange={e => setNewItem({ ...newItem, path: e.target.value })}
                                        placeholder="z.B. /#home"
                                    />
                                </div>
                                <div className="form-group small">
                                    <label>Reihenfolge</label>
                                    <input
                                        type="number"
                                        value={newItem.order}
                                        onChange={e => setNewItem({ ...newItem, order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group small flex-center">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={newItem.is_active}
                                            onChange={e => setNewItem({ ...newItem, is_active: e.target.checked })}
                                        />
                                        <span className="checkbox-custom"></span>
                                        Aktiv
                                    </label>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button onClick={() => setIsAdding(false)} className="btn-secondary">Abbrechen</button>
                                <button onClick={handleAdd} disabled={saving} className="btn-primary">
                                    {saving ? <Loader2 size={16} className="spin-icon" /> : <Save size={16} />} Speichern
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Menu Items List */}
                    <div className="menu-list">
                        {menuItems.length === 0 ? (
                            <div className="empty-state">
                                <MenuIcon size={40} />
                                <p>Keine Menüpunkte vorhanden.</p>
                                <button
                                    onClick={handleInitializeDefaults}
                                    disabled={saving}
                                    className="btn-primary mt-4"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Standard-Menü laden
                                </button>
                            </div>
                        ) : (
                            menuItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className={`list-item ${editingId === item.id ? 'editing' : ''}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {editingId === item.id ? (
                                        // Edit Mode
                                        <div className="edit-mode-container">
                                            <div className="form-grid compact">
                                                <div className="form-group">
                                                    <label>Label</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.label}
                                                        onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Pfad</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.path}
                                                        onChange={e => setEditForm({ ...editForm, path: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group small">
                                                    <label>Order</label>
                                                    <input
                                                        type="number"
                                                        value={editForm.order}
                                                        onChange={e => setEditForm({ ...editForm, order: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                                <div className="form-group small flex-center">
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={editForm.is_active}
                                                            onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                                                        />
                                                        <span className="checkbox-custom"></span>
                                                        Aktiv
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="edit-actions">
                                                <button onClick={() => handleUpdate(item.id, editForm)} disabled={saving} className="btn-icon success">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={cancelEdit} className="btn-icon">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="view-mode-container">
                                            <div className="item-order">
                                                {item.order}
                                            </div>
                                            <div className="item-details">
                                                <div className="item-main">
                                                    <span className="item-label">{item.label}</span>
                                                    <span className={`status-badge ${item.is_active ? 'active' : 'inactive'}`}>
                                                        {item.is_active ? 'Aktiv' : 'Inaktiv'}
                                                    </span>
                                                </div>
                                                <div className="item-path">
                                                    <CornerDownRight size={12} />
                                                    {item.path}
                                                </div>
                                            </div>
                                            <div className="item-actions">
                                                <button onClick={() => startEdit(item)} className="btn-icon primary">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="btn-icon danger">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </motion.div>

            <style>{`
                /* Shared Styles from AdminDashboard */
                .settings-header { margin-bottom: var(--space-8); }
                .settings-header h1 { font-size: var(--text-3xl); font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem; font-family: var(--font-heading); }
                .settings-header p { color: var(--color-text-muted); font-size: var(--text-lg); }

                .settings-card { background: white; border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: var(--space-8); border: 1px solid var(--color-border); }
                .card-header { background: var(--gradient-primary); color: white; padding: var(--space-8); display: flex; gap: var(--space-6); align-items: flex-start; }
                .card-icon { width: 56px; height: 56px; background: rgba(255, 255, 255, 0.15); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; backdrop-filter: blur(10px); }
                .card-header h2 { font-size: 1.5rem; margin-bottom: 0.375rem; color: white; font-family: var(--font-heading); }
                .card-header p { opacity: 0.9; font-size: 0.95rem; color: rgba(255, 255, 255, 0.9); line-height: 1.5; }
                
                .card-body { padding: var(--space-8); }

                /* Custom Menu Manager Styles */
                .action-btn-light {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    backdrop-filter: blur(5px);
                }
                .action-btn-light:hover { background: rgba(255,255,255,0.3); transform: translateY(-1px); }

                .add-form-container {
                    background: var(--color-bg-subtle);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 2fr 2fr 1fr 1fr;
                    gap: 1rem;
                    align-items: end;
                }
                
                .form-grid.compact {
                    grid-template-columns: 2fr 2fr 0.5fr 1fr;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }

                .form-group label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 0.4rem; letter-spacing: 0.05em; }
                .form-group input[type="text"], .form-group input[type="number"] {
                    width: 100%; padding: 0.6rem 0.8rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.9rem; transition: all 0.2s;
                }
                .form-group input:focus { outline: none; border-color: var(--color-secondary); box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); }
                
                .flex-center { display: flex; align-items: center; height: 100%; padding-bottom: 0.6rem; }

                .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.9rem; font-weight: 500; color: var(--color-text-main); }
                .checkbox-custom { width: 18px; height: 18px; border: 2px solid var(--color-border); border-radius: 4px; display: inline-block; position: relative; transition: all 0.2s; }
                input[type="checkbox"]:checked + .checkbox-custom { background: var(--color-secondary); border-color: var(--color-secondary); }
                input[type="checkbox"]:checked + .checkbox-custom::after { content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; font-weight: bold; }

                .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem; }

                .btn-primary { background: var(--gradient-accent); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; box-shadow: var(--shadow-sm); }
                .btn-primary:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
                .btn-secondary { background: white; color: var(--color-text-main); border: 1px solid var(--color-border); padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-secondary:hover { background: var(--color-bg-subtle); }

                /* List Items */
                .menu-list { display: flex; flex-direction: column; gap: 0.75rem; }
                
                .list-item { 
                    background: #fff; 
                    border: 1px solid var(--color-border); 
                    border-radius: 12px; 
                    padding: 0;
                    transition: all 0.2s;
                }
                .list-item:hover { border-color: var(--color-accent-light); box-shadow: var(--shadow-sm); transform: translateX(2px); }
                .list-item.editing { background: #f8fafc; border: 2px solid var(--color-secondary); padding: 1.5rem; }

                .view-mode-container { display: flex; align-items: center; padding: 1rem 1.25rem; }
                
                .item-order { 
                    width: 32px; height: 32px; background: var(--color-bg-subtle); color: var(--color-text-muted); 
                    border-radius: 8px; display: flex; align-items: center; justify-content: center; 
                    font-weight: 700; font-size: 0.85rem; margin-right: 1.25rem; flex-shrink: 0;
                }
                
                .item-details { flex: 1; }
                
                .item-main { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.25rem; }
                .item-label { font-weight: 600; color: var(--color-primary); font-size: 1rem; }
                
                .status-badge { font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
                .status-badge.active { background: #dcfce7; color: #166534; }
                .status-badge.inactive { background: #f1f5f9; color: #64748b; }
                
                .item-path { display: flex; align-items: center; gap: 0.4rem; color: var(--color-text-muted); font-size: 0.85rem; font-family: monospace; }
                
                .item-actions { display: flex; gap: 0.5rem; margin-left: 1rem; }
                
                .btn-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; background: transparent; }
                .btn-icon:hover { background: var(--color-bg-subtle); transform: scale(1.1); }
                .btn-icon.primary:hover { color: var(--color-secondary); background: #e0e7ff; }
                .btn-icon.danger:hover { color: #dc2626; background: #fee2e2; }
                .btn-icon.success:hover { color: #16a34a; background: #dcfce7; }
                
                .edit-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }

                .empty-state { padding: 3rem; text-align: center; color: var(--color-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .empty-state svg { opacity: 0.2; }
                
                .success-message, .error-message {
                    display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; 
                    border-radius: var(--radius-lg); margin-bottom: 1.5rem; font-weight: 500;
                }
                .success-message { background: #f0fdf4; border: 1px solid #86efac; color: #166534; }
                .error-message { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

                .settings-loading {
                    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; min-height: 50vh;
                }
                .spin-icon { color: var(--color-secondary); animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .form-grid.compact { grid-template-columns: 1fr; }
                    .view-mode-container { flex-wrap: wrap; }
                    .item-actions { width: 100%; justify-content: flex-end; margin-top: 0.5rem; margin-left: 0; }
                }
            `}</style>
        </React.Fragment>
    );
};

export default MenuManager;
