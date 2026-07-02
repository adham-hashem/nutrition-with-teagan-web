-- Create availability settings table
CREATE TABLE IF NOT EXISTS availability_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_hour INTEGER DEFAULT 9 CHECK (start_hour >= 0 AND start_hour <= 23),
  end_hour INTEGER DEFAULT 17 CHECK (end_hour >= 0 AND end_hour <= 23),
  slot_duration_minutes INTEGER DEFAULT 30 CHECK (slot_duration_minutes IN (15, 30, 60)),
  buffer_minutes INTEGER DEFAULT 15,
  working_days INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5], -- Monday to Friday (0=Sunday)
  blocked_dates TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_hours CHECK (start_hour < end_hour)
);

-- Enable RLS
ALTER TABLE availability_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "select_availability_public" ON availability_settings FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "all_availability_authenticated" ON availability_settings FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO availability_settings DEFAULT VALUES;

-- Trigger for updated_at
CREATE TRIGGER update_availability_settings_updated_at
  BEFORE UPDATE ON availability_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();