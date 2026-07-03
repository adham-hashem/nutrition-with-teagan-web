/*
# Admin Dashboard Schema for Nutrition with Teagan

1. Purpose
This migration creates the complete database schema for the admin dashboard, supporting:
- Admin authentication via Supabase Auth
- Bookings management for consultations and programmes
- Programme management with images and pricing
- Blog CMS with categories and SEO metadata
- Availability management (working hours, holidays, blocked dates)
- Contact form message management
- Website content management (testimonials, FAQ, hero sections)

2. New Tables

a) `programmes` - Wellness programmes offered (created first as bookings references it)
   - id (uuid, primary key)
   - title, subtitle, description (text)
   - duration_weeks (integer)
   - price_pence (integer) - stored as pence for precision
   - tag, tag_color (text)
   - image_url (text)
   - suitable_for (text[]) - array of conditions
   - includes (text[]) - array of what's included
   - outcomes (text[]) - array of expected outcomes
   - is_active (boolean)
   - display_order (integer)
   - created_at, updated_at (timestamptz)

b) `bookings` - Client consultations and programme bookings
   - id (uuid, primary key)
   - client_name, client_email, client_phone (text)
   - booking_type (text) - 'initial', 'follow-up', 'programme'
   - programme_id (uuid, foreign key to programmes, nullable)
   - scheduled_at (timestamptz)
   - duration_minutes (integer)
   - status (text) - 'pending', 'confirmed', 'completed', 'cancelled'
   - notes (text)
   - created_at, updated_at (timestamptz)

c) `blog_categories` - Blog article categories
   - id (uuid, primary key)
   - name, slug (text)
   - description (text)
   - created_at (timestamptz)

d) `blog_posts` - Blog articles
   - id (uuid, primary key)
   - title, slug (text)
   - excerpt, content (text)
   - category_id (uuid, foreign key)
   - featured_image_url (text)
   - meta_title, meta_description (text)
   - published_at (timestamptz, nullable)
   - is_published (boolean)
   - author_name (text)
   - created_at, updated_at (timestamptz)

e) `availability_templates` - Default working hours
   - id (uuid, primary key)
   - day_of_week (integer, 0-6)
   - start_time, end_time (time)
   - is_working_day (boolean)

f) `availability_exceptions` - Holidays, blocked dates
   - id (uuid, primary key)
   - exception_date (date)
   - exception_type (text) - 'holiday', 'blocked', 'special'
   - reason (text, nullable)
   - alternative_hours (jsonb, nullable) - {start: "09:00", end: "12:00"}

g) `contact_messages` - Form submissions
   - id (uuid, primary key)
   - name, email, phone (text)
   - subject (text)
   - message (text)
   - status (text) - 'unread', 'read', 'replied', 'archived'
   - replied_at (timestamptz, nullable)
   - notes (text, nullable)
   - created_at (timestamptz)

h) `testimonials` - Client testimonials
   - id (uuid, primary key)
   - client_name (text)
   - client_location (text)
   - programme (text)
   - image_url (text, nullable)
   - rating (integer, 1-5)
   - quote (text)
   - is_approved (boolean)
   - display_order (integer)
   - created_at (timestamptz)

i) `faq_items` - FAQ entries
   - id (uuid, primary key)
   - question, answer (text)
   - category (text)
   - display_order (integer)
   - is_active (boolean)
   - created_at, updated_at (timestamptz)

j) `website_sections` - Dynamic content sections
   - id (uuid, primary key)
   - section_key (text, unique) - e.g. 'hero', 'about_intro'
   - title, subtitle, content (text)
   - image_url (text, nullable)
   - cta_text, cta_link (text, nullable)
   - metadata (jsonb) - flexible field for additional data
   - updated_at (timestamptz)

3. Security
- RLS enabled on all tables
- Admin-only policies (authenticated users can CRUD all data)
- Public read policies for website content (programmes, published blogs, testimonials, FAQ)
*/

-- Programmes table (created first as bookings references it)
CREATE TABLE IF NOT EXISTS programmes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  duration_weeks integer NOT NULL,
  price_pence integer NOT NULL,
  tag text,
  tag_color text DEFAULT '#9FAF93',
  image_url text,
  suitable_for text[] DEFAULT '{}',
  includes text[] DEFAULT '{}',
  outcomes text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  booking_type text NOT NULL CHECK (booking_type IN ('initial', 'follow-up', 'programme')),
  programme_id uuid REFERENCES programmes(id) ON DELETE SET NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  featured_image_url text,
  meta_title text,
  meta_description text,
  published_at timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  author_name text DEFAULT 'Teagan',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Availability template (recurring weekly hours)
