// ================================================================
// Fragebogen Admin – Supabase Edge Function
// Secure backend proxy for admin access to Fragebogen data
// ================================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Configuration ───────────────────────────────────────────────
// Main Supabase project (for JWT verification)
const MAIN_SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const MAIN_SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

// Fragebogen Supabase project (data source)
const FB_URL = Deno.env.get("FRAGEBOGEN_SUPABASE_URL");
const FB_SERVICE_KEY = Deno.env.get("FRAGEBOGEN_SERVICE_ROLE_KEY");

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

const jsonError = (message: string, status = 400) =>
    json({ error: message }, status);

// ─── Auth Helper ─────────────────────────────────────────────────
async function verifyAdmin(req: Request): Promise<{ userId: string; email: string; role: string }> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Nicht authentifiziert');

    const mainSupabase = createClient(MAIN_SUPABASE_URL!, MAIN_SUPABASE_ANON_KEY!, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error } = await mainSupabase.auth.getUser();
    if (error || !user) throw new Error('Ungültiges Token');

    // Check admin role – accept 'admin', 'staff', 'owner'
    const role = user.app_metadata?.role || '';
    if (!['admin', 'staff', 'owner'].includes(role)) {
        throw new Error('Zugriff verweigert: Keine Admin-Berechtigung');
    }

    return { userId: user.id, email: user.email || '', role };
}

// ─── Masking Helper ──────────────────────────────────────────────
function maskValue(value: string | null, role: string): string | null {
    if (!value) return value;
    if (role === 'admin' || role === 'owner') return value; // Full access
    // Staff: show last 4 chars
    if (value.length <= 4) return '****';
    return '***' + value.slice(-4);
}

function maskSensitiveFields(data: Record<string, any>, role: string): Record<string, any> {
    const sensitiveFields = ['tax_id', 'tax_number', 'vat_id', 'business_tax_number'];
    const masked = { ...data };
    for (const field of sensitiveFields) {
        if (masked[field]) {
            masked[field] = maskValue(masked[field], role);
        }
    }
    return masked;
}

// ─── Fragebogen DB Client ────────────────────────────────────────
function getFbClient() {
    if (!FB_URL || !FB_SERVICE_KEY) {
        throw new Error('Fragebogen-Datenbank nicht konfiguriert');
    }
    return createClient(FB_URL, FB_SERVICE_KEY);
}

// ─── Action Handlers ─────────────────────────────────────────────

async function handleList(params: any, role: string) {
    const fb = getFbClient();
    const {
        page = 1,
        pageSize = 20,
        sortBy = 'created_at',
        sortDir = 'desc',
        status,
        adminStatus,
        dateFrom,
        dateTo,
        maritalStatus,
        hasChildren,
        search,
    } = params;

    const validSortColumns = ['created_at', 'updated_at', 'submitted_at', 'status'];
    const col = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const dir = sortDir === 'asc';

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
    if (dateTo) query = query.lte('created_at', dateTo);

    // Only show non-DRAFT by default (admins usually want SUBMITTED+)
    if (!status) query = query.neq('status', 'DELETED');

    // Sort & paginate
    query = query.order(col, { ascending: dir });
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(`Datenbankfehler: ${error.message}`);

    // Post-filters that require joined data
    let sessions = data || [];

    if (search) {
        const s = search.toLowerCase();
        sessions = sessions.filter((sess: any) => {
            const cp = sess.client_person;
            if (!cp) return false;
            return (
                cp.first_name?.toLowerCase().includes(s) ||
                cp.last_name?.toLowerCase().includes(s) ||
                cp.email?.toLowerCase().includes(s)
            );
        });
    }

    if (maritalStatus) {
        sessions = sessions.filter((sess: any) =>
            sess.family_data?.marital_status === maritalStatus
        );
    }

    if (hasChildren === 'yes') {
        sessions = sessions.filter((sess: any) =>
            sess.children && sess.children.length > 0
        );
    } else if (hasChildren === 'no') {
        sessions = sessions.filter((sess: any) =>
            !sess.children || sess.children.length === 0
        );
    }

    // Map for response (mask sensitive data)
    const mapped = sessions.map((sess: any) => ({
        id: sess.id,
        status: sess.status,
        adminStatus: sess.admin_status || 'neu',
        type: sess.type,
        createdAt: sess.created_at,
        updatedAt: sess.updated_at,
        submittedAt: sess.submitted_at,
        currentVersion: sess.current_version,
        name: sess.client_person
            ? `${sess.client_person.first_name} ${sess.client_person.last_name}`
            : null,
        email: sess.client_person?.email || null,
        phone: sess.client_person?.phone || null,
        maritalStatus: sess.family_data?.marital_status || null,
        childrenCount: sess.children?.length || 0,
    }));

    return { sessions: mapped, total: count || 0, page, pageSize };
}

