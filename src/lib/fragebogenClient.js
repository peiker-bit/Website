/**
 * Fragebogen Neumandant – Direct Supabase Client
 * 
 * Connects directly to the Fragebogen Supabase project using the service_role key.
 * This bypasses RLS and provides full read access to questionnaire data.
 * 
 * SECURITY NOTE: The service_role key is used because:
 * - The admin area is already protected by main Supabase auth (ProtectedRoute)
 * - Cross-project auth doesn't work (admin users exist on main project, not Fragebogen)
 * - RLS policies on Fragebogen require staff/admin role that can't be satisfied cross-project
 * - This is the same pattern used by bookingClient.js for the booking DB
 */

import { createClient } from '@supabase/supabase-js';

const FB_URL = import.meta.env.VITE_FRAGEBOGEN_SUPABASE_URL;
const FB_KEY = import.meta.env.VITE_FRAGEBOGEN_SUPABASE_SERVICE_KEY
    || import.meta.env.VITE_FRAGEBOGEN_SUPABASE_ANON_KEY;

// ─── Fail-fast check ─────────────────────────────────────────────
export const isFragebogenEnabled = !!(FB_URL && FB_KEY);

if (!isFragebogenEnabled) {
    console.warn(
        '⚠️ Fragebogen Neumandant: ENV-Variablen fehlen. Feature deaktiviert.'
    );
}

// ─── Supabase Client ─────────────────────────────────────────────
const fragebogenSupabase = isFragebogenEnabled
    ? createClient(FB_URL, FB_KEY)
    : null;

// ─── Helpers ─────────────────────────────────────────────────────

function getClient() {
    if (!fragebogenSupabase) {
        throw new Error('Fragebogen-Feature ist nicht konfiguriert. Bitte ENV-Variablen prüfen.');
    }
    return fragebogenSupabase;
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * List intake sessions with pagination, filters, search, sort.
 */
export const listSessions = async (params) => {
    const fb = getClient();
    const {
        page = 1,
        pageSize = 20,
        sortBy = 'created_at',
        sortDir = 'desc',
        status,
        adminStatus,
        dateFrom,
        dateTo,
        hasChildren,
        search,
    } = params;

    const validSortColumns = ['created_at', 'updated_at', 'submitted_at', 'status'];
    const col = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const ascending = sortDir === 'asc';

    // Build query
    let query = fb
        .from('intake_sessions')
        .select(`
      id, status, type, created_at, updated_at, submitted_at,
      admin_status, current_version,
      client_person(first_name, last_name, email, phone),
      family_data(marital_status, spouse_included),
      children(id)
    `, { count: 'exact' });

    // Filters
    if (status) query = query.eq('status', status);
    if (adminStatus) query = query.eq('admin_status', adminStatus);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo + 'T23:59:59');

    // Default: hide DELETED and DRAFT (unless explicitly asked for status='DRAFT')
    if (!status) {
        query = query.neq('status', 'DELETED').neq('status', 'DRAFT');
    }

    // Sort & paginate
    query = query.order(col, { ascending });
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(`Datenbankfehler: ${error.message}`);

    let sessions = data || [];

    // Client-side filters for joined tables
    if (search) {
        const s = search.toLowerCase();
        sessions = sessions.filter((sess) => {
            const cp = sess.client_person;
            if (!cp) return false;
            return (
                (cp.first_name || '').toLowerCase().includes(s) ||
                (cp.last_name || '').toLowerCase().includes(s) ||
                (cp.email || '').toLowerCase().includes(s)
            );
        });
    }

    if (hasChildren === 'yes') {
        sessions = sessions.filter(s => s.children && s.children.length > 0);
    } else if (hasChildren === 'no') {
        sessions = sessions.filter(s => !s.children || s.children.length === 0);
    }

    // Map for response
    const mapped = sessions.map((sess) => ({
        id: sess.id,
        status: sess.status,
        adminStatus: sess.admin_status || 'neu',
        type: sess.type,
        createdAt: sess.created_at,
        updatedAt: sess.updated_at,
        submittedAt: sess.submitted_at,
        currentVersion: sess.current_version,
        name: sess.client_person
            ? `${sess.client_person.first_name || ''} ${sess.client_person.last_name || ''}`.trim()
            : null,
        email: sess.client_person?.email || null,
        phone: sess.client_person?.phone || null,
        maritalStatus: sess.family_data?.marital_status || null,
        childrenCount: sess.children?.length || 0,
    }));

    return { sessions: mapped, total: count || 0, page, pageSize };
};

/**
 * Get full session detail with all joined tables.
 */
export const getSessionDetail = async (sessionId) => {
    const fb = getClient();

    const { data: session, error } = await fb
        .from('intake_sessions')
        .select(`
      *,
      client_person(*),
      address(*),
      tax_data(*),
      family_data(*),
      spouse(*),
      children(*),
      business_data(*),
      uploads(id, original_name, mime_type, size_bytes, created_at, scan_result),
      consents(*)
    `)
        .eq('id', sessionId)
        .single();

    if (error || !session) throw new Error('Datensatz nicht gefunden.');

    // Remove security-sensitive fields
    delete session.token_hash;
    delete session.ip_hash;
    delete session.user_agent_hash;

    return { session };
};

