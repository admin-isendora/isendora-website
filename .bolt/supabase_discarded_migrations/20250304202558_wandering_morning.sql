/*
  # Fix permissions and cleanup triggers

  1. Changes
    - Grant necessary permissions to service_role
    - Allow service_role to manage public schema tables
    - Drop existing policy if exists before creating new one
    - Update trigger function for user deletion

  2. Security
    - Enable RLS on auth.users
    - Add policy for service_role to delete users
    - Grant appropriate permissions to service_role
*/

-- Grant necessary permissions to service role
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;

-- Allow service_role to manage public schema tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Allow service_role to delete users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "service_role can delete users" ON auth.users;

-- Create new policy
CREATE POLICY "service_role can delete users"
  ON auth.users
  FOR DELETE
  TO service_role
  USING (true);

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