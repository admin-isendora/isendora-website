-- Grant full schema access
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA storage TO service_role;

-- Grant all privileges on auth schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA auth TO service_role;

-- Grant all privileges on public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO service_role;

-- Grant all privileges on storage schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA storage TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA storage TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA storage TO service_role;

-- Enable RLS bypass for service role
ALTER TABLE auth.users FORCE ROW LEVEL SECURITY;
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create new ones with full access
DO $$ 
DECLARE
  table_record RECORD;
BEGIN
  -- Loop through all tables in public schema
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    -- Drop existing policies
    EXECUTE format('DROP POLICY IF EXISTS "Service role has full access" ON public.%I', table_record.tablename);
    
    -- Create new policy with full access
    EXECUTE format('
      CREATE POLICY "Service role has full access" 
      ON public.%I 
      FOR ALL 
      TO service_role 
      USING (true) 
      WITH CHECK (true)
    ', table_record.tablename);
  END LOOP;
END $$;

-- Grant execute on all functions
DO $$ 
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT p.proname, pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public'
  LOOP
    EXECUTE format(
      'GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role',
      func_record.proname,
      func_record.args
    );
  END LOOP;
END $$;

-- Ensure service role can bypass RLS
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA storage GRANT ALL ON TABLES TO service_role;

-- Create policy for service role to delete users
CREATE POLICY "Service role can delete users"
  ON auth.users
  FOR DELETE
  TO service_role
  USING (true);