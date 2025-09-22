-- Fix storage policies for medical-videos bucket to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'medical-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'medical-videos' AND auth.role() = 'authenticated');