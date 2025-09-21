-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-videos', 'medical-videos', false);

-- Create storage policies for medical videos
CREATE POLICY "Allow operators and doctors to upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow operators and doctors to view videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow operators and doctors to delete videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'medical-videos' AND auth.uid() IS NOT NULL);