-- Fix RLS for reel_interactions failing inserts/updates
-- Run in Supabase SQL editor

-- Assumption: your auth user id is stored in reel_interactions.clerk_user_id
-- as text.

-- 1) Ensure RLS is enabled
ALTER TABLE public.reel_interactions ENABLE ROW LEVEL SECURITY;

-- 2) Remove overly-strict/incorrect policies (if they exist)
DROP POLICY IF EXISTS "Allow authenticated all on reel_interactions" ON public.reel_interactions;

-- 3) Add policies that cover INSERT, UPDATE, SELECT separately
-- SELECT: users can read only their own interaction rows
CREATE POLICY "reel_interactions_select_own"
ON public.reel_interactions
FOR SELECT
USING (auth.uid()::text = clerk_user_id);

-- INSERT: users can create only rows with clerk_user_id = auth.uid()
CREATE POLICY "reel_interactions_insert_own"
ON public.reel_interactions
FOR INSERT
WITH CHECK (auth.uid()::text = clerk_user_id);

-- UPDATE: users can update only their own rows
CREATE POLICY "reel_interactions_update_own"
ON public.reel_interactions
FOR UPDATE
USING (auth.uid()::text = clerk_user_id)
WITH CHECK (auth.uid()::text = clerk_user_id);

-- (Optional) DELETE: if you ever add it
CREATE POLICY "reel_interactions_delete_own"
ON public.reel_interactions
FOR DELETE
USING (auth.uid()::text = clerk_user_id);

-- 4) Ensure no conflicting policies exist for INSERT/UPDATE
-- (If you still get violations, the issue is almost certainly auth.uid() mismatch.)

