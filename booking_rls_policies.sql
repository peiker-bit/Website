-- RLS Policies for bookings table
-- This migration adds Row Level Security policies to the bookings table
-- to allow proper access from the admin dashboard

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public READ access (for booking form frontend)
-- This allows the booking form to check availability
CREATE POLICY "Public Read Bookings" ON bookings 
FOR SELECT 
USING (true);

-- Allow authenticated users (Admin) to manage all bookings
-- This allows the admin dashboard to view, edit, delete, and cancel bookings
CREATE POLICY "Admin All Bookings" ON bookings 
FOR ALL 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);
