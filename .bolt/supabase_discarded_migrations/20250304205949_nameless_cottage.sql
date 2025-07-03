/*
  # Admin Functions and RLS Policies

  1. New Features
    - Admin logs table for tracking admin actions
    - Functions for admin operations and checks
    - Enhanced RLS policies for users table
    
  2. Security
    - Row Level Security enabled for all tables
    - Admin-specific policies
    - Security definer functions
*/

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  target_user text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_logs
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_logs
CREATE POLICY "Only admins can read logs"
  ON public.admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action text,
  target_user text,
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_logs (admin_id, action, target_user, details)
  VALUES (auth.uid(), action, target_user, details);
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Function to handle user updates
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the update is trying to change the role
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    -- Only allow role changes if the user performing the action is an admin
    IF NOT (SELECT is_admin(auth.uid())) THEN
      RAISE EXCEPTION 'Only administrators can change user roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS before_user_update ON public.users;
CREATE TRIGGER before_user_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_update();

-- Enhanced RLS policies for users table
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all data" ON public.users;
DROP POLICY IF EXISTS "Admins can update all data" ON public.users;

-- Create new policies
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can update all data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ));

-- Function to add admin user
CREATE OR REPLACE FUNCTION add_admin_user(
  admin_email text,
  admin_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  result jsonb;
BEGIN
  -- Check if caller is admin
  IF NOT (SELECT is_admin(auth.uid())) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Only administrators can add admin users'
    );
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User already exists'
    );
  END IF;

  -- Log the action
  PERFORM log_admin_action(
    'add_admin',
    admin_email,
    jsonb_build_object('name', admin_name)
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin user will be created when they sign up'
  );
END;
$$;

-- Function to remove user
CREATE OR REPLACE FUNCTION remove_user(
  target_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
  target_user_role text;
BEGIN
  -- Check if caller is admin
  IF NOT (SELECT is_admin(auth.uid())) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Only administrators can remove users'
    );
  END IF;

  -- Get user details
  SELECT id, role INTO target_user_id, target_user_role
  FROM public.users
  WHERE email = target_email;

  -- Check if user exists
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;

  -- Prevent removing the last admin
  IF target_user_role = 'admin' AND (
    SELECT COUNT(*) FROM public.users WHERE role = 'admin'
  ) <= 1 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot remove the last administrator'
    );
  END IF;

  -- Log the action
  PERFORM log_admin_action(
    'remove_user',
    target_email,
    jsonb_build_object('user_id', target_user_id)
  );

  -- Delete from auth.users (this will cascade to public.users)
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User removed successfully'
  );
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;