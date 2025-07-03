/*
  # Clean up specific user
  
  This migration will:
  1. Remove all traces of denny.senkevich@gmail.com from the database
  2. Clean up any related records
  3. Ensure no orphaned data remains
*/

-- First, create a function to clean up the specific user
CREATE OR REPLACE FUNCTION cleanup_specific_user()
RETURNS void AS $$
DECLARE
  target_email TEXT := 'denny.senkevich@gmail.com';
  target_user_id UUID;
BEGIN
  -- Get user ID if exists
  SELECT id INTO target_user_id 
  FROM public.users 
  WHERE email = target_email;

  -- Clean up all related data if user exists
  IF target_user_id IS NOT NULL THEN
    -- Delete from call_logs
    DELETE FROM public.call_logs 
    WHERE user_id = target_user_id;
    
    -- Delete from user_assistants
    DELETE FROM public.user_assistants 
    WHERE user_id = target_user_id;
    
    -- Delete from profiles
    DELETE FROM public.profiles 
    WHERE id = target_user_id;
    
    -- Delete from users
    DELETE FROM public.users 
    WHERE id = target_user_id;
    
    -- Delete from blocked_contacts
    DELETE FROM public.blocked_contacts 
    WHERE email = target_email 
       OR blocked_by = target_user_id;
    
    -- Delete from demo_call_submissions
    DELETE FROM public.demo_call_submissions 
    WHERE email = target_email;
    
    RAISE NOTICE 'Cleaned up all data for user %', target_email;
  ELSE
    RAISE NOTICE 'User % not found in public.users', target_email;
  END IF;
  
  -- Clean up any orphaned records using table aliases
  DELETE FROM public.profiles p
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = p.id
  );
  
  DELETE FROM public.user_assistants ua
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = ua.user_id
  );
  
  DELETE FROM public.call_logs cl
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = cl.user_id
  );
  
  RAISE NOTICE 'Cleanup completed successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the cleanup function
SELECT cleanup_specific_user();

-- Drop the function after use
DROP FUNCTION IF EXISTS cleanup_specific_user();