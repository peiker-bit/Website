import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MS_TENANT_ID = Deno.env.get("MS_TENANT_ID");
const MS_CLIENT_ID = Deno.env.get("MS_CLIENT_ID");
const MS_CLIENT_SECRET = Deno.env.get("MS_CLIENT_SECRET");

// Booking Database Credentials
const BOOKING_URL = Deno.env.get("VITE_BOOKING_SUPABASE_URL");
const BOOKING_ANON_KEY = Deno.env.get("VITE_BOOKING_SUPABASE_ANON_KEY");
// Ideally we would use a service role key for the booking DB if available,
// but based on env vars available we might only have these. 
// If VITE_BOOKING_SUPABASE_SERVICE_ROLE_KEY exists, use it.

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { bookingId, reason } = await req.json();

        if (!bookingId) {
            throw new Error("Missing bookingId");
        }

        // 1. Connect to Booking Database
        // Note: Using what's available in env. If explicit Service Key provided in secrets it would be better.
        const bookingSupabase = createClient(BOOKING_URL!, BOOKING_ANON_KEY!);

        // 2. Fetch Booking Details
        const { data: booking, error: fetchError } = await bookingSupabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking) {
            throw new Error(`Booking not found: ${fetchError?.message}`);
        }

        const customerEmail = booking.customer_email;
        const customerName = booking.customer_name;
        const bookingDate = new Date(booking.start_time).toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' });

        // 3. Update Booking Status -> 'cancelled'
        const { error: updateError } = await bookingSupabase
            .from('bookings')
            .update({
                status: 'cancelled',
                cancellation_reason: reason
            })
            .eq('id', bookingId);

        if (updateError) {
            throw new Error(`Failed to update booking status: ${updateError.message}`);
        }

        // 4. Send Email via Microsoft Graph

        // Get Access Token
        const tokenResponse = await fetch(
            `https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/token`,
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: MS_CLIENT_ID!,
                    scope: "https://graph.microsoft.com/.default",
                    client_secret: MS_CLIENT_SECRET!,
                    grant_type: "client_credentials",
                }),
            }
        );

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            throw new Error(`Failed to get MS Graph token: ${JSON.stringify(tokenData)}`);
        }

        // Fallback for sender if needed, but usually we send FROM the configured mailbox
        // We'll use the same logic as send-contact-email or a fixed sender
        // Assuming 'admin' sender. For now let's try the same dynamic lookup or fallback.
        const SENDER_EMAIL = "kontakt@peiker-Steuerberatung.de";

        // Construct Email Content
        const emailSubject = `Stornierung Ihres Termins am ${bookingDate}`;
        const emailBody = `
            Hallo ${customerName},

            Ihr Termin am ${bookingDate} wurde leider storniert.

            Grund: ${reason || 'Kein Grund angegeben.'}

            Bei Fragen antworten Sie bitte auf diese E-Mail.

            Mit freundlichen Grüßen
            Ihr Peiker Steuerberatung Team
        `;

        const emailResponse = await fetch(
            `https://graph.microsoft.com/v1.0/users/${SENDER_EMAIL}/sendMail`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: {
                        subject: emailSubject,
                        body: {
                            contentType: "Text",
                            content: emailBody,
                        },
                        toRecipients: [
                            {
                                emailAddress: {
                                    address: customerEmail,
                                },
                            },
                        ],
                    },
                }),
            }
        );

        if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error(`Email send failed: ${errorText}`);
            // We don't throw here to avoid rolling back the cancellation if email fails, 
            // but we should probably alert the caller.
            return new Response(JSON.stringify({
                success: true,
                message: "Booking cancelled but email failed",
                details: errorText
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true, message: "Booking cancelled and email sent" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
