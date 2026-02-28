import { createClient } from '@supabase/supabase-js';
const url = 'https://yaehcqggzpfvhoiuodnv.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZWhjcWdnenBmdmhvaXVvZG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg0Mzg5NiwiZXhwIjoyMDg0NDE5ODk2fQ._uBmtkw7Jc5g09zMJWA8mjga68GMs4RAVSq5UErqSd4';
const supabase = createClient(url, key);

async function check() {
    const { data, error } = await supabase.from('pg_policies').select('*').eq('tablename', 'client_person');
    console.log('Error:', error?.message);
    console.log('Policies client_person:', data);
}
check();
