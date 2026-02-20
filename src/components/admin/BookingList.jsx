import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Search, Filter, Trash2, X,
    User, Mail, Phone, MapPin, ChevronLeft, ChevronRight,
    Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { subscribeToBookings, deleteBooking, updateBookingStatus, cancelBooking } from '../../lib/bookingClient';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from './AdminLayout';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, confirmed, cancelled, archive
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // For manual refresh
    const bookingsPerPage = 20;

    useEffect(() => {
        setLoading(true);
        // Subscribe to real-time updates
        const unsubscribe = subscribeToBookings((data) => {
            setBookings(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [refreshKey]);

    useEffect(() => {
        // Filter and search bookings
        let result = bookings;

        // Calculate date threshold (7 days ago)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Apply status and date filter
        if (filterStatus === 'all') {
            // Show active bookings: not cancelled AND not too old
            result = result.filter(b => {
                const isCancelled = b.status === 'cancelled' || b.status === 'canceled';
                const bookingDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
                const isRecent = bookingDate >= sevenDaysAgo;
                return !isCancelled && isRecent;
            });
        } else if (filterStatus === 'archive') {
            // Show old bookings (older than 7 days)
            result = result.filter(b => {
                const bookingDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
                return bookingDate < sevenDaysAgo;
            });
        } else {
            // Show bookings with specific status
            result = result.filter(b => b.status === filterStatus);
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b =>
                (b.name && b.name.toLowerCase().includes(term)) ||
                (b.email && b.email.toLowerCase().includes(term)) ||
                (b.service && b.service.toLowerCase().includes(term))
            );
        }

        setFilteredBookings(result);
        setCurrentPage(1);
    }, [bookings, searchTerm, filterStatus]);

    const handleDelete = async (bookingId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Nicht authentifiziert");

            await deleteBooking(bookingId, session.access_token);
            // Optimistic update / Immediate removal from UI
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            setDeleteConfirm(null);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert(`Fehler beim Löschen der Buchung: ${error.message}`);
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            if (newStatus === 'cancelled') {
                // Automated cancellation via API
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) throw new Error("Nicht authentifiziert");

                await cancelBooking(bookingId, cancellationReason, session.access_token);
            } else {
                // Regular update for other statuses
                await updateBookingStatus(bookingId, newStatus);
            }

            // Close modal after status update
            setSelectedBooking(null);
            setCancellationReason('');
            // Refresh logic if needed (subscription handles it usually, but explicit fetch is safer if logic changed)
        } catch (error) {
            console.error('Error updating status:', error);
            alert(`Fehler: ${error.message}`);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Unbekannt';
        // Handle both Firestore Timestamp and JS Date objects or strings
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (time) => {
        if (!time) return '';
        return time; // Assuming time is stored as string like "14:00"
    };

    // Pagination
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <span className="status-badge confirmed"><CheckCircle size={14} /> Bestätigt</span>;
            case 'cancelled':
            case 'canceled':
                return <span className="status-badge cancelled"><XCircle size={14} /> Storniert</span>;
            default:
                return <span className="status-badge pending"><AlertCircle size={14} /> Offen</span>;
        }
    };

    const downloadCSV = () => {
        if (!filteredBookings.length) {
            alert("Keine Daten zum Exportieren.");
            return;
        }

        const headers = ["ID", "Kunde", "E-Mail", "Telefon", "Datum", "Uhrzeit", "Service", "Status", "Nachricht"];
        const rows = filteredBookings.map(b => {
            const bookingDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
            return [
                b.id,
                `"${(b.name || '').replace(/"/g, '""')}"`,
                `"${(b.email || '').replace(/"/g, '""')}"`,
                `"${(b.phone || '').replace(/"/g, '""')}"`,
                bookingDate.toLocaleDateString('de-DE'),
                b.time || '',
                `"${(b.service || '').replace(/"/g, '""')}"`,
                b.status || '',
                `"${(b.message || '').replace(/"/g, '""')}"`
            ];
        });

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `buchungen_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-container">
                    <Loader2 size={48} className="spin-icon" />
                    <p>Lade Buchungen...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="bookings-container">
                {/* Header */}
                <div className="bookings-header">
                    <div>
                        <h1>Terminbuchungen</h1>
                        <p>{filteredBookings.length} {filterStatus === 'all' ? 'Aktive' : filterStatus === 'confirmed' ? 'Bestätigte' : filterStatus === 'pending' ? 'Offene' : filterStatus === 'cancelled' ? 'Stornierte' : 'Archivierte'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" onClick={handleRefresh} title="Liste aktualisieren">
                            <RefreshCw size={18} />
                        </button>
                        <button className="btn-secondary" onClick={downloadCSV}>
                            Daten exportieren (CSV)
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls-bar">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Suchen nach Name, Service..."
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
                            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('pending')}
                        >
                            Offen
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('confirmed')}
                        >
                            Bestätigt
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('cancelled')}
                        >
                            Storniert
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'archive' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('archive')}
                        >
                            Archiv
                        </button>
                    </div>
                </div>

                {/* List */}
                {currentBookings.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} />
                        <h3>Keine Buchungen gefunden</h3>
                        <p>Es liegen keine Terminbuchungen vor.</p>
                    </div>
                ) : (
                    <>
                        <div className="bookings-list">
                            {currentBookings.map((booking) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="booking-card"
                                    onClick={() => setSelectedBooking(booking)}
                                >
                                    <div className="booking-date-box">
                                        <span className="day">{formatDate(booking.date).split('.')[0]}</span>
                                        <span className="month">{formatDate(booking.date).split('.')[1]}</span>
                                        <span className="time">{formatTime(booking.time)}</span>
                                    </div>

                                    <div className="booking-info">
                                        <div className="booking-header">
                                            <h3>{booking.name}</h3>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="client-name" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                                            {booking.service || 'Termin'}
                                        </div>
                                        <div className="client-contact">
                                            <Mail size={14} /> {booking.email}
                                        </div>
                                        {booking.message && (
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                <span style={{ fontWeight: 600, flexShrink: 0 }}>Nachricht:</span>
                                                <span style={{ fontStyle: 'italic' }}>
                                                    {booking.message.substring(0, 60)}{booking.message.length > 60 ? '...' : ''}
                                                </span>
                                            </div>
                                        )}
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                                            Gebucht am: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unbekannt'}
                                        </div>
                                    </div>

                                    <div className="booking-actions" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => setDeleteConfirm(booking.id)}
                                            title="Löschen"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} /> Zurück
                                </button>
                                <span>Seite {currentPage} von {totalPages}</span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Weiter <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Detail Modal */}
                <AnimatePresence>
                    {selectedBooking && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                        >
                            <motion.div
                                className="modal-content"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h2>Buchungsdetails</h2>
                                    <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <div className="detail-item">
                                        <div className="detail-label"><User size={18} /> Name</div>
                                        <div className="detail-value">{selectedBooking.name}</div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label"><Mail size={18} /> E-Mail</div>
                                        <div className="detail-value">
                                            <a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email}</a>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                            Gebucht am: {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString('de-DE') : '-'}
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label"><Phone size={18} /> Telefon</div>
                                        <div className="detail-value">{selectedBooking.phone || '-'}</div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label"><Calendar size={18} /> Datum & Zeit</div>
                                        <div className="detail-value">
                                            {formatDate(selectedBooking.date)} um {formatTime(selectedBooking.time)}
                                        </div>
                                    </div>
                                    <div className="detail-item full-width">
                                        <div className="detail-label">Service</div>
                                        <div className="detail-value">{selectedBooking.service}</div>
                                    </div>
                                    {selectedBooking.message && (
                                        <div className="detail-item full-width">
                                            <div className="detail-label">Nachricht</div>
                                            <div className="detail-value message-text">{selectedBooking.message}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    {selectedBooking.status !== 'confirmed' && (
                                        <button
                                            className="modal-btn primary"
                                            onClick={() => {
                                                handleStatusUpdate(selectedBooking.id, 'confirmed');
                                            }}
                                        >
                                            <CheckCircle size={18} /> Bestätigen
                                        </button>
                                    )}
                                    {selectedBooking.status !== 'cancelled' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'flex-end' }}>
                                            {/* Reason Input only when cancelling */}
                                            <div style={{ width: '100%' }}>
                                                <label className="detail-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Stornierungsgrund</label>
                                                <textarea
                                                    value={cancellationReason}
                                                    onChange={(e) => setCancellationReason(e.target.value)}
                                                    placeholder="Grund angeben (wird in E-Mail übernommen)..."
                                                    rows="2"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e2e8f0',
                                                        fontFamily: 'inherit'
                                                    }}
                                                />
                                            </div>
                                            <button
                                                className="modal-btn secondary"
                                                onClick={() => {
                                                    // Only allow cancel if reason is provided? Or optional?
                                                    // User requested reasoning, so let's enforce or at least encourage it.
                                                    // For now, allow empty but default text handles it.
                                                    handleStatusUpdate(selectedBooking.id, 'cancelled');
                                                }}
                                                disabled={!cancellationReason.trim()}
                                                title={!cancellationReason.trim() ? "Bitte Grund angeben" : "Stornieren & Benachrichtigen"}
                                                style={!cancellationReason.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                            >
                                                <XCircle size={18} /> Stornieren & E-Mail
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        className="modal-btn delete"
                                        onClick={() => setDeleteConfirm(selectedBooking.id)}
                                    >
                                        <Trash2 size={18} /> Löschen
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteConfirm && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirm(null)}
                        >
                            <motion.div
                                className="confirm-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="confirm-icon">
                                    <Trash2 size={32} />
                                </div>
                                <h3>Buchung löschen?</h3>
                                <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
                                <div className="confirm-actions">
                                    <button className="confirm-btn cancel" onClick={() => setDeleteConfirm(null)}>
                                        Abbrechen
                                    </button>
                                    <button className="confirm-btn delete" onClick={() => handleDelete(deleteConfirm)}>
                                        Löschen
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .bookings-container { max-width: 1200px; margin: 0 auto; }
                .bookings-header { margin-bottom: 2rem; }
                .bookings-header h1 { font-size: 2rem; font-weight: 700; color: var(--color-primary); }
                
                .controls-bar { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
                .search-box { 
                    flex: 1; min-width: 300px; background: white; border: 2px solid #e2e8f0; 
                    border-radius: 12px; padding: 0 1rem; display: flex; align-items: center; 
                }
                .search-box input { flex: 1; border: none; outline: none; padding: 1rem 0; }
                .filter-buttons { display: flex; gap: 0.5rem; }
                .filter-btn { 
                    padding: 0.75rem 1.5rem; background: white; border: 2px solid #e2e8f0; 
                    border-radius: 10px; cursor: pointer; font-weight: 600; color: #64748b; 
                }
                .filter-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }

                .bookings-list { display: flex; flex-direction: column; gap: 1rem; }
                .booking-card { 
                    background: white; border-radius: 12px; padding: 1.5rem; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 2px solid #e2e8f0; 
                    display: flex; gap: 1.5rem; align-items: center; cursor: pointer;
                    transition: all 0.2s;
                }
                .booking-card:hover { border-color: var(--color-primary-light); transform: translateY(-2px); }
                
                .booking-date-box { 
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    background: var(--color-bg-subtle); padding: 0.75rem; border-radius: 10px; min-width: 80px;
                }
                .booking-date-box .day { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
                .booking-date-box .month { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; color: var(--color-text-muted); }
                .booking-date-box .time { font-size: 0.85rem; margin-top: 0.25rem; font-weight: 500; }

                .booking-info { flex: 1; }
                .booking-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                .booking-header h3 { font-weight: 700; color: var(--color-text-main); margin: 0; }
                
                .status-badge { 
                    display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.75rem; 
                    border-radius: 99px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
                }
                .status-badge.confirmed { background: #dcfce7; color: #166534; }
                .status-badge.cancelled { background: #fee2e2; color: #991b1b; }
                .status-badge.pending { background: #fef9c3; color: #854d0e; }

                .client-name, .client-contact { 
                    display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.25rem; 
                }

                .action-btn { 
                    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; 
                    background: white; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; color: #64748b;
                }
                .action-btn:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

                /* Modal styles same as MessageList */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
                .modal-content { background: white; border-radius: 20px; width: 100%; max-width: 700px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; }
                .modal-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
                .modal-body { padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; overflow-y: auto; }
                .detail-label { font-size: 0.8rem; text-transform: uppercase; color: #64748b; margin-bottom: 0.25rem; display: flex; gap: 0.5rem; align-items: center; }
                .detail-value { font-size: 1.1rem; font-weight: 500; color: #1e293b; }
                .full-width { grid-column: 1 / -1; }
                .modal-footer { padding: 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; gap: 1rem; justify-content: flex-end; }
                .modal-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; }
                .modal-btn.primary { background: var(--color-primary); color: white; }
                .modal-btn.secondary { background: white; border: 1px solid #cbd5e1; color: #475569; }
                .modal-btn.delete { background: #fee2e2; color: #991b1b; }
                
                /* Confirm Modal */
                .confirm-modal { background: white; padding: 2rem; border-radius: 16px; text-align: center; max-width: 400px; width: 100%; }
                .confirm-icon { width: 64px; height: 64px; background: #fee2e2; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
                .confirm-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
                .confirm-btn { padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; }
                .confirm-btn.cancel { background: #f1f5f9; color: #475569; }
                .confirm-btn.delete { background: #dc2626; color: white; }

                .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; }
                .pagination-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; }
                .pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </AdminLayout>
    );
};

export default BookingList;
