-- Add business_hours column to booking_settings table
-- This allows storing daily time ranges when appointments can be booked

ALTER TABLE booking_settings 
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{
  "Monday": {"start": "09:00", "end": "17:00"},
  "Tuesday": {"start": "09:00", "end": "17:00"},
  "Wednesday": {"start": "09:00", "end": "17:00"},
  "Thursday": {"start": "09:00", "end": "17:00"},
  "Friday": {"start": "09:00", "end": "17:00"}
}'::jsonb;

-- Update existing row if it exists
UPDATE booking_settings
SET business_hours = '{
  "Monday": {"start": "09:00", "end": "17:00"},
  "Tuesday": {"start": "09:00", "end": "17:00"},
  "Wednesday": {"start": "09:00", "end": "17:00"},
  "Thursday": {"start": "09:00", "end": "17:00"},
  "Friday": {"start": "09:00", "end": "17:00"}
}'::jsonb
WHERE business_hours IS NULL;
