/*
  # Add Admin User

  1. New Admin User
    - Creates an admin user with email 'ceo@artvilsonmedia.com'
    - Sets the role to 'admin'
    - Creates the corresponding profile record
  
  2. Changes
    - Uses a more direct approach to ensure the admin user exists
    - Handles the case where the auth user might not exist yet
*/

-- First, create a function to add the admin user
CREATE OR REPLACE FUNCTION add_admin_user()
RETURNS void AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Try to get the admin user ID from auth.users
  SELECT id INTO admin_id FROM auth.users WHERE email = 'ceo@artvilsonmedia.com' LIMIT 1;
  
  -- If admin user exists in auth.users
  IF admin_id IS NOT NULL THEN
    -- Insert or update the admin user in public.users
    INSERT INTO public.users (id, email, name, role, created_at, updated_at)
    VALUES (
      admin_id,
      'ceo@artvilsonmedia.com',
      'Admin User',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      email = 'ceo@artvilsonmedia.com',
      name = 'Admin User',
      role = 'admin',
      updated_at = NOW();
    
    -- Insert or update the admin profile
    INSERT INTO public.profiles (id, created_at, updated_at)
    VALUES (
      admin_id,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Admin user created or updated successfully';
  ELSE
    RAISE NOTICE 'Auth user not found - admin will be created when the auth user is created';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_admin_user();

-- Drop the function after use
DROP FUNCTION IF EXISTS add_admin_user();

-- Ensure the trigger for new users is properly set up
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

-- Recreate the trigger to ensure it's up to date
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();