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
            color: '#3b82f6',
            bgColor: '#eff6ff',
        },
        {
            label: 'Ungelesen',
            value: stats.unread,
            icon: <MailOpen size={24} />,
            color: '#f59e0b',
            bgColor: '#fff7ed',
        },
        {
            label: 'Heute',
            value: stats.today,
            icon: <TrendingUp size={24} />,
            color: '#10b981',
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
            color: #3b82f6;
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
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #64748b;
          font-size: 1.05rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .recent-messages-section {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: gap 0.2s ease;
        }

        .view-all-link:hover {
          gap: 0.75rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #94a3b8;
        }

        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .message-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .message-item.unread {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .message-icon {
          width: 40px;
          height: 40px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
        }

        .message-item.unread .message-icon {
          background: #3b82f6;
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
          color: #1e293b;
          font-size: 0.95rem;
        }

        .message-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: #64748b;
          flex-shrink: 0;
        }

        .message-email {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .message-preview {
          font-size: 0.9rem;
          color: #475569;
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
