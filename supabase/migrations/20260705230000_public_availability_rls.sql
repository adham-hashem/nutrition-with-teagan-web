-- Allow anonymous/authenticated users to view templates and exceptions to see availability
DROP POLICY IF EXISTS "public_select_availability_templates" ON availability_templates;
CREATE POLICY "public_select_availability_templates" ON availability_templates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_availability_exceptions" ON availability_exceptions;
CREATE POLICY "public_select_availability_exceptions" ON availability_exceptions FOR SELECT
  TO anon, authenticated USING (true);
