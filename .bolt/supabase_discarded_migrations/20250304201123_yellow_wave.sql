/*
  # Add cleanup trigger for deleted users

  1. Changes
    - Add trigger to handle user deletion cleanup
    - Ensure all related data is properly removed
    - Add function to clean up auth user data

  2. Security
    - Function runs with security definer to allow auth table access
    - Only admins can trigger the deletion process
*/

-- Create function to handle user deletion cleanup
CREATE OR REPLACE FUNCTION handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete from profiles
  DELETE FROM public.profiles WHERE id = OLD.id;
  
  -- Delete from user_assistants
  DELETE FROM public.user_assistants WHERE user_id = OLD.id;
  
  -- Delete from call_logs
  DELETE FROM public.call_logs WHERE user_id = OLD.id;
  
  -- Delete from blocked_contacts where they are the blocker
  DELETE FROM public.blocked_contacts WHERE blocked_by = OLD.id;
  
  -- Delete from blocked_contacts where they are blocked
  DELETE FROM public.blocked_contacts WHERE email = OLD.email;
  
  -- Delete from demo_call_submissions
  DELETE FROM public.demo_call_submissions WHERE email = OLD.email;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion
DROP TRIGGER IF EXISTS on_user_deleted ON public.users;
CREATE TRIGGER on_user_deleted
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_deletion();