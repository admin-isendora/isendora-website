/*
  # Demo Call Submissions System

  1. New Tables
    - `demo_call_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `business_name` (text)
      - `voice_avatar` (text)
      - `referral_source` (text)
      - `whatsapp_number` (text)
      - `phone_number` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `processed_at` (timestamp)
      - `notes` (text)
    - `blocked_contacts`
      - `id` (uuid, primary key)
      - `email` (text)
      - `phone_number` (text)
      - `reason` (text)
      - `blocked_at` (timestamp)
      - `blocked_by` (uuid, references users)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users with admin role
*/

-- Create demo_call_submissions table
CREATE TABLE IF NOT EXISTS demo_call_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  business_name text,
  voice_avatar text,
  referral_source text,
  whatsapp_number text,
  phone_number text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text
);

-- Create blocked_contacts table
CREATE TABLE IF NOT EXISTS blocked_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone_number text,
  reason text,
  blocked_at timestamptz DEFAULT now(),
  blocked_by uuid REFERENCES users(id)
);

-- Add constraints to ensure at least one contact method is provided
ALTER TABLE blocked_contacts
  ADD CONSTRAINT at_least_one_contact_method
  CHECK (
    (email IS NOT NULL) OR
    (phone_number IS NOT NULL)
  );

-- Enable Row Level Security
ALTER TABLE demo_call_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for demo_call_submissions
CREATE POLICY "Demo call submissions are viewable by admins"
  ON demo_call_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Demo call submissions can be inserted by anyone"
  ON demo_call_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Demo call submissions can be updated by admins"
  ON demo_call_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create policies for blocked_contacts
CREATE POLICY "Blocked contacts are viewable by admins"
  ON blocked_contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Blocked contacts can be managed by admins"
  ON blocked_contacts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_call_submissions_email ON demo_call_submissions(email);
CREATE INDEX IF NOT EXISTS idx_demo_call_submissions_phone_number ON demo_call_submissions(phone_number);
CREATE INDEX IF NOT EXISTS idx_demo_call_submissions_status ON demo_call_submissions(status);
CREATE INDEX IF NOT EXISTS idx_blocked_contacts_email ON blocked_contacts(email);
CREATE INDEX IF NOT EXISTS idx_blocked_contacts_phone_number ON blocked_contacts(phone_number);