-- ================================================================
-- 011_admin_status.sql
-- Adds admin processing status + internal notes to intake_sessions
-- Run on Fragebogen Supabase project (doavcelrcghznzpanykm)
-- ================================================================

ALTER TABLE intake_sessions ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'neu'
  CHECK (admin_status IN ('neu', 'in_bearbeitung', 'erledigt'));

ALTER TABLE intake_sessions ADD COLUMN IF NOT EXISTS admin_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_sessions_admin_status ON intake_sessions(admin_status);

COMMENT ON COLUMN intake_sessions.admin_status IS 'Internal admin processing status: neu (new), in_bearbeitung (in progress), erledigt (done).';
COMMENT ON COLUMN intake_sessions.admin_notes IS 'Internal admin notes (not visible to clients). Timestamped entries separated by ---';
