/*
  # Create admin user

  1. Changes
     - Creates a trigger function to set admin role for specific email
     - Adds a trigger to automatically set admin role when a user with the specified email signs up
*/

-- Create a function to set admin role for specific email on signup
CREATE OR REPLACE FUNCTION set_admin_role_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user has the admin email
  IF NEW.email = 'ceo@artvilsonmedia.com' THEN
    -- Set the role to admin
    NEW.role := 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set admin role on signup
DROP TRIGGER IF EXISTS set_admin_role_trigger ON users;
CREATE TRIGGER set_admin_role_trigger
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_admin_role_on_signup();

-- Update any existing user with this email to be an admin
UPDATE users
SET role = 'admin'
WHERE email = 'ceo@artvilsonmedia.com';