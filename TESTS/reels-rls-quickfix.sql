-- Quick RLS bypass for reels (TEST ONLY)
-- Run in Supabase SQL editor.
-- Goal: make uploads succeed so reels appear on the website.
-- WARNING: This weakens security for reels. Revert after confirming.

-- 1) Ensure table exists
-- (Optional) select count(*) from public.reels;

-- 2) Disable RLS entirely for reels
ALTER TABLE public.reels DISABLE ROW LEVEL SECURITY;

-- 3) Also remove restrictive policies (optional safety)
-- Dropping policies prevents confusion when RLS is re-enabled.
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname='public' AND tablename='reels'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.reels', p.policyname);
  END LOOP;
END $$;

-- Done. Re-enable later if needed.

