import { createClient } from '@supabase/supabase-js';

// Configuration for the SECONDARY Supabase project (Booking Tool)
const bookingSupabaseUrl = import.meta.env.VITE_BOOKING_SUPABASE_URL;
const bookingSupabaseKey = import.meta.env.VITE_BOOKING_SUPABASE_ANON_KEY;
const COLLECTION_NAME = 'bookings'; // Change this if table name differs

// Create a separate client instance
export let bookingSupabase = null;

if (bookingSupabaseUrl && bookingSupabaseKey) {
    bookingSupabase = createClient(bookingSupabaseUrl, bookingSupabaseKey);
} else {
    console.warn("⚠️ Booking Supabase credentials missing. Please set VITE_BOOKING_SUPABASE_URL and VITE_BOOKING_SUPABASE_ANON_KEY.");
}

export const subscribeToBookings = (callback) => {
    if (!bookingSupabase) {
        callback([]); // Return empty if not configured
        return () => { };
    }

    // Map DB fields to UI fields
    const mapBooking = (b) => ({
        ...b,
        id: b.id,
        name: b.customer_name || 'Unbekannt',
        email: b.customer_email || '',
        phone: b.customer_phone || '',
        message: b.customer_message || '',
        service: b.type ? b.type.charAt(0).toUpperCase() + b.type.slice(1) : 'Termin',
        date: b.start_time,
        time: b.start_time ? new Date(b.start_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '',
        status: b.status || 'pending',
        createdAt: b.created_at
    });

    // Initial fetch
    const fetchBookings = async () => {
        const { data, error } = await bookingSupabase
            .from(COLLECTION_NAME)
            .select('*')
            .order('start_time', { ascending: false });

        if (error) {
            console.error("Error fetching bookings:", error);
            if (error.code === '42501' || error.message?.includes('policy')) {
                console.warn("⚠️ Permission denied: RLS policy might be missing on 'bookings' table for public/anon access.");
            }
            return;
        }
        callback((data || []).map(mapBooking));
    };

    fetchBookings();

    // Realtime subscription
    const subscription = bookingSupabase
        .channel('booking-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: COLLECTION_NAME }, () => {
            fetchBookings();
        })
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
};

export const deleteBooking = async (id) => {
    if (!bookingSupabase) {
        console.error('❌ Booking Supabase client not initialized');
        throw new Error('Booking database connection not configured');
    }

    console.log('🗑️ Deleting booking:', id);

    const { data, error } = await bookingSupabase
        .from(COLLECTION_NAME)
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        console.error('❌ Error deleting booking:', error);
        throw error;
    }

    console.log('✅ Booking deleted successfully:', data);
    return data;
};

export const updateBookingStatus = async (id, status, reason = null) => {
    if (!bookingSupabase) return;

    const updateData = { status };
    if (reason) {
        updateData.cancellation_reason = reason;
    }

    const { error } = await bookingSupabase
        .from(COLLECTION_NAME)
        .update(updateData)
        .eq('id', id);

    if (error) throw error;
};

// API Endpoint for Termintool (Booking Backend)
const TERMINTOOL_API_URL = import.meta.env.VITE_TERMINTOOL_API_URL || 'http://localhost:3000/api/admin/cancel-booking';

export const cancelBooking = async (id, reason, token) => {
    // If we have a local supabase client (for the main project), we can use it to invoke functions
    // But since this file is bookingClient (secondary), we might need the main supabase client import
    // or just use fetch directly to the function URL if we can construct it.

    // Better approach: Use the main supabase client imported from lib/supabaseClient
    // We need to import it at the top.

    // For now, let's use fetch with the project URL constructed from env vars
    // assuming format: https://<project_ref>.supabase.co/functions/v1/cancel-booking

    const MAIN_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const FUNCTION_URL = `${MAIN_SUPABASE_URL}/functions/v1/cancel-booking`;

    console.log("Calling cancel function:", FUNCTION_URL);

    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Use the auth token from the main app (admin)
        },
        body: JSON.stringify({
            bookingId: id,
            reason: reason
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return await response.json();
};

// --- Termintool Management Functions ---

// 1. Appointment Types (Leistungsarten)
export const getAppointmentTypes = async () => {
    if (!bookingSupabase) return [];

    const { data, error } = await bookingSupabase
        .from('availability_options')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching appointment types:", error);
        return [];
    }
    return data;
};

// Helper for API calls
const callAdminApi = async (action, payload, token) => {
    // Determine the API URL based on environment (local vs production)
    const TERMINTOOL_API_URL = import.meta.env.VITE_TERMINTOOL_API_URL || 'http://localhost:3000';
    const url = `${TERMINTOOL_API_URL}/api/admin/appointment-types`;

    if (!token) {
        throw new Error("Authentication token required for this action");
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, ...payload })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
        console.error("API Error Details:", result);
        throw new Error(result.error || `API Error: ${response.status} ${response.statusText}`);
    }
    return result.data;
};

export const createAppointmentType = async (typeData, token) => {
    return await callAdminApi('create', { data: typeData }, token);
};

export const updateAppointmentType = async (id, updates, token) => {
    return await callAdminApi('update', { id, data: updates }, token);
};

export const reorderAppointmentTypes = async (orderedIds, token) => {
    return await callAdminApi('reorder', { orderedIds }, token);
};

export const deleteAppointmentType = async (id, token) => {
    return await callAdminApi('delete', { id }, token);
};

// 2. Global Settings (Buffer, Days)
export const getBookingSettings = async () => {
    if (!bookingSupabase) return null;

    const { data, error } = await bookingSupabase
        .from('booking_settings')
        .select('*')
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returns
        console.error("Error fetching booking settings:", error);
    }
    return data;
};

export const updateBookingSettings = async (settings) => {
    if (!bookingSupabase) throw new Error("Booking connection not configured");

    // Check if exists first (or we can use upsert if ID is known, but usually we just row 1)
    const current = await getBookingSettings();

    let result;
    if (current) {
        result = await bookingSupabase
            .from('booking_settings')
            .update(settings)
            .eq('id', current.id)
            .select();
    } else {
        result = await bookingSupabase
            .from('booking_settings')
            .insert([settings])
            .select();
    }

    if (result.error) throw result.error;
    return result.data[0];
};

// 3. Blocked Periods (Urlaub)
export const getBlockedPeriods = async () => {
    if (!bookingSupabase) return [];

    const { data, error } = await bookingSupabase
        .from('blocked_periods')
        .select('*')
        .order('start_date', { ascending: true });

    if (error) {
        console.error("Error fetching blocked periods:", error);
        return [];
    }
    return data;
};

export const addBlockedPeriod = async (periodData) => {
    if (!bookingSupabase) throw new Error("Booking connection not configured");

    const { data, error } = await bookingSupabase
        .from('blocked_periods')
        .insert([periodData])
        .select();

    if (error) throw error;
    return data[0];
};

export const deleteBlockedPeriod = async (id) => {
    if (!bookingSupabase) throw new Error("Booking connection not configured");

    const { error } = await bookingSupabase
        .from('blocked_periods')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