CREATE TABLE IF NOT EXISTS availability_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_working_day boolean NOT NULL DEFAULT true,
  CONSTRAINT unique_day UNIQUE (day_of_week)
);

ALTER TABLE availability_templates ENABLE ROW LEVEL SECURITY;

-- Availability exceptions (holidays, blocked dates)
CREATE TABLE IF NOT EXISTS availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_date date NOT NULL,
  exception_type text NOT NULL CHECK (exception_type IN ('holiday', 'blocked', 'special')),
  reason text,
  alternative_hours jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_exception_date UNIQUE (exception_date)
);

ALTER TABLE availability_exceptions ENABLE ROW LEVEL SECURITY;

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  replied_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_location text,
  programme text,
  image_url text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  quote text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  display_order integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Website sections (hero, about sections, etc.)
CREATE TABLE IF NOT EXISTS website_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  subtitle text,
  content text,
  image_url text,
  cta_text text,
  cta_link text,
  metadata jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated admin access

-- Programmes policies
DROP POLICY IF EXISTS "admin_select_programmes" ON programmes;
CREATE POLICY "admin_select_programmes" ON programmes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_programmes" ON programmes;
CREATE POLICY "admin_insert_programmes" ON programmes FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_programmes" ON programmes;
CREATE POLICY "admin_update_programmes" ON programmes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_programmes" ON programmes;
CREATE POLICY "admin_delete_programmes" ON programmes FOR DELETE
  TO authenticated USING (true);

-- Bookings policies
DROP POLICY IF EXISTS "admin_select_bookings" ON bookings;
CREATE POLICY "admin_select_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_bookings" ON bookings;
CREATE POLICY "admin_insert_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_bookings" ON bookings;
CREATE POLICY "admin_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_bookings" ON bookings;
CREATE POLICY "admin_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- Blog categories policies
DROP POLICY IF EXISTS "admin_select_blog_categories" ON blog_categories;
CREATE POLICY "admin_select_blog_categories" ON blog_categories FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_blog_categories" ON blog_categories;
CREATE POLICY "admin_insert_blog_categories" ON blog_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blog_categories" ON blog_categories;
CREATE POLICY "admin_update_blog_categories" ON blog_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blog_categories" ON blog_categories;
CREATE POLICY "admin_delete_blog_categories" ON blog_categories FOR DELETE
  TO authenticated USING (true);

-- Blog posts policies
DROP POLICY IF EXISTS "admin_select_blog_posts" ON blog_posts;
CREATE POLICY "admin_select_blog_posts" ON blog_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_blog_posts" ON blog_posts;
CREATE POLICY "admin_insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blog_posts" ON blog_posts;
CREATE POLICY "admin_update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blog_posts" ON blog_posts;
CREATE POLICY "admin_delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- Availability templates policies
DROP POLICY IF EXISTS "admin_select_availability_templates" ON availability_templates;
CREATE POLICY "admin_select_availability_templates" ON availability_templates FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_availability_templates" ON availability_templates;
CREATE POLICY "admin_insert_availability_templates" ON availability_templates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_availability_templates" ON availability_templates;
CREATE POLICY "admin_update_availability_templates" ON availability_templates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_availability_templates" ON availability_templates;
CREATE POLICY "admin_delete_availability_templates" ON availability_templates FOR DELETE
  TO authenticated USING (true);

-- Availability exceptions policies
DROP POLICY IF EXISTS "admin_select_availability_exceptions" ON availability_exceptions;
CREATE POLICY "admin_select_availability_exceptions" ON availability_exceptions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_availability_exceptions" ON availability_exceptions;
CREATE POLICY "admin_insert_availability_exceptions" ON availability_exceptions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_availability_exceptions" ON availability_exceptions;
CREATE POLICY "admin_update_availability_exceptions" ON availability_exceptions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_availability_exceptions" ON availability_exceptions;
CREATE POLICY "admin_delete_availability_exceptions" ON availability_exceptions FOR DELETE
  TO authenticated USING (true);

