-- Drop existing triggers and functions to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Create a more robust function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
  user_role TEXT;
BEGIN
  -- Check if this is the admin email
  is_admin := (NEW.email = 'ceo@artvilsonmedia.com');
  
  -- Get role from user metadata or default to 'customer'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  
  -- If admin email, override role
  IF is_admin THEN
    user_role := 'admin';
  END IF;
  
  -- Insert into public.users with appropriate role
  BEGIN
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
      user_role,
      NOW(),
      NOW()
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- If the user already exists, update their role if needed
      IF is_admin THEN
        UPDATE public.users
        SET role = 'admin',
            updated_at = NOW()
        WHERE id = NEW.id;
      END IF;
  END;
  
  -- Create profile record
  BEGIN
    INSERT INTO public.profiles (
      id,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NOW(),
      NOW()
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- Profile already exists, do nothing
      NULL;
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the transaction
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the transaction
    RAISE NOTICE 'Error in handle_user_update: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically update a user record when an auth user is updated
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Add a notice to confirm the migration ran successfully
DO $$
BEGIN
  RAISE NOTICE 'User creation and update fix migration completed successfully';
END $$;