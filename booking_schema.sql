-- Create a table for Appointment Types (Leistungsarten)
CREATE TABLE IF NOT EXISTS availability_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  price DECIMAL(10, 2), -- Optional if you want to show prices
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for Global Booking Settings
-- We will likely only have one row here, but table structure is standard
CREATE TABLE IF NOT EXISTS booking_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buffer_minutes INTEGER DEFAULT 15, -- Buffer time between appointments
  available_days TEXT[] DEFAULT '{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}', -- Array of active days
  min_booking_notice_hours INTEGER DEFAULT 24, -- How much in advance must one book
  max_booking_future_days INTEGER DEFAULT 60, -- How far in future one can book
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for Blocked Periods (Vacations/Holidays)
CREATE TABLE IF NOT EXISTS blocked_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
-- ENABLE RLS on all tables
ALTER TABLE availability_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_periods ENABLE ROW LEVEL SECURITY;

-- Allow READ access to everyone (so the booking tool can see slots)
CREATE POLICY "Public Read Availability" ON availability_options FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON booking_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Blocked" ON blocked_periods FOR SELECT USING (true);

-- Allow WRITE access only to authenticated users (Admin)
-- Assuming admin has a Supabase Auth user and is signed in
CREATE POLICY "Admin All Availability" ON availability_options FOR ALL 
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin All Settings" ON booking_settings FOR ALL 
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin All Blocked" ON blocked_periods FOR ALL 
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Seed defaults if empty
INSERT INTO booking_settings (buffer_minutes, available_days)
SELECT 15, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
WHERE NOT EXISTS (SELECT 1 FROM booking_settings);

INSERT INTO availability_options (name, duration_minutes, description)
SELECT 'Erstgespräch', 30, 'Kostenloses Erstgespräch via Telefon oder Video.'
WHERE NOT EXISTS (SELECT 1 FROM availability_options);
