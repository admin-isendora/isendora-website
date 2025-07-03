/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references users.id)
      - `avatar_url` (text)
      - `phone` (text)
      - `company` (text)
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to read and update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  avatar_url text,
  phone text,
  company text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles can be read by the owner"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles can be updated by the owner"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);