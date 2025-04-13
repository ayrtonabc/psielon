/*
  # Create pet profiles table

  1. New Tables
    - `pet_profiles`
      - `id` (text, primary key) - NFC tag identifier
      - `name` (text) - Pet's name
      - `breed` (text) - Pet's breed
      - `age` (integer) - Pet's age
      - `gender` (text) - Pet's gender (male/female)
      - `description` (text) - Pet's description
      - `address` (text) - Pet's address
      - `image_url` (text) - URL to pet's profile image
      - `cover_image_url` (text) - URL to pet's cover image
      - `owner_name` (text) - Owner's name
      - `owner_phone` (text) - Owner's phone number
      - `owner_email` (text) - Owner's email
      - `pin` (text) - PIN for profile editing
      - `created_at` (timestamptz) - Profile creation timestamp
      - `last_updated` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `pet_profiles` table
    - Add policies for public read access
    - Add policies for public write access (since this is a demo without auth)
*/

CREATE TABLE IF NOT EXISTS pet_profiles (
  id text PRIMARY KEY,
  name text,
  breed text,
  age integer,
  gender text CHECK (gender IN ('male', 'female')),
  description text,
  address text,
  image_url text,
  cover_image_url text,
  owner_name text,
  owner_phone text,
  owner_email text,
  pin text,
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pet_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON pet_profiles
  FOR SELECT
  USING (true);

-- Allow public insert access
CREATE POLICY "Anyone can create profiles"
  ON pet_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Anyone can update profiles"
  ON pet_profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create an index on the last_updated column for better query performance
CREATE INDEX IF NOT EXISTS idx_pet_profiles_last_updated ON pet_profiles(last_updated);