-- Contact messages policies
DROP POLICY IF EXISTS "admin_select_contact_messages" ON contact_messages;
CREATE POLICY "admin_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_contact_messages" ON contact_messages;
CREATE POLICY "admin_insert_contact_messages" ON contact_messages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- Testimonials policies
DROP POLICY IF EXISTS "admin_select_testimonials" ON testimonials;
CREATE POLICY "admin_select_testimonials" ON testimonials FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_testimonials" ON testimonials;
CREATE POLICY "admin_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- FAQ items policies
DROP POLICY IF EXISTS "admin_select_faq_items" ON faq_items;
CREATE POLICY "admin_select_faq_items" ON faq_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_faq_items" ON faq_items;
CREATE POLICY "admin_insert_faq_items" ON faq_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_faq_items" ON faq_items;
CREATE POLICY "admin_update_faq_items" ON faq_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_faq_items" ON faq_items;
CREATE POLICY "admin_delete_faq_items" ON faq_items FOR DELETE
  TO authenticated USING (true);

-- Website sections policies
DROP POLICY IF EXISTS "admin_select_website_sections" ON website_sections;
CREATE POLICY "admin_select_website_sections" ON website_sections FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_website_sections" ON website_sections;
CREATE POLICY "admin_insert_website_sections" ON website_sections FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_website_sections" ON website_sections;
CREATE POLICY "admin_update_website_sections" ON website_sections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_website_sections" ON website_sections;
CREATE POLICY "admin_delete_website_sections" ON website_sections FOR DELETE
  TO authenticated USING (true);

-- Public read policies for website content (anon can read)

-- Programmes (public)
DROP POLICY IF EXISTS "public_select_programmes" ON programmes;
CREATE POLICY "public_select_programmes" ON programmes FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Published blog posts (public)
DROP POLICY IF EXISTS "public_select_blog_posts" ON blog_posts;
CREATE POLICY "public_select_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- Blog categories (public)
DROP POLICY IF EXISTS "public_select_blog_categories" ON blog_categories;
CREATE POLICY "public_select_blog_categories" ON blog_categories FOR SELECT
  TO anon, authenticated USING (true);

-- Approved testimonials (public)
DROP POLICY IF EXISTS "public_select_testimonials" ON testimonials;
CREATE POLICY "public_select_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (is_approved = true);

-- Active FAQ items (public)
DROP POLICY IF EXISTS "public_select_faq_items" ON faq_items;
CREATE POLICY "public_select_faq_items" ON faq_items FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Website sections (public)
DROP POLICY IF EXISTS "public_select_website_sections" ON website_sections;
CREATE POLICY "public_select_website_sections" ON website_sections FOR SELECT
  TO anon, authenticated USING (true);

-- Contact form submissions (public can insert)
DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Insert default availability template (Mon-Fri 9-5)
INSERT INTO availability_templates (day_of_week, start_time, end_time, is_working_day) VALUES
  (0, '09:00', '17:00', true),
  (1, '09:00', '17:00', true),
  (2, '09:00', '17:00', true),
  (3, '09:00', '17:00', true),
  (4, '09:00', '17:00', true),
  (5, '09:00', '13:00', false),
  (6, '09:00', '13:00', false)
ON CONFLICT (day_of_week) DO NOTHING;

