-- Fix RLS policies for videos table
-- Run this in your Supabase SQL editor

-- Enable RLS on videos table
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON videos;
DROP POLICY IF EXISTS "Enable insert for all users" ON videos;
DROP POLICY IF EXISTS "Enable update for all users" ON videos;
DROP POLICY IF EXISTS "Enable delete for all users" ON videos;

-- Create policies to allow all operations for public access
CREATE POLICY "Enable read access for all users" ON videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for all users" ON videos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON videos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON videos
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
WHERE tablename = 'videos';

-- Test the policy
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for videos table have been set up successfully';
END $$;