-- First, create a function to clean up the specific user
CREATE OR REPLACE FUNCTION cleanup_specific_user()
RETURNS void AS $$
DECLARE
  target_email TEXT := 'denny.senkevich@gmail.com';
  target_user_id UUID;
BEGIN
  -- Get user ID if exists
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;

  -- Clean up all related data if user exists
  IF target_user_id IS NOT NULL THEN
    -- Delete from auth.users
    DELETE FROM auth.users 
    WHERE id = target_user_id;
    
    RAISE NOTICE 'Cleaned up auth user %', target_email;
  ELSE
    RAISE NOTICE 'User % not found in auth.users', target_email;
  END IF;
  
  RAISE NOTICE 'Cleanup completed successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the cleanup function
SELECT cleanup_specific_user();

-- Drop the function after use
DROP FUNCTION IF EXISTS cleanup_specific_user();