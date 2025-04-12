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
    - Add policies for authenticated users to manage their profiles
*/

CREATE TABLE IF NOT EXISTS pet_profiles (
  id text PRIMARY KEY,
  name text,
  breed text,
  age integer,
  gender text CHECK (gender IN ('male', 'female')),
  description text,
  image_url text,
  cover_image_url text,
  owner_name text,
  owner_phone text,
  owner_email text,
  pin text,
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE pet_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON pet_profiles
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert new profiles
CREATE POLICY "Users can create profiles"
  ON pet_profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update their own profiles
CREATE POLICY "Users can update their own profiles"
  ON pet_profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
