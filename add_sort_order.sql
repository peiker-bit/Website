-- Add sort_order column to availability_options
ALTER TABLE availability_options 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Initialize sort_order for existing records (alphabetical initial sort)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM availability_options
)
UPDATE availability_options
SET sort_order = ranked.rn
FROM ranked
WHERE availability_options.id = ranked.id;

-- Ensure RLS allows updating this new column (covered by previous broad policy "Public Manage Availability", but good to know)
