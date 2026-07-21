-- Run in Supabase SQL editor to debug INSERT RLS on public.reels
-- 1) This uses a dummy auth role; replace role logic if needed.
-- 2) The goal is to see what policy is blocking.

-- Show current policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'reels'
order by policyname;

-- Check if RLS is enabled
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where relname = 'reels';

-- Attempt an insert (will fail under RLS). Use dummy values.
-- Replace values with valid types.
BEGIN;

INSERT INTO public.reels (video_url, video_public_id, description, view_count)
VALUES ('https://example.com/test.mp4', null, 'test', 0);

COMMIT;

