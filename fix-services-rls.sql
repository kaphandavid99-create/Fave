-- Fix RLS policies for services table
-- Run this in your Supabase SQL editor

-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON services;
DROP POLICY IF EXISTS "Enable insert for all users" ON services;
DROP POLICY IF EXISTS "Enable update for all users" ON services;
DROP POLICY IF EXISTS "Enable delete for all users" ON services;

-- Create policies to allow all operations for public access
CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for all users" ON services
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON services
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON services
  FOR DELETE
  TO public
  USING (true);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'services';

-- Test the policy
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for services table have been set up successfully';
END $$;