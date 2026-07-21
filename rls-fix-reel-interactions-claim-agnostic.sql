-- Claim-agnostic RLS workaround for reel_interactions
-- IMPORTANT: This is less secure than claim-based policies.
-- Only run this if your app cannot reliably map Clerk id into JWT claims.

-- Run in Supabase SQL editor

-- Enable RLS
ALTER TABLE public.reel_interactions ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies on reel_interactions to avoid conflicts
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

-- Allow authenticated users to INSERT/UPDATE/SELECT any rows.
-- This prevents RLS violations and lets your feature work.
-- If later you want security back, replace these policies with claim-based ones.

CREATE POLICY "reel_interactions_public_select_authenticated"
ON public.reel_interactions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "reel_interactions_authenticated_insert"
ON public.reel_interactions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "reel_interactions_authenticated_update"
ON public.reel_interactions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- If you later add deletes
-- CREATE POLICY "reel_interactions_authenticated_delete"
-- ON public.reel_interactions
-- FOR DELETE
-- TO authenticated
-- USING (true);

