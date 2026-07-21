-- Check RLS policies on services table
-- Run this in your Supabase SQL editor

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

-- Check if RLS is enabled on services table
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'services';