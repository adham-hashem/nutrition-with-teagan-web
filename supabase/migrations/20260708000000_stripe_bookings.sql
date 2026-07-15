-- Migration to support Stripe Checkout and Pending Payment flow

-- 1. Update the booking status check constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'pending_payment', 'confirmed', 'completed', 'cancelled', 'no-show'));

-- 2. Add payment columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- 3. Create index for fast stripe session lookups
CREATE INDEX IF NOT EXISTS bookings_stripe_session_id_idx ON bookings(stripe_session_id);

-- 4. Update the select RLS policy for public bookings
-- This allows anonymous users to see pending_payment slots as occupied in the calendar
DROP POLICY IF EXISTS "public_select_bookings" ON bookings;
CREATE POLICY "public_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (status IN ('confirmed', 'pending_payment'));
