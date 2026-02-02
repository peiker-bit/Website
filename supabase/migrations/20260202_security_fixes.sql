/* Security improvements based on linter warnings */

/* 1. Fix mutable search path for update_updated_at_column */
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = '';

/* 2. Define is_admin function for RLS policies */
/* Checks for 'admin' role in app_metadata OR specific email address as fallback */
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    LOWER(auth.jwt() ->> 'email') = 'kontakt@peiker-steuerberatung.de'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

/* 3. Update RLS policies for admin_settings */
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

/* Drop existing permissive policies */
DROP POLICY IF EXISTS "Admin users can read settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admin users can update settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admin users can insert settings" ON public.admin_settings;

/* Create stricter policies */
CREATE POLICY "Admin users can read settings"
    ON public.admin_settings
    FOR SELECT
    TO authenticated
    USING (is_admin());

CREATE POLICY "Admin users can update settings"
    ON public.admin_settings
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin users can insert settings"
    ON public.admin_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin());

/* 4. Update RLS policies for contact_messages */
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

/* Drop existing permissive policies for UPDATE and DELETE */
DROP POLICY IF EXISTS "Admin users can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin users can delete messages" ON public.contact_messages;
/* Readers also need to be restricted (previously "Admin users can read all messages") */
DROP POLICY IF EXISTS "Admin users can read all messages" ON public.contact_messages;

/* Recreate policies with is_admin check */
CREATE POLICY "Admin users can read all messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (is_admin());

CREATE POLICY "Admin users can update messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admin users can delete messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (is_admin());

/* Note: INSERT policies for contact_messages ("Public can submit..." and "Authenticated can submit...") */
/* are intentionally left open (or as is) because it's a contact form. */
