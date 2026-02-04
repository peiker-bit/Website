/* Fix RLS Policy Warnings for menu_items */
/* Addresses: auth_rls_initplan (performance) and multiple_permissive_policies (redundancy) */

-- Enable RLS just in case
ALTER TABLE IF EXISTS public.menu_items ENABLE ROW LEVEL SECURITY;

-- 1. Drop existing disparate policies
DROP POLICY IF EXISTS "Admin full access" ON public.menu_items;
DROP POLICY IF EXISTS "Public read access" ON public.menu_items;
-- Also drop any other potential policies mentioned in warnings just to be safe
DROP POLICY IF EXISTS "Admin users can manage menu items" ON public.menu_items;

-- 2. Create Consolidated Public Read Policy
-- This resolves "multiple_permissive_policies" for SELECT
CREATE POLICY "Public Read Menu"
    ON public.menu_items
    FOR SELECT
    TO public
    USING (true);

-- 3. Create Specific Admin Write Policies
-- Using (select is_admin()) resolves "auth_rls_initplan" by ensuring stable execution plan
-- We split these to avoid "multiple_permissive_policies" warnings if we had a single "ALL" policy that overlapped with SELECT

CREATE POLICY "Admin Insert Menu"
    ON public.menu_items
    FOR INSERT
    TO authenticated
    WITH CHECK ( (SELECT public.is_admin()) );

CREATE POLICY "Admin Update Menu"
    ON public.menu_items
    FOR UPDATE
    TO authenticated
    USING ( (SELECT public.is_admin()) )
    WITH CHECK ( (SELECT public.is_admin()) );

CREATE POLICY "Admin Delete Menu"
    ON public.menu_items
    FOR DELETE
    TO authenticated
    USING ( (SELECT public.is_admin()) );
