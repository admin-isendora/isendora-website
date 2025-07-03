/*
  # Create call logs table

  1. New Tables
    - `call_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `caller_number` (text)
      - `caller_name` (text)
      - `duration` (integer, seconds)
      - `status` (text)
      - `notes` (text)
      - `recording_url` (text)
      - `transcript` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `call_logs` table
    - Add policy for authenticated users to read their own call logs
*/

CREATE TABLE IF NOT EXISTS call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  caller_number text,
  caller_name text,
  duration integer,
  status text,
  notes text,
  recording_url text,
  transcript text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Call logs can be read by the owner"
  ON call_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Call logs can be inserted by the owner"
  ON call_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);