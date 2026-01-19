import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, MailOpen, Search, Filter, Trash2, X,
    ExternalLink, Calendar, User, AtSign, MessageSquare,
    ChevronLeft, ChevronRight, Loader2, Check
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from './AdminLayout';

const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const messagesPerPage = 20;

    useEffect(() => {
        fetchMessages();

        // Subscribe to real-time updates
        const subscription = supabase
            .channel('messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
                fetchMessages();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Filter and search messages
        let result = messages;

        // Apply status filter
        if (filterStatus === 'read') {
            result = result.filter(m => m.is_read);
        } else if (filterStatus === 'unread') {
            result = result.filter(m => !m.is_read);
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(term) ||
                m.email.toLowerCase().includes(term) ||
                m.message.toLowerCase().includes(term)
            );
        }

        setFilteredMessages(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [messages, searchTerm, filterStatus]);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (messageId, currentStatus) => {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .update({ is_read: !currentStatus })
                .eq('id', messageId);

            if (error) throw error;
            fetchMessages();
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', messageId);

            if (error) throw error;
            setDeleteConfirm(null);
            setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pagination
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

    if (loading) {
        return (
            <AdminLayout>
                <div className="loading-container">
                    <Loader2 size={48} className="spin-icon" />
                    <p>Nachrichten werden geladen...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="messages-container">
                {/* Header */}
                <div className="messages-header">
                    <div>
                        <h1>Nachrichten</h1>
                        <p>{filteredMessages.length} {filterStatus === 'all' ? 'Gesamt' : filterStatus === 'read' ? 'Gelesene' : 'Ungelesene'}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="controls-bar">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Suchen nach Name, E-Mail oder Nachricht..."
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
                            className={`filter-btn ${filterStatus === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('unread')}
                        >
                            Ungelesen
                        </button>
                        <button
                            className={`filter-btn ${filterStatus === 'read' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('read')}
                        >
                            Gelesen
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                {currentMessages.length === 0 ? (
                    <div className="empty-state">
                        <Mail size={64} />
                        <h3>Keine Nachrichten gefunden</h3>
                        <p>
                            {searchTerm || filterStatus !== 'all'
                                ? 'Versuchen Sie, Ihre Filter zu ändern.'
                                : 'Es sind noch keine Kontaktnachrichten vorhanden.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="messages-list">
                            {currentMessages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`message-card ${!message.is_read ? 'unread' : ''}`}
                                    onClick={() => setSelectedMessage(message)}
                                >
                                    <div className="message-card-icon">
                                        {message.is_read ? <MailOpen size={24} /> : <Mail size={24} />}
                                    </div>

                                    <div className="message-card-content">
                                        <div className="message-card-header">
                                            <h3>{message.name}</h3>
                                            <span className="message-date">
                                                <Calendar size={14} />
                                                {formatDate(message.created_at)}
                                            </span>
                                        </div>
                                        <div className="message-email">{message.email}</div>
                                        <div className="message-preview">
                                            {message.message.substring(0, 150)}
                                            {message.message.length > 150 ? '...' : ''}
                                        </div>
                                    </div>

                                    <div className="message-card-actions" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="action-btn"
                                            onClick={() => toggleReadStatus(message.id, message.is_read)}
                                            title={message.is_read ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
                                        >
                                            {message.is_read ? <Mail size={18} /> : <Check size={18} />}
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => setDeleteConfirm(message.id)}
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
                                    <ChevronLeft size={20} />
                                    Zurück
                                </button>
                                <span className="pagination-info">
                                    Seite {currentPage} von {totalPages}
                                </span>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Weiter
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Message Detail Modal */}
                <AnimatePresence>
                    {selectedMessage && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                        >
                            <motion.div
                                className="modal-content"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h2>Nachricht Details</h2>
                                    <button className="modal-close" onClick={() => setSelectedMessage(null)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <User size={18} />
                                            Name
                                        </div>
                                        <div className="detail-value">{selectedMessage.name}</div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <AtSign size={18} />
                                            E-Mail
                                        </div>
                                        <div className="detail-value">
                                            <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="detail-label">
                                            <Calendar size={18} />
                                            Datum
                                        </div>
                                        <div className="detail-value">{formatDate(selectedMessage.created_at)}</div>
                                    </div>

                                    <div className="detail-item full-width">
                                        <div className="detail-label">
                                            <MessageSquare size={18} />
                                            Nachricht
                                        </div>
                                        <div className="detail-value message-text">{selectedMessage.message}</div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="modal-btn secondary"
                                        onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.is_read)}
                                    >
                                        {selectedMessage.is_read ? <Mail size={18} /> : <Check size={18} />}
                                        {selectedMessage.is_read ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
                                    </button>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="modal-btn primary"
                                    >
                                        <ExternalLink size={18} />
                                        Per E-Mail antworten
                                    </a>
                                    <button
                                        className="modal-btn delete"
                                        onClick={() => setDeleteConfirm(selectedMessage.id)}
                                    >
                                        <Trash2 size={18} />
                                        Löschen
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
                                <h3>Nachricht löschen?</h3>
                                <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
                                <div className="confirm-actions">
                                    <button className="confirm-btn cancel" onClick={() => setDeleteConfirm(null)}>
                                        Abbrechen
                                    </button>
                                    <button className="confirm-btn delete" onClick={() => deleteMessage(deleteConfirm)}>
                                        Löschen
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
          background: #eff6ff;
          border-color: #bfdbfe;
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

        .message-card.unread .message-card-icon {
          background: #3b82f6;
          color: white;
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

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
          padding: 1.5rem;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          color: #1e293b;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #64748b;
          font-weight: 500;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.5rem;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #1e293b;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #64748b;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-value {
          font-size: 1.05rem;
          color: #1e293b;
        }

        .detail-value a {
          color: #3b82f6;
          text-decoration: none;
        }

        .detail-value a:hover {
          text-decoration: underline;
        }

        .message-text {
          white-space: pre-wrap;
          line-height: 1.6;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          flex-wrap: wrap;
        }

        .modal-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .modal-btn.primary {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .modal-btn.primary:hover {
          background: #2563eb;
        }

        .modal-btn.secondary {
          background: white;
          color: #1e293b;
          border: 2px solid #e2e8f0;
        }

        .modal-btn.secondary:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .modal-btn.delete {
          background: white;
          color: #dc2626;
          border: 2px solid #fecaca;
        }

        .modal-btn.delete:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        /* Confirm Modal */
        .confirm-modal {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 400px;
          text-align: center;
        }

        .confirm-icon {
          width: 64px;
          height: 64px;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .confirm-modal h3 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .confirm-modal p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .confirm-actions {
          display: flex;
          gap: 1rem;
        }

        .confirm-btn {
          flex: 1;
          padding: 0.875rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .confirm-btn.cancel {
          background: white;
          color: #1e293b;
          border: 2px solid #e2e8f0;
        }

        .confirm-btn.cancel:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .confirm-btn.delete {
          background: #dc2626;
          color: white;
          border: none;
        }

        .confirm-btn.delete:hover {
          background: #b91c1c;
        }

        @media (max-width: 768px) {
          .messages-header h1 {
            font-size: 1.5rem;
          }

          .controls-bar {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .message-card {
            flex-direction: column;
          }

          .message-card-actions {
            flex-direction: row;
          }

          .message-card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .modal-body {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
        </AdminLayout>
    );
};

export default MessageList;