async function handleDetail(params: any, role: string) {
    const fb = getFbClient();
    const { sessionId } = params;
    if (!sessionId) throw new Error('Session-ID fehlt');

    // Fetch session with all related data
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

    if (error || !session) throw new Error('Datensatz nicht gefunden');

    // Mask sensitive fields based on role
    const result: any = { ...session };
    if (result.tax_data) {
        result.tax_data = maskSensitiveFields(result.tax_data, role);
    }
    if (result.spouse?.tax_id) {
        result.spouse = { ...result.spouse, tax_id: maskValue(result.spouse.tax_id, role) };
    }
    if (result.children) {
        result.children = result.children.map((child: any) => ({
            ...child,
            tax_id: maskValue(child.tax_id, role),
        }));
    }
    if (result.business_data) {
        result.business_data = maskSensitiveFields(result.business_data, role);
    }

    // Remove token_hash and ip/ua hashes (security)
    delete result.token_hash;
    delete result.ip_hash;
    delete result.user_agent_hash;

    return { session: result };
}

async function handleVersions(params: any) {
    const fb = getFbClient();
    const { sessionId } = params;
    if (!sessionId) throw new Error('Session-ID fehlt');

    const { data, error } = await fb
        .from('questionnaire_versions')
        .select('id, session_id, version_number, source, created_at, previous_version_id')
        .eq('session_id', sessionId)
        .order('version_number', { ascending: false });

    if (error) throw new Error(`Datenbankfehler: ${error.message}`);
    return { versions: data || [] };
}

async function handleAudit(params: any) {
    const fb = getFbClient();
    const { sessionId } = params;
    if (!sessionId) throw new Error('Session-ID fehlt');

    const { data, error } = await fb
        .from('data_change_logs')
        .select('id, version_number, changed_fields, user_type, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Datenbankfehler: ${error.message}`);
    return { auditLog: data || [] };
}

async function handleUpdateStatus(params: any, userId: string) {
    const fb = getFbClient();
    const { sessionId, adminStatus } = params;
    if (!sessionId) throw new Error('Session-ID fehlt');

    const validStatuses = ['neu', 'in_bearbeitung', 'erledigt'];
    if (!validStatuses.includes(adminStatus)) {
        throw new Error(`Ungültiger Status: ${adminStatus}`);
    }

    const { error } = await fb
        .from('intake_sessions')
        .update({ admin_status: adminStatus })
        .eq('id', sessionId);

    if (error) throw new Error(`Statusänderung fehlgeschlagen: ${error.message}`);

    // Audit log
    await fb.from('audit_logs').insert({
        actor_user_id: userId,
        action: 'ADMIN_STATUS_CHANGE',
        session_id: sessionId,
        meta: { new_status: adminStatus },
    });

    return { success: true };
}

async function handleAddNote(params: any, userId: string) {
    const fb = getFbClient();
    const { sessionId, note } = params;
    if (!sessionId || !note) throw new Error('Session-ID und Notiz erforderlich');

    // Append note (simple approach: overwrite field, or could be a separate table)
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

    // Audit log
    await fb.from('audit_logs').insert({
        actor_user_id: userId,
        action: 'ADMIN_NOTE_ADDED',
        session_id: sessionId,
        meta: { note_length: note.length },
    });

    return { success: true, notes: updatedNotes };
}

async function handleStats() {
    const fb = getFbClient();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalRes, newRes, submittedRes, todayRes] = await Promise.all([
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).neq('status', 'DELETED'),
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).eq('admin_status', 'neu').neq('status', 'DELETED'),
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).eq('status', 'SUBMITTED'),
        fb.from('intake_sessions').select('id', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()).neq('status', 'DELETED'),
    ]);

    return {
        total: totalRes.count || 0,
        new: newRes.count || 0,
        submitted: submittedRes.count || 0,
        today: todayRes.count || 0,
    };
}

// ─── Main Handler ────────────────────────────────────────────────
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Verify admin auth
        const { userId, role } = await verifyAdmin(req);

        const body = await req.json();
        const { action, ...params } = body;

        // Log access (metadata only, no PII)
        console.log(`[fragebogen-admin] action=${action} userId=${userId} role=${role}`);

        switch (action) {
            case 'list':
                return json(await handleList(params, role));
            case 'detail':
                return json(await handleDetail(params, role));
            case 'versions':
                return json(await handleVersions(params));
            case 'audit':
                return json(await handleAudit(params));
            case 'update-status':
                return json(await handleUpdateStatus(params, userId));
            case 'add-note':
                return json(await handleAddNote(params, userId));
            case 'stats':
                return json(await handleStats());
            default:
                return jsonError(`Unbekannte Aktion: ${action}`);
        }
    } catch (error) {
        console.error('[fragebogen-admin] Error:', error.message);
        const status = error.message.includes('authentifiziert') || error.message.includes('Zugriff') ? 403 : 400;
        return jsonError(error.message, status);
    }
});
