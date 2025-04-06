/*
  # Fix Profiles Table RLS Policies

  1. Changes
    - Update RLS policies for the profiles table to:
      - Allow authenticated users to insert their own profile
      - Allow authenticated users to update their own profile
      - Allow public access to view profiles
    - Add policies that properly handle profile creation and management

  2. Security
    - Ensure users can only create/update their own profile
    - Maintain public read access for profiles
    - Prevent unauthorized modifications
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Allow users to create their own profile" ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public read access to profiles" ON profiles
FOR SELECT
USING (true);