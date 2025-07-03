/*
  # Fix Authentication System

  1. Changes
     - Improves user creation and authentication flow
     - Ensures proper role assignment
     - Fixes admin user creation and login
*/

-- Create a more robust function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if this is the admin email
  is_admin := (NEW.email = 'ceo@artvilsonmedia.com');
  
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
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    CASE WHEN is_admin THEN 'admin' ELSE 'customer' END,
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
EXCEPTION
  WHEN unique_violation THEN
    -- If the user already exists, update their role if needed
    IF is_admin THEN
      UPDATE public.users
      SET role = 'admin',
          updated_at = NOW()
      WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a trigger to automatically create a user record when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to handle user updates
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create a trigger to automatically update a user record when an auth user is updated
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create a function to ensure admin user exists
CREATE OR REPLACE FUNCTION ensure_admin_user()
RETURNS void AS $$
DECLARE
  admin_email TEXT := 'ceo@artvilsonmedia.com';
  admin_exists BOOLEAN;
BEGIN
  -- Check if admin user exists in public.users
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE email = admin_email AND role = 'admin'
  ) INTO admin_exists;
  
  -- If admin doesn't exist in public.users, update any user with that email to be admin
  IF NOT admin_exists THEN
    UPDATE public.users
    SET role = 'admin',
        updated_at = NOW()
    WHERE email = admin_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Run the function to ensure admin user exists
SELECT ensure_admin_user();

-- Drop the function as it's no longer needed
DROP FUNCTION ensure_admin_user();