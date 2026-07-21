-- Debug: inspect RLS policies and current user JWT
-- Run in Supabase SQL editor.

-- Show policies for reel_interactions
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'reel_interactions'
ORDER BY policyname;

-- Show if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND t.tablename = 'reel_interactions';

-- Show auth.uid()
SELECT auth.uid() AS auth_uid;

-- Show JWT claims (may vary). Supabase usually exposes JWT via auth.jwt().
-- Try both common forms.
SELECT auth.jwt() AS jwt;

