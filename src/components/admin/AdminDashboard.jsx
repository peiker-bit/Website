import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, TrendingUp, Clock, ArrowRight, Loader2, Calendar, CheckCircle, Users, X, Phone, User, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { subscribeToBookings, updateBookingStatus, cancelBooking } from '../../lib/bookingClient';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    todayBookings: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to real-time updates for messages
    const msgSubscription = supabase
      .channel('dashboard_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    // Subscribe to bookings
    const bookingUnsubscribe = subscribeToBookings((bookings) => {
      updateBookingStats(bookings);
    });

    return () => {
      msgSubscription.unsubscribe();
      bookingUnsubscribe();
    };
  }, []);

  const updateBookingStats = (bookings) => {
    const total = bookings.length;
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    // Calculate 7 days ago for filtering old bookings
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const todayCount = bookings.filter(b => {
      const d = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return d >= todayStart && d <= todayEnd;
    }).length;

    const upcoming = bookings.filter(b => {
      const d = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      const isCancelled = b.status === 'cancelled' || b.status === 'canceled';
      return d >= new Date() && !isCancelled;
    }).length;

    setStats(prev => ({
      ...prev,
      totalBookings: total,
      todayBookings: todayCount,
      upcomingBookings: upcoming
    }));

    // Filter for recent bookings: upcoming, not cancelled, and not older than 7 days
    const activeBookings = bookings.filter(b => {
      const d = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      const isCancelled = b.status === 'cancelled' || b.status === 'canceled';
      const isRecent = d >= sevenDaysAgo;
      return d >= new Date() && !isCancelled && isRecent;
    }).sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return dateA - dateB;
    });

    setRecentBookings(activeBookings.slice(0, 5));
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch all messages
      const { data: allMessages, error: allError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) throw allError;

      // Calculate stats
      const total = allMessages?.length || 0;
      const unread = allMessages?.filter(m => !m.is_read).length || 0;

      // Messages from today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const today = allMessages?.filter(m => new Date(m.created_at) >= todayStart).length || 0;

      setStats(prev => ({
        ...prev,
        totalMessages: total,
        unreadMessages: unread,
        todayMessages: today
      }));

      // Get unread messages only for the dashboard
      setRecentMessages(allMessages?.filter(m => !m.is_read).slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (message) => {
    try {
      setProcessingAction(true);
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', message.id);

      if (error) throw error;

      // Close modal and refresh text
      setSelectedMessage(null);
      // Realtime subscription will handle the refresh, but we can optimistically update
      setRecentMessages(prev => prev.filter(m => m.id !== message.id));
      setStats(prev => ({ ...prev, unreadMessages: prev.unreadMessages - 1 }));
    } catch (err) {
      console.error("Error marking as read", err);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm("Möchten Sie diesen Termin wirklich stornieren?")) return;

    try {
      setProcessingAction(true);

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Nicht authentifiziert");

      // Call API to cancel and send email
      // We import cancelBooking from bookingClient later (need to update imports)
      await cancelBooking(booking.id, cancellationReason, session.access_token);

      // Optimistic update
      setRecentBookings(prev => prev.filter(b => b.id !== booking.id));
      setSelectedBooking(null);
      setCancellationReason('');

      // Refresh data to be sure
      fetchDashboardData();

    } catch (err) {
      console.error("Error cancelling booking", err);
      alert(`Fehler beim Stornieren: ${err.message}`);
    } finally {
      setProcessingAction(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `Vor ${diffMins} Min.`;
    if (diffHours < 24) return `Vor ${diffHours} Std.`;
    if (diffDays < 7) return `Vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatFutureDate = (date) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const statCards = [
    {
      label: 'Nachrichten',
      value: stats.totalMessages,
      subValue: `${stats.todayMessages} heute`,
      icon: <Mail size={24} />,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      shadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)'
    },
    {
      label: 'Ungelesen',
      value: stats.unreadMessages,
      subValue: 'Handlungsbedarf',
      icon: <MailOpen size={24} />,
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      shadow: '0 10px 20px -5px rgba(249, 115, 22, 0.4)'
    },
    {
      label: 'Alle Buchungen',
      value: stats.totalBookings,
      subValue: `${stats.todayBookings} heute`,
      icon: <Calendar size={24} />,
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      shadow: '0 10px 20px -5px rgba(139, 92, 246, 0.4)'
    },
    {
      label: 'Kommend',
      value: stats.upcomingBookings,
      subValue: 'Nächste 7 Tage',
      icon: <Clock size={24} />,
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      shadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          <Loader2 size={48} className="spin-icon" />
          <p>Daten werden geladen...</p>
        </div>
        <style>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            min-height: 50vh;
            color: var(--color-text-muted);
          }
          .spin-icon {
            color: var(--color-secondary);
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Eine Übersicht Ihrer aktuellen Aktivitäten.</p>
          </div>
          <div className="date-badge">
            <Calendar size={16} />
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-sub">{stat.subValue}</div>
              </div>
              <div className="stat-icon-wrapper" style={{ background: stat.gradient, boxShadow: stat.shadow }}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-content-grid">
          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="content-card"
          >
            <div className="card-header">
              <div className="header-title-group">
                <div className="icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  <Mail size={18} />
                </div>
                <h2>Ungelesene Nachrichten</h2>
              </div>
              <Link to="/admin/messages" className="view-all-link">
                Alle ansehen <ArrowRight size={16} />
              </Link>
            </div>

            <div className="content-body">
              {recentMessages.length === 0 ? (
                <div className="empty-state">
                  <MailOpen size={40} />
                  <p>Keine ungelesenen Nachrichten</p>
                </div>
              ) : (
                <div className="items-list">
                  {recentMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className={`list-item unread clickable`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="list-item-avatar">
                        {message.name.charAt(0)}
                      </div>
                      <div className="list-item-content">
                        <div className="list-item-top">
                          <span className="list-item-title">{message.name}</span>
                          <span className="list-item-time">{formatDate(message.created_at)}</span>
                        </div>
                        <div className="list-item-subtitle">{message.email}</div>
                        <div className="list-item-preview">
                          {message.message.substring(0, 60)}{message.message.length > 60 ? '...' : ''}
                        </div>
                      </div>
                      <div className="unread-dot"></div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="content-card"
          >
            <div className="card-header">
              <div className="header-title-group">
                <div className="icon-box" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                  <Calendar size={18} />
                </div>
                <h2>Anstehende Buchungen</h2>
              </div>
              <Link to="/admin/bookings" className="view-all-link">
                Alle ansehen <ArrowRight size={16} />
              </Link>
            </div>

            <div className="content-body">
              {recentBookings.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={40} />
                  <p>Keine anstehenden Buchungen</p>
                </div>
              ) : (
                <div className="items-list">
                  {recentBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="list-item clickable"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className={`list-item-icon-status ${booking.status}`}>
                        <Calendar size={16} />
                      </div>
                      <div className="list-item-content">
                        <div className="list-item-top">
                          <span className="list-item-title">{booking.service || 'Termin'}</span>
                          <span className="status-badge" data-status={booking.status}>
                            {booking.status === 'confirmed' ? 'Bestätigt' : booking.status === 'cancelled' ? 'Storniert' : 'Offen'}
                          </span>
                        </div>
                        <div className="list-item-subtitle">{booking.name}</div>
                        <div className="list-item-preview">
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {formatFutureDate(booking.date)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop" onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content" onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Nachricht Details</h2>
                <button onClick={() => setSelectedMessage(null)} className="close-btn"><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="detail-label">Von</span>
                    <p>{selectedMessage.name} <span className="text-gray-400">&lt;{selectedMessage.email}&gt;</span></p>
                  </div>
                </div>
                <div className="detail-row">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <span className="detail-label">Gesendet am</span>
                    <p>{new Date(selectedMessage.created_at).toLocaleString('de-DE')}</p>
                  </div>
                </div>
                <div className="detail-message">
                  <span className="detail-label">Nachricht</span>
                  <p>{selectedMessage.message}</p>
                </div>
              </div>
              <div className="modal-footer">
                <a href={`mailto:${selectedMessage.email}`} className="btn-secondary">
                  <Mail size={16} /> Antworten
                </a>
                <button
                  onClick={() => handleMarkAsRead(selectedMessage)}
                  disabled={processingAction}
                  className="btn-primary"
                >
                  {processingAction ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                  Als gelesen markieren
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop" onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content" onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Buchungsdetails</h2>
                <button onClick={() => setSelectedBooking(null)} className="close-btn"><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="detail-label">Kunde</span>
                    <p>{selectedBooking.name}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.email}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <span className="detail-label">Termin</span>
                    <p>{formatFutureDate(selectedBooking.date)} - {selectedBooking.time}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <MessageSquare size={16} className="text-gray-400" />
                  <div>
                    <span className="detail-label">Service</span>
                    <p>{selectedBooking.service}</p>
                  </div>
                </div>
                {selectedBooking.message && (
                  <div className="detail-message">
                    <span className="detail-label">Nachricht</span>
                    <p>{selectedBooking.message}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '100%' }}>
                  <label className="detail-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Stornierungsgrund (wird an Kunden gesendet)</label>
                  <textarea
                    className="reason-input"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Bitte geben Sie einen Grund für die Stornierung an..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', width: '100%' }}>
                  <button
                    onClick={() => handleCancelBooking(selectedBooking)}
                    disabled={processingAction || !cancellationReason.trim()}
                    className="btn-danger"
                    title={!cancellationReason.trim() ? "Bitte geben Sie einen Grund an" : ""}
                  >
                    {processingAction ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                    Stornieren & Benachrichtigen
                  </button>
                  <button onClick={() => { setSelectedBooking(null); setCancellationReason(''); }} className="btn-secondary">
                    Schließen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence >

      <style>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .subtitle {
          color: var(--color-text-muted);
          font-size: 1.1rem;
        }

        .date-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: var(--shadow-sm);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .stat-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-xl);
        }

        .stat-content {
          z-index: 1;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }

        .stat-sub {
          font-size: 0.8rem;
          color: var(--color-accent);
          font-weight: 500;
        }

        .stat-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }

        /* Content Grid */
        .dashboard-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .content-card {
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
        }

        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-bg-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fcfcfc;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-header h2 {
          font-size: 1.25rem;
          margin: 0;
          color: var(--color-primary);
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-muted);
          transition: color 0.2s;
        }

        .view-all-link:hover {
          color: var(--color-secondary);
        }

        .content-body {
          padding: 1.5rem;
          flex: 1;
          background: white;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--color-bg-subtle);
          transition: all 0.2s;
          background: #fafafa;
          position: relative;
        }
        
        .list-item.clickable { cursor: pointer; }

        .list-item:hover {
          background: white;
          border-color: var(--color-accent-light);
          box-shadow: var(--shadow-sm);
        }
        
        .list-item.clickable:hover { transform: translateY(-2px); }

        .list-item.unread {
          background: #eff6ff;
          border-color: #dbeafe;
        }

        .list-item-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .list-item-icon-status {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .list-item-icon-status.confirmed { background: #ecfdf5; color: #059669; }
        .list-item-icon-status.pending { background: #fffbeb; color: #d97706; }
        .list-item-icon-status.cancelled { background: #fef2f2; color: #dc2626; }

        .list-item-content {
          flex: 1;
          min-width: 0;
        }

        .list-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .list-item-title {
          font-weight: 700;
          color: var(--color-primary);
          font-size: 0.95rem;
        }

        .list-item-time {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .list-item-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }

        .list-item-preview {
          font-size: 0.85rem;
          color: var(--color-text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          opacity: 0.9;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--color-cta);
          border-radius: 50%;
          margin-left: 0.5rem;
        }

        .status-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .status-badge[data-status="confirmed"] { background: #d1fae5; color: #065f46; }
        .status-badge[data-status="pending"] { background: #fef3c7; color: #92400e; }
        .status-badge[data-status="cancelled"] { background: #fee2e2; color: #b91c1c; }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--color-text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-state svg {
          opacity: 0.2;
        }
        
        /* Modal Styles */
        .modal-backdrop {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: white; width: 90%; max-width: 500px;
            border-radius: var(--radius-xl); box-shadow: var(--shadow-xl);
            overflow: hidden;
        }
        
        .modal-header {
            padding: 1.5rem; border-bottom: 1px solid var(--color-border);
            display: flex; justify-content: space-between; align-items: center;
            background: var(--color-bg-subtle);
        }
        
        .modal-header h2 { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: var(--color-text-muted); padding: 5px; border-radius: 50%; transition: all 0.2s; }
        .close-btn:hover { background: rgba(0,0,0,0.1); color: var(--color-text-main); }
        
        .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        
        .detail-row { display: flex; gap: 1rem; align-items: flex-start; }
        .detail-label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); font-weight: 700; margin-bottom: 0.25rem; }
        .detail-message { background: var(--color-bg-subtle); padding: 1rem; border-radius: var(--radius-lg); }
        .detail-message p { margin: 0; white-space: pre-wrap; }
        
        .modal-footer {
            padding: 1.5rem; border-top: 1px solid var(--color-border);
            display: flex; justify-content: flex-end; gap: 1rem;
            background: #fafafa;
        }
        
        .btn-primary, .btn-secondary, .btn-danger {
            display: flex; align-items: center; gap: 0.5rem;
            padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; font-size: 0.9rem; transition: all 0.2s; text-decoration: none;
        }
        
        .btn-primary { background: var(--color-primary); color: white; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        
        .btn-secondary { background: white; border: 1px solid var(--color-border); color: var(--color-text-main); }
        .btn-secondary:hover { background: var(--color-bg-subtle); }
        
        .btn-danger { background: #fee2e2; color: #dc2626; }
        .btn-danger:hover { background: #fca5a5; color: #7f1d1d; }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .dashboard-content-grid {
            grid-template-columns: 1fr;
          }
          
          .stat-card {
            padding: 1.25rem;
          }
          
          .stat-value {
            font-size: 2rem;
          }
        }
      `}</style>
    </AdminLayout >
  );
};

export default AdminDashboard;
