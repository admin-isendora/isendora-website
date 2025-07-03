/*
  # Clean Database Migration
  
  This migration will:
  1. Delete all users except ceo@artvilsonmedia.com
  2. Ensure the ceo@artvilsonmedia.com user has admin role
*/

-- First, create a function to clean the database
CREATE OR REPLACE FUNCTION clean_database()
RETURNS void AS $$
BEGIN
  -- Delete all users except ceo@artvilsonmedia.com
  DELETE FROM public.users 
  WHERE email != 'ceo@artvilsonmedia.com';
  
  -- Ensure ceo@artvilsonmedia.com has admin role
  UPDATE public.users 
  SET 
    role = 'admin',
    name = 'Admin User',
    updated_at = NOW()
  WHERE email = 'ceo@artvilsonmedia.com';
  
  -- Clean up any orphaned profiles
  DELETE FROM public.profiles 
  WHERE id NOT IN (SELECT id FROM public.users);
  
  -- Clean up any orphaned user_assistants
  DELETE FROM public.user_assistants 
  WHERE user_id NOT IN (SELECT id FROM public.users);
  
  -- Clean up any orphaned call_logs
  DELETE FROM public.call_logs 
  WHERE user_id NOT IN (SELECT id FROM public.users);
  
  RAISE NOTICE 'Database cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT clean_database();

-- Drop the function after use
DROP FUNCTION IF EXISTS clean_database();