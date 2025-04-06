/*
  # Add Mentors Table

  1. New Tables
    - `mentors`
      - Stores mentor registration information
      - Links to profiles table
      - Includes expertise, languages, availability, etc.

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create mentors table if it doesn't exist
CREATE TABLE IF NOT EXISTS mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  expertise text[] NOT NULL,
  languages text[] NOT NULL,
  availability text NOT NULL,
  experience text NOT NULL,
  bio text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Mentors are viewable by everyone" ON mentors;
  DROP POLICY IF EXISTS "Users can register as mentors" ON mentors;
  DROP POLICY IF EXISTS "Users can update their mentor profile" ON mentors;
END $$;

-- Create policies
CREATE POLICY "Mentors are viewable by everyone"
  ON mentors FOR SELECT
  USING (true);

CREATE POLICY "Users can register as mentors"
  ON mentors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their mentor profile"
  ON mentors FOR UPDATE
  USING (auth.uid() = user_id);