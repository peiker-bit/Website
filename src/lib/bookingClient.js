import { createClient } from '@supabase/supabase-js';

// Configuration for the SECONDARY Supabase project (Booking Tool)
const bookingSupabaseUrl = import.meta.env.VITE_BOOKING_SUPABASE_URL;
const bookingSupabaseKey = import.meta.env.VITE_BOOKING_SUPABASE_ANON_KEY;
const COLLECTION_NAME = 'appointments'; // Change this if table name differs

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

    // Initial fetch
    const fetchBookings = async () => {
        const { data, error } = await bookingSupabase
            .from(COLLECTION_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching bookings:", error);
            return;
        }
        callback(data || []);
    };

    fetchBookings();

    // Realtime subscription
    const subscription = bookingSupabase
        .channel('booking-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: COLLECTION_NAME }, (payload) => {
            // On any change, just refetch for simplicity (or handle payload for granular updates)
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

export const updateBookingStatus = async (id, status) => {
    if (!bookingSupabase) return;
    const { error } = await bookingSupabase
        .from(COLLECTION_NAME)
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};
