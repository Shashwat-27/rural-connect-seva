-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('operator', 'doctor', 'admin');

-- Create enum for case status
CREATE TYPE public.case_status AS ENUM ('pending', 'simple', 'moderate', 'high', 'prescribed', 'completed');

-- Create operators table
CREATE TABLE public.operators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctors table  
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  specialization TEXT,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  operator_id UUID REFERENCES public.operators(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical cases table
CREATE TABLE public.medical_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  operator_id UUID REFERENCES public.operators(id) NOT NULL,
  
  -- Vitals data
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  blood_sugar INTEGER,
  temperature DECIMAL(4,2),
  oxygen_saturation INTEGER,
  
  -- Symptoms
  symptoms TEXT[],
  
  -- AI Assessment
  assessment_status public.case_status NOT NULL DEFAULT 'pending',
  ai_recommendation TEXT,
  severity_score INTEGER,
  
  -- Video recording (for moderate cases)
  video_url TEXT,
  video_transcript TEXT,
  
  -- Doctor prescription
  doctor_id UUID REFERENCES public.doctors(id),
  prescription TEXT,
  prescribed_medicines TEXT[],
  doctor_notes TEXT,
  
  -- Status tracking
  status public.case_status NOT NULL DEFAULT 'pending',
  sms_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create authentication table for operators and doctors
CREATE TABLE public.user_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE, -- operator_id or doctor_id
  password_hash TEXT NOT NULL,
  role public.user_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_auth ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for operators
CREATE POLICY "Operators can view their own data" 
ON public.operators FOR ALL 
USING (true); -- Public for now, will refine with auth

CREATE POLICY "Doctors can view their own data"
ON public.doctors FOR ALL
USING (true);

CREATE POLICY "Patients can be viewed by operators and doctors"
ON public.patients FOR ALL
USING (true);

CREATE POLICY "Medical cases can be viewed by operators and doctors"
ON public.medical_cases FOR ALL
USING (true);

CREATE POLICY "User auth is public for login"
ON public.user_auth FOR SELECT
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_cases_updated_at
  BEFORE UPDATE ON public.medical_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.operators (operator_id, name, phone, location) VALUES
('OP001', 'Raj Kumar', '+91-9876543210', 'Village Rampur'),
('OP002', 'Priya Sharma', '+91-9876543211', 'Village Krishnanagar');

INSERT INTO public.doctors (doctor_id, name, specialization, phone, email, license_number) VALUES
('DOC001', 'Dr. Anil Gupta', 'General Medicine', '+91-9876543220', 'anil@hospital.com', 'MED12345'),
('DOC002', 'Dr. Sunita Verma', 'Internal Medicine', '+91-9876543221', 'sunita@hospital.com', 'MED12346');

INSERT INTO public.user_auth (user_id, password_hash, role) VALUES
('OP001', '$2a$10$example_hash_for_op001', 'operator'),
('OP002', '$2a$10$example_hash_for_op002', 'operator'),
('DOC001', '$2a$10$example_hash_for_doc001', 'doctor'),
('DOC002', '$2a$10$example_hash_for_doc002', 'doctor');