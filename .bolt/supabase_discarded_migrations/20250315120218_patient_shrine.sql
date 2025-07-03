/*
  # Initial Schema Setup

  1. New Tables
    - users (with role management)
    - profiles (user profiles)
    - call_logs (call history)
    - voice_assistants (AI assistant configurations)
    - user_assistants (user-assistant relationships)
    - demo_call_submissions (demo requests)
    - blocked_contacts (blocked users)
  
  2. Security
    - Row Level Security enabled
    - Policies for data access
    - Secure functions and triggers
*/

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  role text DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_valid_role CHECK (role IN ('admin', 'customer'))
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  avatar_url text,
  phone text,
  company text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create call_logs table
CREATE TABLE IF NOT EXISTS public.call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  caller_number text,
  caller_name text,
  duration integer,
  status text,
  notes text,
  recording_url text,
  transcript text,
  created_at timestamptz DEFAULT now()
);

-- Create voice_assistants table
CREATE TABLE IF NOT EXISTS public.voice_assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text,
  accent text,
  image_url text,
  audio_sample_url text,
  description jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_assistants table
CREATE TABLE IF NOT EXISTS public.user_assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assistant_id uuid REFERENCES voice_assistants(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create demo_call_submissions table
CREATE TABLE IF NOT EXISTS public.demo_call_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  business_name text,
  voice_avatar text,
  referral_source text,
  whatsapp_number text,
  phone_number text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text
);

-- Create blocked_contacts table
CREATE TABLE IF NOT EXISTS public.blocked_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone_number text,
  reason text,
  blocked_at timestamptz DEFAULT now(),
  blocked_by uuid REFERENCES users(id),
  CONSTRAINT at_least_one_contact_method CHECK (
    (email IS NOT NULL) OR (phone_number IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_call_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Users can read own data" ON public.users;
  DROP POLICY IF EXISTS "Users can update own data" ON public.users;
  
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  
  -- Call logs policies
  DROP POLICY IF EXISTS "Users can read own call logs" ON public.call_logs;
  
  -- Voice assistants policies
  DROP POLICY IF EXISTS "Voice assistants are viewable by everyone" ON public.voice_assistants;
  
  -- User assistants policies
  DROP POLICY IF EXISTS "Users can read own assistants" ON public.user_assistants;
  DROP POLICY IF EXISTS "Users can update own assistants" ON public.user_assistants;
  
  -- Demo call submissions policies
  DROP POLICY IF EXISTS "Demo call submissions can be inserted by anyone" ON public.demo_call_submissions;
END $$;

-- Create RLS policies for users
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for call_logs
CREATE POLICY "Users can read own call logs"
  ON public.call_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for voice_assistants
CREATE POLICY "Voice assistants are viewable by everyone"
  ON public.voice_assistants
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create RLS policies for user_assistants
CREATE POLICY "Users can read own assistants"
  ON public.user_assistants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own assistants"
  ON public.user_assistants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for demo_call_submissions
CREATE POLICY "Demo call submissions can be inserted by anyone"
  ON public.demo_call_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
  user_role TEXT;
BEGIN
  -- Check if this is the admin email
  is_admin := (NEW.email = 'ceo@artvilsonmedia.com');
  
  -- Get role from user metadata or default to 'customer'
  user_role := CASE 
    WHEN is_admin THEN 'admin'
    ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  END;
  
  -- Insert into public.users with appropriate role
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    user_role,
    NOW(),
    NOW()
  );
  
  -- Create profile record
  INSERT INTO public.profiles (
    id,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET 
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
    role = CASE WHEN NEW.email = 'ceo@artvilsonmedia.com' THEN 'admin' ELSE users.role END,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Insert sample voice assistants
INSERT INTO voice_assistants (name, gender, accent, image_url, audio_sample_url, description, is_active)
VALUES
  (
    'AI Receptionist',
    'Female',
    'American',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://example.com/audio/receptionist.mp3',
    '{"title": "Your 24/7 Virtual Receptionist", "content": ["Imagine never missing a customer call, even at 2 AM. Our AI assistant takes care of everything from simple questions to complex bookings.", "It can transfer calls to staff when needed, answer questions about your services and pricing, update customer records, and schedule appointments in real time."]}',
    true
  ),
  (
    'AI Support Agent',
    'Male',
    'British',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    'https://example.com/audio/support.mp3',
    '{"title": "Instant Customer Support Anytime", "content": ["No more long wait times or unanswered calls. Our AI support agent helps customers right away, solving their issues in seconds.", "It handles FAQs, troubleshoots common problems, checks account details, and escalates calls when needed so your team can focus on bigger tasks."]}',
    true
  ),
  (
    'AI Booking Assistant',
    'Female',
    'Australian',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    'https://example.com/audio/booking.mp3',
    '{"title": "Effortless Scheduling Without the Wait", "content": ["Say goodbye to missed bookings and scheduling delays. Our AI assistant manages reservations, confirmations, and cancellations instantly.", "It checks availability, secures appointments, sends reminders, and updates your system so your customers get what they need without the hassle."]}',
    true
  )
ON CONFLICT DO NOTHING;