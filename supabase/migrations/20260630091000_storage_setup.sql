-- Create images bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public access to storage
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'images');
