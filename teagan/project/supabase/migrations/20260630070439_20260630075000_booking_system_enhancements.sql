-- Add consultation type and location support to programmes
ALTER TABLE programmes ADD COLUMN IF NOT EXISTS consultation_type TEXT DEFAULT 'online' CHECK (consultation_type IN ('online', 'in_person', 'hybrid'));
ALTER TABLE programmes ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE programmes ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;

-- Add discount and consultation details to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS consultation_type TEXT DEFAULT 'online';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS original_price INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_price INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS main_concern TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS symptoms TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS medications TEXT;

-- Create services table for one-off consultations (distinct from programmes)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_pence INTEGER NOT NULL,
  tag TEXT,
  tag_color TEXT DEFAULT '#7F9473',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  consultation_type TEXT DEFAULT 'online' CHECK (consultation_type IN ('online', 'in_person', 'hybrid')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_services_public" ON services FOR SELECT
  TO anon, authenticated USING (is_active = true);

CREATE POLICY "select_services_authenticated" ON services FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_services_authenticated" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_services_authenticated" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_services_authenticated" ON services FOR DELETE
  TO authenticated USING (true);

-- Trigger for services updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create blocked_times table for admin to block specific time slots
CREATE TABLE IF NOT EXISTS blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_blocked_times_public" ON blocked_times FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_blocked_times_authenticated" ON blocked_times FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "delete_blocked_times_authenticated" ON blocked_times FOR DELETE
  TO authenticated USING (true);

-- Insert default services if none exist
INSERT INTO services (title, subtitle, description, duration_minutes, price_pence, tag, is_featured, display_order)
SELECT 'Initial Consultation', 'Your first step to wellness', 'Comprehensive health assessment and personalised nutrition plan.', 75, 18000, 'Recommended', true, 0
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

INSERT INTO services (title, subtitle, description, duration_minutes, price_pence, display_order)
SELECT 'Follow-Up Consultation', 'Continue your journey', 'Progress review and protocol refinement.', 45, 11000, 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Follow-Up Consultation');