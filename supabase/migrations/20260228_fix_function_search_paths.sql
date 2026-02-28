-- Fix 'Function Search Path Mutable' warning for Supabase database linter
ALTER FUNCTION public.is_staff_or_admin() SET search_path = '';
ALTER FUNCTION public.cleanup_old_draft_sessions() SET search_path = '';
ALTER FUNCTION public.cleanup_session_storage_files(p_session_id UUID) SET search_path = '';
ALTER FUNCTION public.anonymize_old_submitted_sessions() SET search_path = '';
ALTER FUNCTION public.run_retention_cleanup() SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
