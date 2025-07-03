/*
  # User Role Management

  1. Changes
     - Add check constraint to ensure role is either 'admin' or 'customer'
     - Set default role to 'customer' for new users
     - Update existing users with null role to 'customer'

  2. Security
     - Ensures consistent role values across the application
*/

-- Add check constraint to ensure role is either 'admin' or 'customer'
ALTER TABLE users
  DROP CONSTRAINT IF EXISTS check_valid_role;

ALTER TABLE users
  ADD CONSTRAINT check_valid_role
  CHECK (role IN ('admin', 'customer'));

-- Set default role to 'customer' for new users
ALTER TABLE users
  ALTER COLUMN role SET DEFAULT 'customer';

-- Update any existing users with null role to 'customer'
UPDATE users
SET role = 'customer'
WHERE role IS NULL;

-- Create a function to set admin role for specific email
CREATE OR REPLACE FUNCTION set_admin_for_email(admin_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET role = 'admin',
      updated_at = now()
  WHERE email = admin_email;
  
  -- If no rows were updated, the user doesn't exist yet
  -- We'll handle this in the application logic when they sign up
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found. They will be set as admin when they sign up.', admin_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Set the admin role for the specified email
SELECT set_admin_for_email('ceo@artvilsonmedia.com');

-- Drop the function as it's no longer needed
DROP FUNCTION set_admin_for_email(TEXT);