/**
 * Get versions history for a session.
 */
export const getSessionVersions = async (sessionId) => {
    const fb = getClient();

    const { data, error } = await fb
        .from('questionnaire_versions')
        .select('id, session_id, version_number, source, created_at, previous_version_id')
        .eq('session_id', sessionId)
        .order('version_number', { ascending: false });

    if (error) throw new Error(`Fehler beim Laden der Versionen: ${error.message}`);
    return { versions: data || [] };
};

/**
 * Get audit/data change logs for a session.
 */
export const getSessionAuditLog = async (sessionId) => {
    const fb = getClient();

    const { data, error } = await fb
        .from('data_change_logs')
        .select('id, version_number, changed_fields, user_type, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Fehler beim Laden des Audit-Logs: ${error.message}`);
    return { auditLog: data || [] };
};

/**
 * Update admin status of a session.
 */
export const updateSessionStatus = async (sessionId, adminStatus) => {
    const fb = getClient();

    const validStatuses = ['neu', 'in_bearbeitung', 'erledigt'];
    if (!validStatuses.includes(adminStatus)) {
        throw new Error(`Ungültiger Status: ${adminStatus}`);
    }

    const { error } = await fb
        .from('intake_sessions')
        .update({ admin_status: adminStatus })
        .eq('id', sessionId);

    if (error) throw new Error(`Statusänderung fehlgeschlagen: ${error.message}`);
    return { success: true };
};

/**
 * Add internal admin note to a session.
 */
export const addSessionNote = async (sessionId, note) => {
    const fb = getClient();

    // First fetch existing notes
    const { data: session } = await fb
        .from('intake_sessions')
        .select('admin_notes')
        .eq('id', sessionId)
        .single();

    const existingNotes = session?.admin_notes || '';
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n---\n${newNote}` : newNote;

    const { error } = await fb
        .from('intake_sessions')
        .update({ admin_notes: updatedNotes })
        .eq('id', sessionId);

    if (error) throw new Error(`Notiz speichern fehlgeschlagen: ${error.message}`);
    return { success: true, notes: updatedNotes };
};

/**
 * Get dashboard stats (counts).
 */
export const getFragebogenStats = async () => {
    const fb = getClient();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalRes, newRes, submittedRes, todayRes] = await Promise.all([
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).neq('status', 'DELETED').neq('status', 'DRAFT'),
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).eq('admin_status', 'neu').neq('status', 'DELETED').neq('status', 'DRAFT'),
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).eq('status', 'SUBMITTED'),
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()).neq('status', 'DELETED').neq('status', 'DRAFT'),
    ]);

    return {
        total: totalRes.count || 0,
        new: newRes.count || 0,
        submitted: submittedRes.count || 0,
        today: todayRes.count || 0,
    };
};

/**
 * Delete a session and all related data.
 * 
 * CORRECT FK deletion order:
 *   1. data_change_logs  (references both intake_sessions AND questionnaire_versions with RESTRICT)
 *   2. questionnaire_versions  (references intake_sessions with RESTRICT)
 *   3. access_tokens  (CASCADE, but delete explicitly for safety)
 *   4. audit_logs  (may reference session)
 *   5. intake_sessions  (all remaining child tables CASCADE automatically)
 */
export const deleteSession = async (sessionId) => {
    const fb = getClient();

    // 1) data_change_logs FIRST (FK → questionnaire_versions + intake_sessions, both RESTRICT)
    const { error: logErr } = await fb
        .from('data_change_logs')
        .delete()
        .eq('session_id', sessionId);
    if (logErr) {
        throw new Error(`Löschen fehlgeschlagen (data_change_logs): ${logErr.message}`);
    }

    // 2) questionnaire_versions (FK → intake_sessions with RESTRICT)
    const { error: verErr } = await fb
        .from('questionnaire_versions')
        .delete()
        .eq('session_id', sessionId);
    if (verErr) {
        throw new Error(`Löschen fehlgeschlagen (questionnaire_versions): ${verErr.message}`);
    }

    // 3) access_tokens (CASCADE, but explicit for clarity)
    await fb.from('access_tokens').delete().eq('session_id', sessionId);

    // 4) audit_logs (if exists)
    await fb.from('audit_logs').delete().eq('session_id', sessionId);

    // 5) intake_session – remaining child tables (client_person, address, etc.) CASCADE
    const { error } = await fb
        .from('intake_sessions')
        .delete()
        .eq('id', sessionId);

    if (error) throw new Error(`Löschen fehlgeschlagen: ${error.message}`);
    return { success: true };
};

/**
 * Bulk delete multiple sessions.
 * @param {string[]} sessionIds - Array of session UUIDs to delete
 */
export const bulkDeleteSessions = async (sessionIds) => {
    const results = { success: 0, failed: 0, errors: [] };

    for (const id of sessionIds) {
        try {
            await deleteSession(id);
            results.success++;
        } catch (err) {
            results.failed++;
            results.errors.push({ id, error: err.message });
        }
    }

    return results;
};
