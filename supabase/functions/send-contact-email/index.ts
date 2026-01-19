import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MS_TENANT_ID = Deno.env.get("MS_TENANT_ID");
const MS_CLIENT_ID = Deno.env.get("MS_CLIENT_ID");
const MS_CLIENT_SECRET = Deno.env.get("MS_CLIENT_SECRET");

// Supabase credentials for fetching settings
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Fallback email if database lookup fails
const FALLBACK_EMAIL = "kontakt@peiker-Steuerberatung.de";

serve(async (req) => {
    try {
        // 1. Parse the request (assuming triggered by Database Webhook)
        const payload = await req.json();
        const { record } = payload; // Supabase webhook payload structure

        // If testing directly or different payload structure, handle gracefully
        const name = record?.name || "Unbekannt";
        const email = record?.email || "keine-email";
        const message = record?.message || "keine nachricht";

        console.log(`Sending email for message from: ${name}`);

        // 2. Get dynamic notification email from admin_settings
        let targetEmail = FALLBACK_EMAIL;

        try {
            // Initialize Supabase client with service role key
            const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

            // Fetch notification email from admin_settings
            const { data, error } = await supabase
                .from('admin_settings')
                .select('setting_value')
                .eq('setting_key', 'notification_email')
                .single();

            if (error) {
                console.warn('Could not fetch notification email from database, using fallback:', error);
            } else if (data?.setting_value) {
                targetEmail = data.setting_value;
                console.log(`Using notification email from database: ${targetEmail}`);
            }
        } catch (dbError) {
            console.error('Database connection error, using fallback email:', dbError);
        }

        // 3. Get Microsoft Graph Access Token (Client Credentials Flow)
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

        // 4. Send Email via MS Graph
        const emailResponse = await fetch(
            `https://graph.microsoft.com/v1.0/users/${targetEmail}/sendMail`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: {
                        subject: "Neue Nachricht über Kontaktformular",
                        body: {
                            contentType: "Text",
                            content: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
                        },
                        toRecipients: [
                            {
                                emailAddress: {
                                    address: targetEmail,
                                },
                            },
                        ],
                    },
                }),
            }
        );

        if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            throw new Error(`Failed to send email: ${errorText}`);
        }

        console.log(`Email successfully sent to: ${targetEmail}`);

        return new Response(JSON.stringify({ success: true, emailSentTo: targetEmail }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