-- Insert default programmes from the website
INSERT INTO programmes (title, subtitle, description, duration_weeks, price_pence, tag, tag_color, image_url, suitable_for, includes, outcomes, is_active, display_order) VALUES
  ('Hormone Reset Programme', 'Balance Your Hormones, Reclaim Your Life', 'A comprehensive 12-week hormonal healing programme designed for women experiencing PCOS, PMS, painful or heavy periods, cycle irregularities, or hormonal imbalances. Through targeted nutrition, lifestyle medicine, and evidence-based supplementation, you''ll restore natural hormonal harmony.', 12, 35000, 'Most Popular', '#A999C2', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['PCOS', 'PMS & PMDD', 'Irregular periods', 'Painful periods', 'Hormonal acne', 'Fertility support'], ARRAY['Initial 75-minute consultation', 'Monthly follow-up consultations (x2)', 'Personalised hormonal nutrition plan', 'Cycle-syncing meal guide', 'Supplement protocol', 'Lifestyle and stress support strategies', 'Between-session messaging support', 'Recipe library access'], ARRAY['Regulated, predictable menstrual cycle', 'Reduced PMS and period pain', 'Improved energy and mood stability', 'Clearer skin and reduced hormonal acne'], true, 1),
  
  ('Gut Healing Programme', 'Restore Digestive Balance & Microbiome Health', 'An 8-week intensive gut healing programme targeting the root causes of IBS, bloating, constipation, acid reflux, and food sensitivities. Using a systematic approach — including elimination phases, gut-healing protocols, and microbiome restoration — you''ll rebuild a thriving, resilient digestive system.', 8, 35000, 'Bestseller', '#9FAF93', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['IBS', 'Bloating & gas', 'Constipation', 'Acid reflux', 'Food sensitivities', 'Gut-skin issues'], ARRAY['Initial 75-minute consultation', 'Follow-up consultation at week 4', 'Personalised gut-healing nutrition plan', 'Elimination and reintroduction guide', 'Microbiome-restoring supplement protocol', 'Gut-healing recipe collection', 'Between-session messaging support'], ARRAY['Significant reduction in bloating and gas', 'Regular, comfortable bowel movements', 'Identified and managed food sensitivities', 'Improved gut microbiome diversity'], true, 2),
  
  ('Skin Health Programme', 'Heal Your Skin From the Inside Out', 'A 10-week inside-out skin health programme addressing acne, eczema, psoriasis, and other inflammatory skin conditions through targeted nutrition, gut healing, and hormonal balancing. Rather than topical treatments alone, this programme targets the internal drivers of skin inflammation and disruption.', 10, 32000, 'Transformative', '#D8C26D', 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Acne & breakouts', 'Eczema', 'Psoriasis', 'Rosacea', 'Skin inflammation', 'Dull or congested skin'], ARRAY['Initial 75-minute consultation', 'Follow-up consultations at weeks 4 and 8', 'Personalised skin-focused nutrition plan', 'Anti-inflammatory eating guide', 'Gut-skin axis healing protocol', 'Skin-supportive supplement plan', 'Lifestyle and stress support', 'Between-session support'], ARRAY['Clearer, calmer, more radiant skin', 'Reduced inflammatory flare-ups', 'Improved gut health supporting skin clarity', 'Balanced hormones reducing hormonal breakouts'], true, 3),
  
  ('Metabolic Wellness Programme', 'Restore Energy, Balance Blood Sugar & Thrive', 'A 10-week metabolic health programme designed for women experiencing insulin resistance, blood sugar dysregulation, thyroid concerns, or chronic fatigue. Through evidence-based nutritional strategies, you''ll optimise your metabolism, restore energy, and support thyroid and adrenal health.', 10, 38000, 'Revitalising', '#D8C89B', 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Insulin resistance', 'Blood sugar issues', 'Thyroid concerns', 'Chronic fatigue', 'Low energy', 'Unexplained weight changes'], ARRAY['Initial 75-minute consultation', 'Follow-up consultations at weeks 4 and 8', 'Personalised metabolic nutrition plan', 'Blood sugar stabilisation guide', 'Thyroid and adrenal support protocol', 'Energy-restoring supplement plan', 'Movement and lifestyle strategies', 'Between-session support'], ARRAY['Stable, sustained energy throughout the day', 'Improved blood sugar regulation', 'Supported thyroid and adrenal function', 'Reduced fatigue and brain fog'], true, 4)
ON CONFLICT DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Hormonal Health', 'hormonal-health', 'Articles about hormonal balance, PCOS, PMS, and women''s hormonal health'),
  ('Gut Health', 'gut-health', 'Digestive wellness, microbiome health, and gut-healing nutrition'),
  ('Skin Health', 'skin-health', 'Inside-out approaches to skin health and inflammatory skin conditions'),
  ('Nutrition Tips', 'nutrition-tips', 'Practical nutrition advice and healthy eating strategies'),
  ('Lifestyle', 'lifestyle', 'Wellness lifestyle, stress management, and holistic health practices')
ON CONFLICT (slug) DO NOTHING;

-- Insert default website sections
INSERT INTO website_sections (section_key, title, subtitle, content, cta_text, cta_link) VALUES
  ('hero', 'Personalised Naturopathic Nutrition', 'For Women''s Health', 'Evidence-based nutrition therapy to address the root causes of hormonal imbalances, gut issues, and skin concerns.', 'Book a Consultation', '/booking'),
  ('about_intro', 'Healing from Within', 'Why I Do What I Do', 'I believe every woman deserves to feel heard, understood, and empowered in her health journey.', 'Learn More', '/about'),
  ('services_intro', 'Specialised Care', 'Comprehensive Support', 'From one-off consultations to transformative programmes, find the right level of support for your needs.', 'View Services', '/services'),
  ('testimonials_intro', 'Success Stories', 'Real Results', 'Discover how women like you have transformed their health through personalised nutrition.', 'Read More', '/testimonials')
ON CONFLICT (section_key) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(client_email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_date ON availability_exceptions(exception_date);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved, display_order);
CREATE INDEX IF NOT EXISTS idx_faq_active ON faq_items(is_active, display_order);
