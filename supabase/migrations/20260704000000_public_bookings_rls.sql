-- RLS policies to allow public users to interact with the bookings table

-- Allow anonymous and authenticated users to insert booking requests
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Allow anonymous and authenticated users to read confirmed bookings to check for taken time slots
DROP POLICY IF EXISTS "public_select_bookings" ON bookings;
CREATE POLICY "public_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (status = 'confirmed');
