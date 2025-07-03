-- Drop existing functions first
DROP FUNCTION IF EXISTS add_admin_user(text, text);
DROP FUNCTION IF EXISTS add_admin_user(text);

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all data" ON public.users;
DROP POLICY IF EXISTS "Admins can update all data" ON public.users;
DROP POLICY IF EXISTS "Users can update own non-admin data" ON public.users;
DROP POLICY IF EXISTS "Users can update own basic data" ON public.users;
DROP POLICY IF EXISTS "Admin full access" ON public.users;
DROP POLICY IF EXISTS "Only admins can read logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Admin access to logs" ON public.admin_logs;

-- Create single admin policy for full access
CREATE POLICY "Admin full access"
  ON public.users
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- Create single user policy for reading own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
  );

-- Create single user policy for updating own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid()
  )
  WITH CHECK (
    id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1)
  );

-- Create single admin policy for admin logs
DO $$ 
BEGIN
  -- Only create the policy if the admin_logs table exists
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_logs') THEN
    CREATE POLICY "Admin access to logs"
      ON public.admin_logs
      FOR ALL
      TO authenticated
      USING (
        (SELECT role FROM public.users WHERE id = auth.uid() LIMIT 1) = 'admin'
      );
  END IF;
END $$;

-- Create function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
PARALLEL SAFE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = user_id 
    AND role = 'admin'
    LIMIT 1
  );
$$;

-- Create function to remove users
CREATE OR REPLACE FUNCTION remove_user(target_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_id uuid;
  admin_count integer;
BEGIN
  -- Check if caller is admin
  IF NOT (SELECT is_admin(auth.uid())) THEN
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

  IF (SELECT role FROM public.users WHERE id = target_id) = 'admin' AND admin_count <= 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot remove the last administrator');
  END IF;

  -- Delete the user from auth.users (will cascade to public.users)
  DELETE FROM auth.users WHERE id = target_id;

  RETURN jsonb_build_object('success', true, 'message', 'User removed successfully');
END;
$$;

-- Create function to add admin users
CREATE OR REPLACE FUNCTION add_admin_user(admin_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if caller is admin
  IF NOT (SELECT is_admin(auth.uid())) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only administrators can add admin users');
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    RETURN jsonb_build_object('success', false, 'error', 'User already exists');
  END IF;

  -- Create user in auth.users with admin role
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmed_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt('temporary_password', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin"}',
    false,
    now()
  )
  RETURNING id INTO new_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin user created successfully',
    'user_id', new_user_id
  );
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