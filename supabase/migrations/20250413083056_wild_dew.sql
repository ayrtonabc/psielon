/*
  # Add is_complete field to pet_profiles table

  1. Changes
    - Add `is_complete` boolean column with default false
    - Add trigger to automatically update is_complete when profile data is set

  2. Purpose
    - Track whether a profile has been completed by the user
    - Simplify frontend logic for showing HeroSection vs Profile view
    - Avoid relying on checking multiple fields for completion status

  3. Security
    - No changes to existing RLS policies needed
*/

-- Add is_complete column
ALTER TABLE pet_profiles 
  ADD COLUMN IF NOT EXISTS is_complete boolean DEFAULT false;

-- Create function to check if profile is complete
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile is considered complete if essential fields are filled
  NEW.is_complete := (
    NEW.name IS NOT NULL AND
    NEW.name != '' AND
    NEW.breed IS NOT NULL AND
    NEW.breed != '' AND
    NEW.owner_name IS NOT NULL AND
    NEW.owner_name != '' AND
    NEW.owner_phone IS NOT NULL AND
    NEW.owner_phone != ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update is_complete
CREATE TRIGGER update_profile_completion
  BEFORE INSERT OR UPDATE ON pet_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_profile_completion();

-- Update existing records
UPDATE pet_profiles
SET is_complete = (
  name IS NOT NULL AND
  name != '' AND
  breed IS NOT NULL AND
  breed != '' AND
  owner_name IS NOT NULL AND
  owner_name != '' AND
  owner_phone IS NOT NULL AND
  owner_phone != ''
);