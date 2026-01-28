-- Add slot_interval_minutes column to booking_settings table
-- This allows configuring the frequency of appointment slots (15, 30, or 60 minutes)

ALTER TABLE booking_settings 
ADD COLUMN IF NOT EXISTS slot_interval_minutes INTEGER DEFAULT 15;

-- Add constraint to ensure only valid intervals are used
ALTER TABLE booking_settings 
ADD CONSTRAINT slot_interval_check 
CHECK (slot_interval_minutes IN (15, 30, 60));

-- Update existing row with default if needed
UPDATE booking_settings
SET slot_interval_minutes = 15
WHERE slot_interval_minutes IS NULL;
