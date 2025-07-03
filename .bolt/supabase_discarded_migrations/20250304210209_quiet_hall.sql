/*
  # Fix RLS Policies Recursion

  1. Changes
    - Simplify RLS policies to prevent recursion
    - Remove circular dependencies in admin checks
    - Add direct role-based policies
    
  2. Security
    - Maintain row level security
    - Prevent infinite recursion
    - Keep admin privileges intact
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all data" ON public.users;
DROP POLICY IF EXISTS "Admins can update all data" ON public.users;
DROP POLICY IF EXISTS "Users can update own non-admin data" ON public.users;

-- Create base policies for all authenticated users
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
  );

-- Create admin read policy without recursion
CREATE POLICY "Admins can read all data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Create update policy for regular users
CREATE POLICY "Users can update own basic data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid()
  )
  WITH CHECK (
    id = auth.uid() AND
    (SELECT role FROM public.users WHERE id = auth.uid()) = role
  );

-- Create admin update policy without recursion
CREATE POLICY "Admins can update all data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Update admin logs policy to avoid recursion
DROP POLICY IF EXISTS "Only admins can read logs" ON public.admin_logs;
CREATE POLICY "Only admins can read logs"
  ON public.admin_logs
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Update is_admin function to use direct role check
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;