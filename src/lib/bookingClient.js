import { createClient } from '@supabase/supabase-js';

// Configuration for the SECONDARY Supabase project (Booking Tool)
const bookingSupabaseUrl = import.meta.env.VITE_BOOKING_SUPABASE_URL;
const bookingSupabaseKey = import.meta.env.VITE_BOOKING_SUPABASE_ANON_KEY;
const COLLECTION_NAME = 'bookings'; // Change this if table name differs

// Create a separate client instance
let bookingSupabase = null;

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
    if (!bookingSupabase) return;
    const { error } = await bookingSupabase
        .from(COLLECTION_NAME)
        .delete()
        .eq('id', id);

    if (error) throw error;
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
    if (!token) throw new Error("No authentication token provided");

    const response = await fetch(TERMINTOOL_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
