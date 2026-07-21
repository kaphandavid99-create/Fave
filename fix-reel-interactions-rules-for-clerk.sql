-- Fix reel_interactions RLS to use Clerk id stored in clerk_user_id
-- Replace JWT/claim-based auth checks with a stable mapping:
-- We assume your Supabase session role is `authenticated` and that
-- Clerk id is stored in a JWT claim named `clerk_user_id` OR `sub`.
-- This script enables a safe fallback policy set that will PASS inserts
-- for the provided clerk_user_id.
--
-- Run in Supabase SQL editor.

-- 1) Ensure RLS enabled
ALTER TABLE public.reel_interactions ENABLE ROW LEVEL SECURITY;

-- 2) Remove all existing policies on this table
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

-- Helper: extract possible Clerk id from JWT
-- auth.jwt() can be null in some environments; we guard it.
CREATE OR REPLACE FUNCTION public.reel_clerk_id_from_jwt()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  j jsonb;
BEGIN
  BEGIN
    j := auth.jwt();
  EXCEPTION WHEN others THEN
    j := NULL;
  END;

  IF j IS NULL THEN
    RETURN NULL;
  END IF;

  -- Try common claim keys
  RETURN COALESCE(
    j->>'clerk_user_id',
    j->>'user_id',
    j->>'sub'
  );
END;
$$;

-- 3) Policies: allow user to operate ONLY on rows where clerk_user_id matches claim
-- SELECT
CREATE POLICY reel_interactions_select_own
ON public.reel_interactions
FOR SELECT
TO authenticated
USING (clerk_user_id = public.reel_clerk_id_from_jwt());

-- INSERT
CREATE POLICY reel_interactions_insert_own
ON public.reel_interactions
FOR INSERT
TO authenticated
WITH CHECK (clerk_user_id = public.reel_clerk_id_from_jwt());

-- UPDATE
CREATE POLICY reel_interactions_update_own
ON public.reel_interactions
FOR UPDATE
TO authenticated
USING (clerk_user_id = public.reel_clerk_id_from_jwt())
WITH CHECK (clerk_user_id = public.reel_clerk_id_from_jwt());

