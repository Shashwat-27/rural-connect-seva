-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Allow operators and doctors to delete videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow operators to upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow doctors and operators to view videos" ON storage.objects;

-- Create proper storage policies for medical-videos bucket
CREATE POLICY "Operators can upload medical videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'medical-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can view medical videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'medical-videos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete medical videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'medical-videos' 
  AND auth.role() = 'authenticated'
);

-- Add prescription download tracking table (check if exists)
CREATE TABLE IF NOT EXISTS public.prescription_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  operator_id UUID NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prescription downloads
ALTER TABLE public.prescription_downloads ENABLE ROW LEVEL SECURITY;

-- Allow operators and doctors to view download history
DROP POLICY IF EXISTS "Allow operators and doctors to view download history" ON public.prescription_downloads;
CREATE POLICY "Allow operators and doctors to view download history" 
ON public.prescription_downloads 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow operators to record downloads
DROP POLICY IF EXISTS "Allow operators to record downloads" ON public.prescription_downloads;
CREATE POLICY "Allow operators to record downloads" 
ON public.prescription_downloads 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Update medical_cases to track SMS status better
ALTER TABLE public.medical_cases 
ADD COLUMN IF NOT EXISTS sms_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS sms_sent_at TIMESTAMP WITH TIME ZONE;

-- Create SMS logs table for tracking
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  error_message TEXT
);

-- Enable RLS on SMS logs
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Allow operators and doctors to view SMS logs
DROP POLICY IF EXISTS "Allow operators and doctors to view SMS logs" ON public.sms_logs;
CREATE POLICY "Allow operators and doctors to view SMS logs" 
ON public.sms_logs 
FOR ALL 
USING (auth.role() = 'authenticated');