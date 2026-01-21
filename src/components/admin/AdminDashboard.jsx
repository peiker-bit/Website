import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MailOpen, TrendingUp, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('dashboard_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

      setStats({ total, unread, today });

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

  const statCards = [
    {
      label: 'Gesamt Nachrichten',
      value: stats.total,
      icon: <Mail size={24} />,
      color: 'var(--color-secondary)',
      bgColor: '#eff6ff', // Keep light backgrounds or use opacity
    },
    {
      label: 'Ungelesen',
      value: stats.unread,
      icon: <MailOpen size={24} />,
      color: 'var(--color-cta)',
      bgColor: '#fff7ed',
    },
    {
      label: 'Heute',
      value: stats.today,
      icon: <TrendingUp size={24} />,
      color: 'var(--color-success)',
      bgColor: '#f0fdf4',
    },
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
          <p>Willkommen zurück! Hier ist eine Übersicht Ihrer Nachrichten.</p>
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

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="recent-messages-section"
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
            <div className="messages-list">
              {recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`message-item ${!message.is_read ? 'unread' : ''}`}
                >
                  <div className="message-icon">
                    {message.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-name">{message.name}</span>
                      <span className="message-time">
                        <Clock size={14} />
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <div className="message-email">{message.email}</div>
                    <div className="message-preview">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 ? '...' : ''}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

        .stat-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .recent-messages-section {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-sm);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
        }

        .section-header h2 {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: gap 0.2s ease;
        }

        .view-all-link:hover {
          gap: 0.75rem;
          color: var(--color-primary);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: var(--color-text-muted);
        }

        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .message-item {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          transition: all var(--transition-fast);
        }

        .message-item:hover {
          background: var(--color-bg-subtle);
          border-color: var(--color-primary-lighter);
        }

        .message-item.unread {
          background: rgba(79, 70, 229, 0.05); /* Very light indigo */
          border-color: rgba(79, 70, 229, 0.2);
        }

        .message-icon {
          width: 48px;
          height: 48px;
          background: var(--color-bg-subtle);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        .message-item.unread .message-icon {
          background: var(--color-secondary);
          color: white;
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
          gap: 1rem;
        }

        .message-name {
          font-weight: 600;
          color: var(--color-primary);
          font-size: 1rem;
        }

        .message-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        .message-email {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }

        .message-preview {
          font-size: 0.95rem;
          color: var(--color-text-main);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-value {
            font-size: 2rem;
          }

          .message-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;
