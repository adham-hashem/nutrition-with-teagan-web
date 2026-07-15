-- Migration to allow anonymous users to view cancelled booking details
-- This is necessary to show the "Reservation Expired" message when a client opens their booking page after expiration.

DROP POLICY IF EXISTS "public_select_bookings" ON bookings;
CREATE POLICY "public_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (status IN ('confirmed', 'pending_payment', 'cancelled'));
