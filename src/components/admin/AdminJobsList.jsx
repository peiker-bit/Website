import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Briefcase, Search, Plus, Trash2, Edit2,
    X, Eye, Calendar, MapPin, Clock, Loader2
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getJobs, deleteJob } from '../../lib/jobsClient';

const AdminJobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft, inactive
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        // Filter and search jobs
        let result = jobs;

        if (filterStatus !== 'all') {
            result = result.filter(j => j.status === filterStatus);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(j =>
                j.title.toLowerCase().includes(term) ||
                (j.location && j.location.toLowerCase().includes(term)) ||
                (j.employment_type && j.employment_type.toLowerCase().includes(term))
            );
        }

        setFilteredJobs(result);
    }, [jobs, searchTerm, filterStatus]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await getJobs(true);
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            alert('Fehler beim Laden der Stellenangebote. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await deleteJob(jobId);
            setDeleteConfirm(null);
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Fehler beim Löschen des Stellenangebots.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-container">
                    <Loader2 size={48} className="spin-icon" />
                    <p>Stellenangebote werden geladen...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="messages-container">
                {/* Header identical to MessageList */}
                <div className="messages-header">
                    <div>
                        <h1>Stellenangebote</h1>
                        <p>{filteredJobs.length} {filterStatus === 'all' ? 'Gesamt' : filterStatus === 'published' ? 'Veröffentlichte' : filterStatus === 'draft' ? 'Entwürfe' : 'Inaktive'} Positionen</p>
                    </div>
                    <Link to="/admin/jobs/new" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} />
                        Neue Stelle
                    </Link>
                </div>

                {/* Filters and Search identical to MessageList */}
                <div className="controls-bar">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Suchen nach Titel, Standort..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="clear-search" onClick={() => setSearchTerm('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            Alle
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'published' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('published')}
                        >
                            Veröffentlicht
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'draft' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('draft')}
                        >
                            Entwurf
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'inactive' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('inactive')}
                        >
                            Inaktiv
                        </button>
                    </div>
                </div>

                {/* Jobs List identical to MessageList */}
                {filteredJobs.length === 0 ? (
                    <div className="empty-state">
                        <Briefcase size={64} />
                        <h3>Keine Stellenangebote gefunden</h3>
                        <p>
                            {searchTerm || filterStatus !== 'all'
                                ? 'Versuchen Sie, Ihre Filter zu ändern.'
                                : 'Es sind noch keine Stellenangebote vorhanden.'}
                        </p>
                    </div>
                ) : (
                    <div className="messages-list">
                        {filteredJobs.map((job) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`message-card ${job.status === 'draft' ? 'unread' : ''}`} // Using 'unread' styling for drafts
                                onClick={() => navigate(`/admin/jobs/${job.id}`)}
                            >
                                <div className="message-card-icon" style={{ background: job.status === 'published' ? '#dcfce7' : job.status === 'draft' ? '#fef9c3' : '#f1f5f9', color: job.status === 'published' ? '#166534' : job.status === 'draft' ? '#854d0e' : '#64748b' }}>
                                    <Briefcase size={24} />
                                </div>

                                <div className="message-card-content">
                                    <div className="message-card-header">
                                        <h3>{job.title}</h3>
                                        <span className="message-date">
                                            <Calendar size={14} />
                                            {formatDate(job.created_at)}
                                        </span>
                                    </div>
                                    <div className="message-email" style={{ display: 'flex', gap: '1rem' }}>
                                        {job.location && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <MapPin size={14} /> {job.location}
                                            </span>
                                        )}
                                        {job.employment_type && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={14} /> {job.employment_type}
                                            </span>
                                        )}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem',
                                            padding: '0.1rem 0.5rem', borderRadius: '99px', fontWeight: 600,
                                            textTransform: 'uppercase', letterSpacing: '0.025em',
                                            background: job.status === 'published' ? '#dcfce7' : job.status === 'draft' ? '#fef9c3' : '#f1f5f9',
                                            color: job.status === 'published' ? '#166534' : job.status === 'draft' ? '#854d0e' : '#64748b'
                                        }}>
                                            {job.status === 'published' ? 'Online' : job.status === 'draft' ? 'Entwurf' : 'Inaktiv'}
                                        </span>
                                    </div>
                                    <div className="message-preview">
                                        {job.short_description ? (
                                            <>
                                                {job.short_description.substring(0, 150)}
                                                {job.short_description.length > 150 ? '...' : ''}
                                            </>
                                        ) : (
                                            <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Keine Kurzbeschreibung vorhanden.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="message-card-actions" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="action-btn"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/jobs/${job.id}`); }}
                                        title="Bearbeiten"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <a
                                        href={`/karriere/${job.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-btn"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Vorschau"
                                    >
                                        <Eye size={18} />
                                    </a>
                                    <button
                                        className="action-btn delete"
                                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: job.id, title: job.title }); }}
                                        title="Löschen"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Modal identical to MessageList */}
                <AnimatePresence>
                    {deleteConfirm && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirm(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                        >
                            <motion.div
                                className="confirm-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{ background: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            >
                                <div className="confirm-icon" style={{ width: '64px', height: '64px', background: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                    <Trash2 size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Stelle löschen?</h3>
                                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Die Stelle "{deleteConfirm.title}" wird endgültig gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.</p>
                                <div className="confirm-actions" style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="confirm-btn cancel" onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                                        Abbrechen
                                    </button>
                                    <button className="confirm-btn delete" onClick={() => handleDelete(deleteConfirm.id)} style={{ flex: 1, padding: '0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                                        Löschen
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Included identical CSS from MessageList */}
            <style>{`
                .messages-container {
                  max-width: 1400px;
                  margin: 0 auto;
                }

                .loading-container {
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

                .messages-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 2rem;
                }

                .messages-header h1 {
                  font-size: 2rem;
                  font-weight: 700;
                  color: #1e293b;
                  margin-bottom: 0.25rem;
                }

                .messages-header p {
                  color: #64748b;
                  font-size: 1.05rem;
                }

                .controls-bar {
                  display: flex;
                  gap: 1rem;
                  margin-bottom: 2rem;
                  flex-wrap: wrap;
                }

                .search-box {
                  flex: 1;
                  min-width: 300px;
                  position: relative;
                  display: flex;
                  align-items: center;
                  background: white;
                  border: 2px solid #e2e8f0;
                  border-radius: 12px;
                  padding: 0 1rem;
                  transition: border-color 0.2s;
                }

                .search-box:focus-within {
                  border-color: #3b82f6;
                }

                .search-box svg:first-child {
                  color: #94a3b8;
                  margin-right: 0.75rem;
                }

                .search-box input {
                  flex: 1;
                  border: none;
                  outline: none;
                  padding: 1rem 0;
                  font-size: 0.95rem;
                }

                .clear-search {
                  background: none;
                  border: none;
                  color: #94a3b8;
                  cursor: pointer;
                  padding: 0.5rem;
                  display: flex;
                  align-items: center;
                }

                .filter-buttons {
                  display: flex;
                  gap: 0.5rem;
                }

                .filter-btn {
                  padding: 0.75rem 1.5rem;
                  background: white;
                  border: 2px solid #e2e8f0;
                  border-radius: 10px;
                  cursor: pointer;
                  font-weight: 600;
                  color: #64748b;
                  transition: all 0.2s;
                }

                .filter-btn:hover {
                  border-color: #cbd5e1;
                  background: #f8fafc;
                }

                .filter-btn.active {
                  background: #3b82f6;
                  border-color: #3b82f6;
                  color: white;
                }

                .empty-state {
                  text-align: center;
                  padding: 4rem 2rem;
                  color: #94a3b8;
                }

                .empty-state svg {
                  margin-bottom: 1rem;
                  opacity: 0.3;
                }

                .empty-state h3 {
                  color: #475569;
                  font-size: 1.25rem;
                  margin-bottom: 0.5rem;
                }

                .messages-list {
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                }

                .message-card {
                  background: white;
                  border-radius: 12px;
                  padding: 1.5rem;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  border: 2px solid #e2e8f0;
                  display: flex;
                  gap: 1.5rem;
                  cursor: pointer;
                  transition: all 0.2s;
                }

                .message-card:hover {
                  border-color: #cbd5e1;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .message-card.unread {
                  background: #fef9c3; /* Yellowish for drafts */
                  border-color: #fde047;
                }

                .message-card-icon {
                  width: 48px;
                  height: 48px;
                  background: #f1f5f9;
                  border-radius: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #64748b;
                  flex-shrink: 0;
                }

                .message-card-content {
                  flex: 1;
                  min-width: 0;
                }

                .message-card-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 0.5rem;
                  gap: 1rem;
                }

                .message-card-header h3 {
                  font-size: 1.1rem;
                  font-weight: 600;
                  color: #1e293b;
                  margin: 0;
                }

                .message-date {
                  display: flex;
                  align-items: center;
                  gap: 0.375rem;
                  font-size: 0.85rem;
                  color: #64748b;
                  flex-shrink: 0;
                }

                .message-email {
                  font-size: 0.9rem;
                  color: #3b82f6;
                  margin-bottom: 0.75rem;
                }

                .message-preview {
                  color: #475569;
                  line-height: 1.5;
                  font-size: 0.95rem;
                }

                .message-card-actions {
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                }

                .action-btn {
                  width: 40px;
                  height: 40px;
                  background: white;
                  border: 2px solid #e2e8f0;
                  border-radius: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  color: #64748b;
                  transition: all 0.2s;
                }

                .action-btn:hover {
                  border-color: #3b82f6;
                  color: #3b82f6;
                }

                .action-btn.delete:hover {
                  border-color: #dc2626;
                  color: #dc2626;
                  background: #fef2f2;
                }

                .btn-primary { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .btn-primary:hover { background: #1d4ed8; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminJobsList;
