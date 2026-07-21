-- Debug: confirm which schema/table RLS is being applied to
-- Run in Supabase SQL editor.

-- 1) Find where reel_interactions table exists
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name = 'reel_interactions'
ORDER BY table_schema;

-- 2) Show RLS status + policies for any matching schema
DO $$
DECLARE
  s text;
  t text;
BEGIN
  FOR s,t IN
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name = 'reel_interactions'
  LOOP
    RAISE NOTICE '--- schema=%, table=% ---', s, t;

    -- RLS enabled?
    PERFORM 1;
    EXECUTE format('SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=%L AND c.relname=%L', s, t);

    -- Policies
    EXECUTE format($f$
      SELECT policyname, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE schemaname=%L AND tablename=%L
      ORDER BY policyname
    $f$, s, t);
  END LOOP;
END $$;

-- 3) Show current auth uid (may be null depending on role setup)
SELECT auth.uid() AS auth_uid;

-- 4) Try to show current JWT
SELECT auth.jwt() AS jwt;

