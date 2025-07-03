/*
  # Create user assistants table

  1. New Tables
    - `user_assistants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `assistant_id` (uuid, references voice_assistants.id)
      - `is_active` (boolean)
      - `settings` (jsonb)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `user_assistants` table
    - Add policy for authenticated users to manage their own assistants
*/

CREATE TABLE IF NOT EXISTS user_assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assistant_id uuid REFERENCES voice_assistants(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User assistants can be read by the owner"
  ON user_assistants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User assistants can be inserted by the owner"
  ON user_assistants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User assistants can be updated by the owner"
  ON user_assistants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "User assistants can be deleted by the owner"
  ON user_assistants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);