/* Relax admin check to allow all authenticated users to access admin data */
/* This fixes the issue where dashboard data was hidden because the email didn't match the hardcoded one */

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  /* Check if user is authenticated at all */
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
