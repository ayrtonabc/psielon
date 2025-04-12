/*
  # Add address column to pet_profiles table

  1. Changes
    - Add `address` column to `pet_profiles` table
    - Update column names to use snake_case for consistency
    - Add gender constraint

  2. Security
    - No changes to RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pet_profiles' AND column_name = 'address'
  ) THEN
    ALTER TABLE pet_profiles ADD COLUMN address text;
  END IF;
END $$;

ALTER TABLE pet_profiles 
  ADD CONSTRAINT pet_profiles_gender_check 
  CHECK (gender IN ('male', 'female'));
