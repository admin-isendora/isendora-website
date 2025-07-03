/*
  # Delete specific admin user
  
  This migration deletes the admin user with email lala@gmail.com
  using the service role permissions we set up.
*/

DO $$ 
DECLARE
  target_email TEXT := 'lala@gmail.com';
  target_user_id UUID;
BEGIN
  -- Get user ID if exists
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;

  -- Delete user if found
  IF target_user_id IS NOT NULL THEN
    -- Delete from auth.users (this will trigger cascading deletes)
    DELETE FROM auth.users 
    WHERE id = target_user_id;
    
    RAISE NOTICE 'Successfully deleted user %', target_email;
  ELSE
    RAISE NOTICE 'User % not found', target_email;
  END IF;
END $$;