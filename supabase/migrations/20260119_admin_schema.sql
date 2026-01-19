-- Admin Backend Database Schema Migration
-- This script creates the necessary tables and security policies for the admin backend

-- ============================================================================
-- 1. ADMIN SETTINGS TABLE
-- ============================================================================
-- Stores configurable settings like notification email address
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);

-- ============================================================================
-- 2. UPDATE CONTACT MESSAGES TABLE
-- ============================================================================
-- Add new columns to track message status
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for sorting by date
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ADMIN SETTINGS POLICIES
-- ============================================================================

-- Policy: Authenticated admin users can read all settings
CREATE POLICY "Admin users can read settings"
    ON admin_settings
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Authenticated admin users can update settings
CREATE POLICY "Admin users can update settings"
    ON admin_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Authenticated admin users can insert settings
CREATE POLICY "Admin users can insert settings"
    ON admin_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- CONTACT MESSAGES POLICIES
-- ============================================================================

-- Policy: Anonymous users can insert new messages (public contact form)
CREATE POLICY "Public can submit contact messages"
    ON contact_messages
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Authenticated users can also insert messages
CREATE POLICY "Authenticated can submit contact messages"
    ON contact_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Only authenticated admin users can read all messages
CREATE POLICY "Admin users can read all messages"
    ON contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only authenticated admin users can update messages
CREATE POLICY "Admin users can update messages"
    ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated admin users can delete messages
CREATE POLICY "Admin users can delete messages"
    ON contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- 4. INSERT DEFAULT SETTINGS
-- ============================================================================
-- Insert default notification email (if not exists)
INSERT INTO admin_settings (setting_key, setting_value)
VALUES ('notification_email', 'kontakt@peiker-Steuerberatung.de')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- 5. CREATE FUNCTION FOR AUTOMATIC TIMESTAMP UPDATE
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for admin_settings
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Create your first admin user in Supabase Dashboard > Authentication > Users
-- 2. Test the policies by trying to access data from the admin dashboard
-- 3. Verify that the default notification email was inserted
