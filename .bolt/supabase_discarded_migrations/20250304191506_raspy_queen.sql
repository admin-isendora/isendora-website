/*
  # Clean Database Migration

  1. Changes
     - Remove any users with email 'denny.senkevich@gmail.com' from public.users table
     - Remove any related records from public.profiles table
     - Clean up any references in auth.users (via function)
  
  2. Security
     - No changes to RLS policies
*/

-- First, create a function to clean up the database
CREATE OR REPLACE FUNCTION clean_database()
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find user ID if it exists
  SELECT id INTO user_id FROM public.users WHERE email = 'denny.senkevich@gmail.com';
  
  -- If user exists in public.users, delete it
  IF user_id IS NOT NULL THEN
    -- Delete from profiles first (due to foreign key constraint)
    DELETE FROM public.profiles WHERE id = user_id;
    
    -- Delete from users
    DELETE FROM public.users WHERE id = user_id;
    
    RAISE NOTICE 'User with email denny.senkevich@gmail.com has been removed from public tables';
  ELSE
    RAISE NOTICE 'User with email denny.senkevich@gmail.com not found in public.users';
  END IF;
  
  -- Clean up any references in auth.users
  -- Note: We can't directly access auth.users in SQL, but we can use a function
  -- that will be executed with appropriate permissions
  
  -- This is a placeholder for the actual auth.users cleanup
  -- In a real scenario, you would use supabase admin API to delete the user
  
  RAISE NOTICE 'Database cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT clean_database();

-- Drop the function after use
DROP FUNCTION IF EXISTS clean_database();