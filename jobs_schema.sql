-- ==============================================================================
-- 1. Tabelle für Stellenangebote (Jobs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    tasks TEXT,
    requirements TEXT,
    benefits TEXT,
    location TEXT,
    employment_type TEXT,
    start_date TEXT,
    salary TEXT,
    contact_person TEXT,
    contact_email TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'inactive')),
    sort_order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS für Jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Vorhandene Policies sicherheitshalber löschen 
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.jobs;
DROP POLICY IF EXISTS "Public jobs are viewable by everyone." ON public.jobs;
DROP POLICY IF EXISTS "Admins can manage all jobs." ON public.jobs;

-- Jeder darf durchsuchbare/veröffentlichte Jobs sehen
CREATE POLICY "Public jobs are viewable by everyone." 
  ON public.jobs 
  FOR SELECT 
  USING ( status = 'published' );

-- Admins (authentifizierte User) dürfen alles
CREATE POLICY "Admins can manage all jobs." 
  ON public.jobs 
  FOR ALL 
  TO authenticated 
  USING ( true ) 
  WITH CHECK ( true );

-- Trigger für updated_at (falls Funktion nicht existiert, vorher anlegen)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS jobs_updated_at ON public.jobs;
CREATE TRIGGER jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 2. Tabelle für Bewerbungen (Job Applications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    resume_url TEXT NOT NULL, -- Pfad zur PDF in Supabase Storage
    other_file_url TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'rejected', 'hired'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS für Bewerbungen
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view and manage job applications" ON public.job_applications;

-- Anonyme User dürfen Bewerbungen absenden (Insert)
CREATE POLICY "Anyone can submit job applications" 
  ON public.job_applications 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK ( true );

-- Nur Admins dürfen eingehende Bewerbungen lesen/bearbeiten
CREATE POLICY "Admins can view and manage job applications" 
  ON public.job_applications 
  FOR ALL 
  TO authenticated 
  USING ( true ) 
  WITH CHECK ( true );


-- ==============================================================================
-- 3. Supabase Storage Bucket für Lebensläufe konfigurieren
-- HINWEIS: Storage Buckets können per SQL nur bedingt direkt vollständig konfiguriert werden. 
-- Falls dieser Teil fehlschlägt, den Bucket "job_applications" bitte manuell im UI anlegen!
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('job_applications', 'job_applications', false) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view uploaded files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;

-- Policies für Storage: Jeder darf Uploaden (Insert)
CREATE POLICY "Anyone can upload files" 
  ON storage.objects 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (bucket_id = 'job_applications');

-- Policies für Storage: Nur Admins dürfen Lesen/Löschen
CREATE POLICY "Admins can view uploaded files" 
  ON storage.objects 
  FOR SELECT 
  TO authenticated 
  USING (bucket_id = 'job_applications');

CREATE POLICY "Admins can delete files" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'job_applications');
