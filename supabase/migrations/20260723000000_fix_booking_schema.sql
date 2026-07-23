-- Safety-net migration: ensure all booking columns and constraints are correct
-- This migration is idempotent and safe to run multiple times.

-- 1. Ensure service_id column exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id) ON DELETE SET NULL;

-- 2. Ensure payment_status column exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
UPDATE bookings SET payment_status = 'pending' WHERE payment_status IS NULL;
ALTER TABLE bookings ALTER COLUMN payment_status SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN payment_status SET DEFAULT 'pending';

-- Drop old check constraint if it exists without pending_payment
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed'));

-- 3. Ensure stripe_session_id column exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- 4. Fix the status check constraint to include pending_payment
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'pending_payment', 'confirmed', 'completed', 'cancelled', 'no-show'));

-- 5. Ensure consultation_type, discount, and health fields exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS consultation_type TEXT DEFAULT 'online';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS original_price INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_price INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS main_concern TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS symptoms TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS medications TEXT;

-- 6. Ensure correct RLS policy for public booking reads
DROP POLICY IF EXISTS "public_select_bookings" ON bookings;
CREATE POLICY "public_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (status IN ('confirmed', 'pending_payment', 'cancelled'));

-- 7. Ensure insert policy exists
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- 8. Create index for stripe session lookups (if not exists)
CREATE INDEX IF NOT EXISTS bookings_stripe_session_id_idx ON bookings(stripe_session_id);
