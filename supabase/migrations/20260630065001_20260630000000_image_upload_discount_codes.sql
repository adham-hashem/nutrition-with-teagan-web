-- Image Uploads Table (stores Cloudinary metadata)
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  secure_url TEXT NOT NULL,
  original_filename TEXT,
  resource_type TEXT DEFAULT 'image',
  bytes INTEGER,
  width INTEGER,
  height INTEGER,
  format TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Discount Codes Table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  applicable_programmes UUID[], -- Array of programme IDs (empty = all programmes)
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_percentage CHECK (
    discount_type != 'percentage' OR discount_value BETWEEN 0 AND 100
  )
);

-- Discount Usage Table (tracks each use)
CREATE TABLE IF NOT EXISTS discount_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id UUID NOT NULL REFERENCES discount_codes(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  programme_id UUID,
  amount_saved DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for image_uploads
CREATE POLICY "select_image_uploads_authenticated" ON image_uploads FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_image_uploads_authenticated" ON image_uploads FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "delete_image_uploads_authenticated" ON image_uploads FOR DELETE
  TO authenticated USING (true);

-- RLS Policies for discount_codes
CREATE POLICY "select_discount_codes_authenticated" ON discount_codes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_discount_codes_authenticated" ON discount_codes FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_discount_codes_authenticated" ON discount_codes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_discount_codes_authenticated" ON discount_codes FOR DELETE
  TO authenticated USING (true);

-- RLS Policies for discount_usage
CREATE POLICY "select_discount_usage_authenticated" ON discount_usage FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_discount_usage_authenticated" ON discount_usage FOR INSERT
  TO authenticated WITH CHECK (true);

-- Public policy for validating discount codes (read-only for anon)
CREATE POLICY "select_discount_codes_public" ON discount_codes FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires ON discount_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_image_uploads_public_id ON image_uploads(public_id);
CREATE INDEX IF NOT EXISTS idx_discount_usage_discount_id ON discount_usage(discount_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_image_uploads_updated_at
  BEFORE UPDATE ON image_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON discount_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_discount_usage(
  p_code TEXT,
  p_booking_id UUID,
  p_programme_id UUID,
  p_amount_saved DECIMAL(10,2)
) RETURNS BOOLEAN AS $$
DECLARE
  v_discount_id UUID;
  v_current_count INTEGER;
  v_limit INTEGER;
BEGIN
  -- Get discount details
  SELECT id, usage_count, usage_limit INTO v_discount_id, v_current_count, v_limit
  FROM discount_codes
  WHERE code = p_code AND is_active = true;
  
  IF v_discount_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if limit reached
  IF v_limit IS NOT NULL AND v_current_count >= v_limit THEN
    RETURN false;
  END IF;
  
  -- Increment usage count
  UPDATE discount_codes 
  SET usage_count = usage_count + 1 
  WHERE id = v_discount_id;
  
  -- Record usage
  INSERT INTO discount_usage (discount_id, booking_id, programme_id, amount_saved)
  VALUES (v_discount_id, p_booking_id, p_programme_id, p_amount_saved);
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;