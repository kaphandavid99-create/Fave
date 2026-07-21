-- Emergency unblock: allow all authenticated users to insert/update/select reel_interactions.
-- Run in Supabase SQL editor.

ALTER TABLE public.reel_interactions ENABLE ROW LEVEL SECURITY;

-- Drop all policies on reel_interactions
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN (
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'reel_interactions'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.reel_interactions;', p.policyname);
  END LOOP;
END $$;

-- Permit all operations for authenticated
CREATE POLICY reel_interactions_auth_select
ON public.reel_interactions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY reel_interactions_auth_insert
ON public.reel_interactions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY reel_interactions_auth_update
ON public.reel_interactions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

