import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MailOpen, TrendingUp, Clock, ArrowRight, Loader2, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { subscribeToBookings } from '../../lib/bookingClient';
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

    const todayCount = bookings.filter(b => {
      const d = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return d >= todayStart && d <= todayEnd;
    }).length;

    const upcoming = bookings.filter(b => {
      const d = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return d >= new Date();
    }).length;

    setStats(prev => ({
      ...prev,
      totalBookings: total,
      todayBookings: todayCount,
      upcomingBookings: upcoming
    }));

    setRecentBookings(bookings.slice(0, 5));
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

      // Get recent 5 messages
      setRecentMessages(allMessages?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      icon: <Mail size={24} />,
      color: 'var(--color-secondary)',
      bgColor: '#eff6ff',
    },
    {
      label: 'Ungelesen',
      value: stats.unreadMessages,
      icon: <MailOpen size={24} />,
      color: 'var(--color-cta)',
      bgColor: '#fff7ed',
    },
    {
      label: 'Buchungen',
      value: stats.totalBookings,
      icon: <Calendar size={24} />,
      color: '#8b5cf6', // Violet
      bgColor: '#f5f3ff',
    },
    {
      label: 'Kommende Termine',
      value: stats.upcomingBookings,
      icon: <Clock size={24} />,
      color: '#10b981', // Emerald
      bgColor: '#ecfdf5',
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
          <h1>Dashboard</h1>
          <p>Willkommen zurück! Hier ist eine Übersicht Ihrer Nachrichten und Termine.</p>
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
              style={{ borderLeftColor: stat.color }}
            >
              <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
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
            className="recent-section"
          >
            <div className="section-header">
              <h2>Aktuelle Nachrichten</h2>
              <Link to="/admin/messages" className="view-all-link">
                Alle ansehen <ArrowRight size={16} />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="empty-state">
                <Mail size={48} />
                <p>Keine Nachrichten vorhanden</p>
              </div>
            ) : (
              <div className="items-list">
                {recentMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`list-item ${!message.is_read ? 'highlight' : ''}`}
                  >
                    <div className="item-icon">
                      {message.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
                    </div>
                    <div className="item-content">
                      <div className="item-header">
                        <span className="item-title">{message.name}</span>
                        <span className="item-meta">
                          <Clock size={14} />
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <div className="item-subtitle">{message.email}</div>
                      <div className="item-preview">
                        {message.message.substring(0, 60)}...
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="recent-section"
          >
            <div className="section-header">
              <h2>Aktuelle Buchungen</h2>
              <Link to="/admin/bookings" className="view-all-link">
                Alle ansehen <ArrowRight size={16} />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <p>Keine Buchungen vorhanden</p>
              </div>
            ) : (
              <div className="items-list">
                {recentBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`list-item ${booking.status === 'pending' ? 'highlight' : ''}`}
                  >
                    <div className="item-icon">
                      <Calendar size={20} />
                    </div>
                    <div className="item-content">
                      <div className="item-header">
                        <span className="item-title">{booking.service || 'Termin'}</span>
                        <span className="item-meta">
                          {formatFutureDate(booking.date)}
                        </span>
                      </div>
                      <div className="item-subtitle">{booking.name}</div>
                      <div className="status-pill" data-status={booking.status}>
                        {booking.status === 'confirmed' ? 'Bestätigt' : booking.status === 'cancelled' ? 'Storniert' : 'Offen'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: var(--space-8);
        }

        .dashboard-header h1 {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--space-2);
          font-family: var(--font-heading);
        }

        .dashboard-header p {
          color: var(--color-text-muted);
          font-size: var(--text-lg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }

        .stat-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: var(--space-6);
          transition: all var(--transition-normal);
        }

        .stat-card:hover { box-shadow: var(--shadow-xl); transform: translateY(-4px); }

        .stat-icon {
          width: 56px; height: 56px; border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
        }

        .stat-content { flex: 1; }
        .stat-label { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.25rem; font-weight: 600; text-transform: uppercase; }
        .stat-value { font-size: 2rem; font-weight: 700; color: var(--color-primary); }

        .dashboard-content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }

        .recent-section {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
        }

        .section-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;
        }
        .section-header h2 { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); margin: 0; }

        .view-all-link {
          display: flex; align-items: center; gap: 0.5rem; color: var(--color-secondary);
          text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: gap 0.2s ease;
        }
        .view-all-link:hover { gap: 0.75rem; color: var(--color-primary); }

        .empty-state { text-align: center; padding: 2rem; color: var(--color-text-muted); }
        .empty-state svg { margin-bottom: 1rem; opacity: 0.5; }

        .items-list { display: flex; flex-direction: column; gap: 1rem; }

        .list-item {
          display: flex; gap: 1rem; padding: 1rem; border-radius: var(--radius-lg);
          border: 1px solid var(--color-border); transition: all var(--transition-fast);
        }
        .list-item:hover { background: var(--color-bg-subtle); border-color: var(--color-primary-lighter); }
        .list-item.highlight { background: rgba(79, 70, 229, 0.03); border-color: rgba(79, 70, 229, 0.15); }

        .item-icon {
          width: 40px; height: 40px; background: var(--color-bg-subtle); border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); flex-shrink: 0;
        }
        .list-item.highlight .item-icon { background: var(--color-secondary); color: white; }

        .item-content { flex: 1; min-width: 0; }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
        .item-title { font-weight: 600; color: var(--color-primary); font-size: 0.95rem; }
        .item-meta { font-size: 0.75rem; color: var(--color-text-muted); }
        .item-subtitle { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.25rem; }
        .item-preview { font-size: 0.85rem; color: var(--color-text-main); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .status-pill {
            display: inline-block; font-size: 0.7rem; padding: 0.2rem 0.6rem; border-radius: 99px; font-weight: 600; text-transform: uppercase;
        }
        .status-pill[data-status="confirmed"] { background: #dcfce7; color: #166534; }
        .status-pill[data-status="cancelled"] { background: #fee2e2; color: #991b1b; }
        .status-pill[data-status="pending"] { background: #fef9c3; color: #854d0e; }

        @media (max-width: 1024px) {
          .dashboard-content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
