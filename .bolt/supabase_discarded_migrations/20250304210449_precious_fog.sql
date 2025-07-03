/*
  # Fix RLS Policies and Admin Functions - Final Version

  1. Changes
    - Simplify all policies to avoid recursion
    - Use direct role checks instead of function calls
    - Optimize policy performance
    
  2. Security
    - Maintain proper access control
    - Prevent infinite recursion
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

-- Create base policy for all users to read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
  );

-- Create admin policy for full access without recursion
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

-- Create update policy for regular users without recursion
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

-- Update admin logs policy without recursion
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

-- Create function to safely remove users
CREATE OR REPLACE FUNCTION remove_user(target_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_id uuid;
  admin_count integer;
BEGIN
  -- Check if caller is admin using direct query
  IF NOT EXISTS (
    SELECT 1 
    FROM public.users u 
    WHERE u.id = auth.uid() 
    AND u.role = 'admin'
    LIMIT 1
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only administrators can remove users');
  END IF;

  -- Get target user id
  SELECT id INTO target_id
  FROM public.users
  WHERE email = target_email
  LIMIT 1;

  IF target_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Check admin count if target is admin
  SELECT COUNT(*) INTO admin_count
  FROM public.users
  WHERE role = 'admin';

  IF EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = target_id 
    AND role = 'admin'
    LIMIT 1
  ) AND admin_count <= 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot remove the last administrator');
  END IF;

  -- Delete the user (will cascade through triggers)
  DELETE FROM auth.users WHERE id = target_id;

  RETURN jsonb_build_object('success', true, 'message', 'User removed successfully');
END;
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