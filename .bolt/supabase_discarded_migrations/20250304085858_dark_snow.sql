/*
  # Create admin user

  1. New Features
     - Creates the admin user if it doesn't exist
     - Sets up proper role and permissions
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
    -- Insert into auth.users
    user_id := gen_random_uuid();
    
    -- This is a simplified version - in a real scenario, you would use proper auth functions
    -- This is just for demonstration purposes
    INSERT INTO auth.users (
      id, 
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role
    ) VALUES (
      user_id,
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      now(),
      now(),
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
    RAISE NOTICE 'Admin user already exists with email: %', admin_email;
    
    -- Ensure the user has admin role in public.users
    UPDATE public.users
    SET role = 'admin'
    WHERE email = admin_email;
  END IF;
END $$;