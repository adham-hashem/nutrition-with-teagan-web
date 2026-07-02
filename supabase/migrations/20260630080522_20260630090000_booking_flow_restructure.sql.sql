-- Ensure programme_id column exists in bookings (may already exist from earlier migration)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'programme_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN programme_id UUID REFERENCES programmes(id);
  END IF;
END $$;

-- Ensure service_id column exists in bookings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'service_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN service_id UUID REFERENCES services(id);
  END IF;
END $$;

-- Add programme selection availability column if needed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'programmes' AND column_name = 'is_bookable_standalone'
  ) THEN
    ALTER TABLE programmes ADD COLUMN is_bookable_standalone BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Update default programmes for the new flow
INSERT INTO programmes (title, subtitle, description, duration_weeks, price_pence, tag, tag_color, is_active, is_featured, display_order, is_bookable_standalone)
VALUES 
  ('Hormone Reset Programme', 'Balance your hormones naturally', 'A comprehensive programme designed to restore hormonal harmony through targeted nutrition and lifestyle interventions.', 12, 59700, 'Most Popular', '#D8C89B', true, true, 0, true),
  ('Gut Healing Programme', 'Heal your digestive system', 'Evidence-based nutrition protocols to repair gut integrity, reduce inflammation, and restore optimal digestive function.', 10, 49700, NULL, '#A999C2', true, false, 1, true),
  ('Skin Health Programme', 'Clear skin from within', 'Nutritional strategies for achieving radiant, clear skin by addressing underlying imbalances and inflammation.', 8, 44700, NULL, '#8A9C7A', true, false, 2, true),
  ('Metabolic Wellness Programme', 'Optimise your metabolism', 'Support your metabolic health through personalised nutrition, improving energy, weight management, and overall vitality.', 10, 49700, NULL, '#9C8AB8', true, false, 3, true)
ON CONFLICT DO NOTHING;

-- Update services to be clearly consultation types
UPDATE services SET 
  title = 'Initial Consultation',
  subtitle = 'Your first step to wellness',
  description = 'A comprehensive 75-minute assessment to understand your health history, current concerns, and goals. Includes a personalised nutrition plan.',
  duration_minutes = 75,
  price_pence = 18000,
  tag = 'Recommended',
  tag_color = '#8A9C7A',
  is_featured = true
WHERE title = 'Initial Consultation' OR title LIKE '%Initial%';

UPDATE services SET 
  title = 'Follow-Up Consultation',
  subtitle = 'Continue your journey',
  description = 'A 45-minute progress review to assess your results, refine your protocol, and provide ongoing support.',
  duration_minutes = 45,
  price_pence = 11000,
  is_featured = false
WHERE title = 'Follow-Up Consultation' OR title LIKE '%Follow%';

-- Add Intensive Package service
INSERT INTO services (title, subtitle, description, duration_minutes, price_pence, tag, tag_color, is_active, is_featured, display_order, consultation_type)
SELECT 'Intensive Package', '3-Month Transformation', 'A comprehensive 3-month package including initial consultation, 6 follow-ups, unlimited email support, and personalised protocols.', 90, 45000, 'Best Value', '#D6C27A', true, false, 2, 'hybrid'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE title = 'Intensive Package');
