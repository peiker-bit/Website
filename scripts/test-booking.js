import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Manual .env parser
const loadEnv = () => {
    try {
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        envFile.split(/\r?\n/).forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                envVars[key] = value;
            }
        });
        return envVars;
    } catch (e) {
        return {};
    }
};

const env = loadEnv();
const url = env.VITE_BOOKING_SUPABASE_URL;
const key = env.VITE_BOOKING_SUPABASE_ANON_KEY;

console.log('--- Supabase Schema Inspector ---');
if (!url || !key) {
    console.error('Missing credentials in .env');
    process.exit(1);
}

const supabase = createClient(url, key);

async function inspectSchema() {
    console.log(`Fetching from 'bookings'...`);

    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .limit(1);

        if (error) {
            console.error(`❌ Query Failed: ${error.message}`);
        } else {
            console.log(`✅ Query Successful! Found ${data.length} records.`);

            if (data.length > 0) {
                console.log('\n--- DATA STRUCTURE ---');
                console.log('Keys found:', Object.keys(data[0]));
                console.log('Sample Record:', JSON.stringify(data[0], null, 2));
                console.log('----------------------\n');
            } else {
                console.log('⚠️ The table exists but is empty. Cannot determine schema without data.');
            }
        }
    } catch (err) {
        console.error(`❌ Exception: ${err.message}`);
    }
}

inspectSchema();
