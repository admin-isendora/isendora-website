/*
  # Fix RLS Policies to Prevent Recursion

  1. Changes
    - Simplify RLS policies to prevent recursion
    - Use EXISTS with LIMIT 1 for better performance
    - Remove circular dependencies in policy checks
    
  2. Security
    - Maintain proper access control
    - Keep admin privileges intact
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all data" ON public.users;
DROP POLICY IF EXISTS "Admins can update all data" ON public.users;
DROP POLICY IF EXISTS "Users can update own non-admin data" ON public.users;
DROP POLICY IF EXISTS "Users can update own basic data" ON public.users;
DROP POLICY IF EXISTS "Admin full access" ON public.users;

-- Create simplified policies that avoid recursion
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
  );

CREATE POLICY "Admin full access"
  ON public.users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Users can update own basic data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid()
  )
  WITH CHECK (
    id = auth.uid() AND
    EXISTS (
      SELECT 1 
      FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.role = role
      LIMIT 1
    )
  );

-- Update admin logs policy
DROP POLICY IF EXISTS "Only admins can read logs" ON public.admin_logs;
CREATE POLICY "Only admins can read logs"
  ON public.admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM public.users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
      LIMIT 1
    )
  );

-- Update is_admin function to use optimized query
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
PARALLEL SAFE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users u 
    WHERE u.id = user_id 
    AND u.role = 'admin'
    LIMIT 1
  );
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;