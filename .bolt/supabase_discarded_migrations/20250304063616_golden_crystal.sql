/*
  # Create voice assistants table

  1. New Tables
    - `voice_assistants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `gender` (text)
      - `accent` (text)
      - `image_url` (text)
      - `audio_sample_url` (text)
      - `description` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `voice_assistants` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS voice_assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text,
  accent text,
  image_url text,
  audio_sample_url text,
  description jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Voice assistants are viewable by everyone"
  ON voice_assistants
  FOR SELECT
  TO anon, authenticated
  USING (true);