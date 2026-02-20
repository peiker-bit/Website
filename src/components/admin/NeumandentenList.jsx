import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, X, ChevronLeft, ChevronRight, Loader2,
  UserPlus, Eye, Calendar, ArrowUpDown, RefreshCw, Trash2, CheckSquare
} from 'lucide-react';
import { listSessions, deleteSession, bulkDeleteSessions, isFragebogenEnabled } from '../../lib/fragebogenClient';
import AdminLayout from './AdminLayout';

const STATUS_MAP = {
  neu: { label: 'Neu', color: '#3b82f6', bg: '#eff6ff' },
  in_bearbeitung: { label: 'In Bearbeitung', color: '#f59e0b', bg: '#fffbeb' },
  erledigt: { label: 'Erledigt', color: '#10b981', bg: '#ecfdf5' },
};

const TYPE_MAP = {
  PRIVATE: 'Privatperson',
  SOLE: 'Einzelunternehmen',
  COMPANY: 'Unternehmen',
};

const NeumandentenList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAdminStatus, setFilterAdminStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterHasChildren, setFilterHasChildren] = useState('');

  // Sort
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  // Filters panel open
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Multi-select
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isFragebogenEnabled) {
      setError('Fragebogen-Feature ist nicht konfiguriert. Bitte ENV-Variablen prüfen.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await listSessions({
        page,
        pageSize,
        sortBy,
        sortDir,
        adminStatus: filterAdminStatus || undefined,
        status: filterStatus || undefined,
        dateFrom: filterDateFrom || undefined,
        dateTo: filterDateTo || undefined,
        hasChildren: filterHasChildren || undefined,
        search: searchTerm || undefined,
      });

      setSessions(result.sessions || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error('Error fetching Neumandanten:', err);
      setError(err.message || 'Fehler beim Laden der Datensätze.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortDir, filterAdminStatus, filterStatus, filterDateFrom, filterDateTo, filterHasChildren, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setFilterAdminStatus('');
    setFilterStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterHasChildren('');
    setSearchInput('');
    setSearchTerm('');
    setPage(1);
  };

  const hasActiveFilters = filterAdminStatus || filterStatus || filterDateFrom || filterDateTo || filterHasChildren || searchTerm;

  // Delete handler
  const handleDelete = async (sess) => {
    const name = sess.name || 'Unbekannt';
    if (!window.confirm(`Möchten Sie den Datensatz von "${name}" wirklich unwiderruflich löschen?\n\nAlle zugehörigen Daten (Personen, Adressen, Steuer, Dokumente etc.) werden ebenfalls gelöscht.`)) {
      return;
    }
    try {
      await deleteSession(sess.id);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(sess.id); return n; });
      fetchData();
    } catch (err) {
      alert(`Fehler beim Löschen: ${err.message}`);
    }
  };

  // Multi-select handlers
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sessions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sessions.map(s => s.id)));
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    if (count === 0) return;
    if (!window.confirm(`Möchten Sie ${count} Datensätze unwiderruflich löschen?\n\nAlle zugehörigen Daten werden ebenfalls gelöscht.`)) {
      return;
    }
    try {
      setBulkDeleting(true);
      const result = await bulkDeleteSessions([...selectedIds]);
      setSelectedIds(new Set());
      if (result.failed > 0) {
        alert(`${result.success} gelöscht, ${result.failed} fehlgeschlagen.`);
      }
      fetchData();
    } catch (err) {
      alert(`Fehler beim Löschen: ${err.message}`);
    } finally {
      setBulkDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '–';
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '–';
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (!isFragebogenEnabled) {
    return (
      <AdminLayout>
        <div className="nm-error-state">
          <UserPlus size={64} />
          <h3>Fragebogen nicht konfiguriert</h3>
          <p>Bitte setzen Sie VITE_FRAGEBOGEN_SUPABASE_URL und VITE_FRAGEBOGEN_SUPABASE_ANON_KEY in der .env Datei.</p>
        </div>
        <style>{styles}</style>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="nm-container">
        {/* Header */}
        <div className="nm-header">
          <div>
            <h1>Neumandanten</h1>
            <p className="nm-subtitle">
              {total} Datensätze{hasActiveFilters ? ' (gefiltert)' : ''}
            </p>
          </div>
          <div className="nm-header-actions">
            <button className="nm-btn nm-btn-outline" onClick={fetchData} title="Aktualisieren">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="nm-controls">
          <div className="nm-search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Suche nach Name oder E-Mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button className="nm-clear-search" onClick={() => { setSearchInput(''); setSearchTerm(''); }}>
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className={`nm-btn ${filtersOpen || hasActiveFilters ? 'nm-btn-primary' : 'nm-btn-outline'}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter size={16} />
            Filter
            {hasActiveFilters && <span className="nm-filter-badge">!</span>}
          </button>
        </div>

        {/* Expandable Filters */}
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="nm-filter-panel"
          >
            <div className="nm-filter-grid">
              <div className="nm-filter-group">
                <label>Admin-Status</label>
                <select value={filterAdminStatus} onChange={e => { setFilterAdminStatus(e.target.value); setPage(1); }}>
                  <option value="">Alle</option>
                  <option value="neu">Neu</option>
                  <option value="in_bearbeitung">In Bearbeitung</option>
                  <option value="erledigt">Erledigt</option>
                </select>
              </div>
              <div className="nm-filter-group">
                <label>Fragebogen-Status</label>
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
                  <option value="">Alle</option>
                  <option value="DRAFT">Entwurf</option>
                  <option value="SUBMITTED">Eingereicht</option>
                  <option value="PROCESSED">Verarbeitet</option>
                </select>
              </div>
              <div className="nm-filter-group">
                <label>Von</label>
                <input type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setPage(1); }} />
              </div>
              <div className="nm-filter-group">
                <label>Bis</label>
                <input type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setPage(1); }} />
              </div>
              <div className="nm-filter-group">
                <label>Kinder</label>
                <select value={filterHasChildren} onChange={e => { setFilterHasChildren(e.target.value); setPage(1); }}>
                  <option value="">Alle</option>
                  <option value="yes">Ja</option>
                  <option value="no">Nein</option>
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <button className="nm-btn nm-btn-text" onClick={clearFilters}>
                <X size={14} /> Filter zurücksetzen
              </button>
            )}
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="nm-error-banner">
            <p>{error}</p>
            <button onClick={fetchData} className="nm-btn nm-btn-outline">Erneut versuchen</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="nm-loading">
            <Loader2 size={40} className="nm-spin" />
            <p>Daten werden geladen...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && sessions.length === 0 && (
          <div className="nm-empty-state">
            <UserPlus size={64} />
            <h3>Keine Datensätze gefunden</h3>
            <p>{hasActiveFilters ? 'Versuchen Sie, Ihre Filter anzupassen.' : 'Es sind noch keine Neumandanten-Eingänge vorhanden.'}</p>
          </div>
        )}

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="nm-bulk-bar"
          >
            <span className="nm-bulk-count">{selectedIds.size} ausgewählt</span>
            <button
              className="nm-btn nm-btn-danger"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? <Loader2 size={16} className="nm-spin" /> : <Trash2 size={16} />}
              {bulkDeleting ? 'Lösche...' : `${selectedIds.size} löschen`}
            </button>
            <button className="nm-btn nm-btn-outline" onClick={() => setSelectedIds(new Set())}>
              Auswahl aufheben
            </button>
          </motion.div>
        )}

        {/* Table */}
        {!loading && !error && sessions.length > 0 && (
          <>
            <div className="nm-table-wrapper">
              <table className="nm-table">
                <thead>
                  <tr>
                    <th className="nm-th-checkbox">
                      <input
                        type="checkbox"
                        checked={sessions.length > 0 && selectedIds.size === sessions.length}
                        onChange={toggleSelectAll}
                        className="nm-checkbox"
                      />
                    </th>
                    <th className="nm-th-sortable" onClick={() => handleSort('created_at')}>
                      Eingang
                      {sortBy === 'created_at' && <ArrowUpDown size={14} />}
                    </th>
                    <th>Name / Kontakt</th>
                    <th>Typ</th>
                    <th>Status</th>
                    <th>Kinder</th>
                    <th className="nm-th-sortable" onClick={() => handleSort('updated_at')}>
                      Letzte Änderung
                      {sortBy === 'updated_at' && <ArrowUpDown size={14} />}
                    </th>
                    <th>Version</th>
                    <th>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((sess, idx) => {
                    const statusInfo = STATUS_MAP[sess.adminStatus] || STATUS_MAP.neu;
                    return (
                      <motion.tr
                        key={sess.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={selectedIds.has(sess.id) ? 'nm-row-selected' : ''}
                      >
                        <td className="nm-td-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(sess.id)}
                            onChange={() => toggleSelect(sess.id)}
                            className="nm-checkbox"
                          />
                        </td>
                        <td className="nm-td-date">
                          <Calendar size={14} />
                          {formatDate(sess.createdAt)}
                        </td>
                        <td>
                          <div className="nm-contact-cell">
                            <span className="nm-name">{sess.name || 'Noch nicht angegeben'}</span>
                            {sess.email && <span className="nm-email">{sess.email}</span>}
                          </div>
                        </td>
                        <td>
                          <span className="nm-type-badge">{TYPE_MAP[sess.type] || sess.type}</span>
                        </td>
                        <td>
                          <span
                            className="nm-status-badge"
                            style={{ color: statusInfo.color, background: statusInfo.bg }}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="nm-td-center">{sess.childrenCount || 0}</td>
                        <td className="nm-td-date">
                          {formatShortDate(sess.updatedAt)}
                        </td>
                        <td className="nm-td-center">{sess.currentVersion || 1}</td>
                        <td>
                          <div className="nm-action-cell">
                            <Link to={`/admin/neumandanten/${sess.id}`} className="nm-detail-link">
                              <Eye size={16} />
                              Details
                            </Link>
                            <button
                              className="nm-delete-btn"
                              onClick={() => handleDelete(sess)}
                              title="Datensatz löschen"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="nm-pagination">
                <button
                  className="nm-pagination-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={18} /> Zurück
                </button>
                <span className="nm-pagination-info">
                  Seite {page} von {totalPages} ({total} Einträge)
                </span>
                <button
                  className="nm-pagination-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Weiter <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <style>{styles}</style>
    </AdminLayout>
  );
};

const styles = `
  .nm-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .nm-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .nm-header h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
    line-height: 1;
  }

  .nm-subtitle {
    color: var(--color-text-muted);
    font-size: 1.05rem;
  }

  .nm-header-actions {
    display: flex;
    gap: 0.75rem;
  }

  /* Buttons */
  .nm-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
    position: relative;
  }

  .nm-btn-outline {
    background: white;
    border-color: #e2e8f0;
    color: #475569;
  }
  .nm-btn-outline:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  .nm-btn-primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }
  .nm-btn-primary:hover {
    background: #2563eb;
  }

  .nm-btn-text {
    background: none;
    border: none;
    color: #64748b;
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  .nm-btn-text:hover {
    color: #ef4444;
  }

  .nm-btn-danger {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }
  .nm-btn-danger:hover {
    background: #dc2626;
  }
  .nm-btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .nm-filter-badge {
    width: 8px;
    height: 8px;
    background: #ef4444;
    border-radius: 50%;
    position: absolute;
    top: 6px;
    right: 6px;
  }

  /* Search */
  .nm-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .nm-search-box {
    flex: 1;
    min-width: 280px;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 0 1rem;
    transition: border-color 0.2s;
  }
  .nm-search-box:focus-within {
    border-color: #3b82f6;
  }
  .nm-search-box svg:first-child {
    color: #94a3b8;
    flex-shrink: 0;
  }
  .nm-search-box input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.875rem 0.75rem;
    font-size: 0.95rem;
    background: transparent;
  }
  .nm-clear-search {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
  }

  /* Filter Panel */
  .nm-filter-panel {
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .nm-filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .nm-filter-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.375rem;
  }

  .nm-filter-group select,
  .nm-filter-group input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    background: white;
    color: #1e293b;
    transition: border-color 0.2s;
  }
  .nm-filter-group select:focus,
  .nm-filter-group input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  /* Error & Loading & Empty */
  .nm-error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    color: #dc2626;
    font-weight: 500;
  }

  .nm-loading, .nm-empty-state, .nm-error-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #94a3b8;
  }
  .nm-loading svg, .nm-empty-state svg, .nm-error-state svg {
    margin-bottom: 1rem;
    opacity: 0.3;
  }
  .nm-loading h3, .nm-empty-state h3, .nm-error-state h3 {
    color: #475569;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  .nm-spin {
    color: #3b82f6;
    animation: nm-spin 1s linear infinite;
  }
  @keyframes nm-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Table */
  .nm-table-wrapper {
    background: white;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    overflow-x: auto;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .nm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.925rem;
  }

  .nm-table thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }

  .nm-table th {
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 700;
    color: #475569;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .nm-th-sortable {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  .nm-th-sortable:hover {
    color: #3b82f6;
  }

  .nm-th-checkbox, .nm-td-checkbox {
    width: 40px;
    text-align: center;
    padding-left: 1rem !important;
    padding-right: 0.25rem !important;
  }

  .nm-checkbox {
    width: 18px;
    height: 18px;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .nm-row-selected {
    background: #eff6ff !important;
  }

  /* Bulk action bar */
  .nm-bulk-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1.25rem;
    background: #1e293b;
    border-radius: 14px;
    margin-bottom: 1rem;
  }
  .nm-bulk-count {
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
    margin-right: auto;
  }
  .nm-bulk-bar .nm-btn-outline {
    border-color: #475569;
    color: #e2e8f0;
  }
  .nm-bulk-bar .nm-btn-outline:hover {
    border-color: #94a3b8;
    background: #334155;
  }

  .nm-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .nm-table tbody tr {
    transition: background 0.15s;
  }
  .nm-table tbody tr:hover {
    background: #f8fafc;
  }

  .nm-td-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    white-space: nowrap;
    font-size: 0.875rem;
  }

  .nm-td-center {
    text-align: center;
  }

  .nm-contact-cell {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .nm-name {
    font-weight: 600;
    color: #1e293b;
  }

  .nm-email {
    font-size: 0.825rem;
    color: #3b82f6;
  }

  .nm-type-badge {
    background: #f0f9ff;
    color: #0369a1;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .nm-status-badge {
    padding: 0.3rem 0.75rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .nm-detail-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: #3b82f6;
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    padding: 0.375rem 0.75rem;
    border-radius: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .nm-detail-link:hover {
    background: #eff6ff;
    color: #2563eb;
  }

  .nm-action-cell {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .nm-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: #94a3b8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nm-delete-btn:hover {
    background: #fef2f2;
    color: #ef4444;
  }

  /* Pagination */
  .nm-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
    padding: 1rem;
  }

  .nm-pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    color: #1e293b;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  .nm-pagination-btn:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  .nm-pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nm-pagination-info {
    color: #64748b;
    font-weight: 500;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .nm-table-wrapper {
      border-radius: 10px;
    }
    .nm-table th,
    .nm-table td {
      padding: 0.75rem 0.75rem;
      font-size: 0.85rem;
    }
    .nm-filter-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

export default NeumandentenList;
