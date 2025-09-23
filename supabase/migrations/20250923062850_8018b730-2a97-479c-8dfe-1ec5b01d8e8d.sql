-- Fix storage policies for medical-videos bucket - need to check user authentication properly
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

-- Create proper storage policies for medical-videos bucket
CREATE POLICY "Users can upload videos to medical-videos bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view videos in medical-videos bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update videos in medical-videos bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete videos in medical-videos bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);