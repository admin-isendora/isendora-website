/*
  # Fix Admin User Migration
  
  1. Changes
    - Updates or creates admin user with specified email
    - Handles existing user case safely
    - Sets proper role and permissions
  
  2. Security
    - Uses proper error handling
    - Ensures data consistency
*/

DO $$
DECLARE
  user_exists BOOLEAN;
  user_id UUID;
BEGIN
  -- Check if user exists in auth.users
  SELECT id INTO user_id
  FROM auth.users 
  WHERE email = 'ceo@artvilsonmedia.com';

  -- Update or insert into public.users
  IF user_id IS NOT NULL THEN
    -- User exists in auth.users, update public.users
    INSERT INTO public.users (
      id,
      email,
      name,
      role,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      'ceo@artvilsonmedia.com',
      'Admin User',
      'admin',
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      role = 'admin',
      name = 'Admin User',
      updated_at = now();

    -- Ensure profile exists
    INSERT INTO public.profiles (
      id,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Admin user updated successfully';
  ELSE
    RAISE NOTICE 'Auth user not found - please create auth user first';
  END IF;
END $$;