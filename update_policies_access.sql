-- Update RLS policies to allow editing without separate authentication
-- This is necessary because the Booking Database is accessed via a secondary client that doesn't share the main admin session.
-- WARNING: This allows anyone with your Anon Key (public) to edit these specific tables. 
-- For a production environment, you should implement a secure backend proxy or shared authentication.

-- Drop existing strict policies
DROP POLICY IF EXISTS "Admin All Availability" ON availability_options;
DROP POLICY IF EXISTS "Admin All Settings" ON booking_settings;
DROP POLICY IF EXISTS "Admin All Blocked" ON blocked_periods;

-- Create Open Policies (Allow Anon to Read/Write)
CREATE POLICY "Public Manage Availability" ON availability_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Manage Settings" ON booking_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Manage Blocked" ON blocked_periods FOR ALL USING (true) WITH CHECK (true);
