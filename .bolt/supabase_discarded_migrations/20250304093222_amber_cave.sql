/*
  # Fix admin login issues

  1. Changes
     - Creates the admin user with proper authentication
     - Ensures the admin role is correctly assigned
     - Sets up proper password hashing
*/

-- Create the admin user if it doesn't exist
DO $$
DECLARE
  admin_email TEXT := 'ceo@artvilsonmedia.com';
  admin_password TEXT := 'Admin123!@#';
  user_exists BOOLEAN;
  user_id UUID;
BEGIN
  -- Check if the user already exists in auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = admin_email
  ) INTO user_exists;
  
  -- If user doesn't exist, create it
  IF NOT user_exists THEN
    -- Generate a new UUID for the user
    user_id := gen_random_uuid();
    
    -- Insert directly into auth.users with proper password hashing
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      aud
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      now(),
      now(),
      '',
      '',
      '',
      '',
      'authenticated'
    );
    
    -- Insert into public.users
    INSERT INTO public.users (
      id,
      email,
      name,
      role,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      admin_email,
      'Admin User',
      'admin',
      now(),
      now()
    );
    
    -- Insert into public.profiles
    INSERT INTO public.profiles (
      id,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      now(),
      now()
    );
    
    RAISE NOTICE 'Admin user created with email: %', admin_email;
  ELSE
    -- Get the user ID
    SELECT id INTO user_id FROM auth.users WHERE email = admin_email;
    
    -- Update the password for existing user
    UPDATE auth.users
    SET 
      encrypted_password = crypt(admin_password, gen_salt('bf')),
      updated_at = now(),
      last_sign_in_at = now(),
      raw_user_meta_data = '{"name":"Admin User"}',
      email_confirmed_at = now()
    WHERE email = admin_email;
    
    -- Ensure the user has admin role in public.users
    UPDATE public.users
    SET 
      role = 'admin',
      name = 'Admin User',
      updated_at = now()
    WHERE email = admin_email;
    
    -- Ensure profile exists
    INSERT INTO public.profiles (id, created_at, updated_at)
    VALUES (user_id, now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Admin user updated with email: %', admin_email;
  END IF;
END $$;

-- Add a notice to confirm the migration ran successfully
DO $$
BEGIN
  RAISE NOTICE 'Admin login fix migration completed successfully';
END $$;