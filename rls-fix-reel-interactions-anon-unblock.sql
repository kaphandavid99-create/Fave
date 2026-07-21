-- Unblock: allow anon role to like/save/comment by disabling strict RLS
-- Run in Supabase SQL editor.

ALTER TABLE public.reel_interactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on the table
DO $$
DECLARE p record;
BEGIN
  FOR p IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname='public' AND tablename='reel_interactions'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.reel_interactions;', p.policyname);
  END LOOP;
END $$;

-- Allow anon read/write
CREATE POLICY reel_interactions_anon_select
ON public.reel_interactions
FOR SELECT
TO anon
USING (true);

CREATE POLICY reel_interactions_anon_insert
ON public.reel_interactions
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY reel_interactions_anon_update
ON public.reel_interactions
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

