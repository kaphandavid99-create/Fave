-- Adds RPC used by reel comment endpoint to increment comment_count in reel_interactions

-- Usage (from Supabase RPC):
-- select increment_reel_interactions_comment_count(reel_id := '...', clerk_user_id := '...');

CREATE OR REPLACE FUNCTION public.increment_reel_interactions_comment_count(
  reel_id uuid,
  clerk_user_id text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only increment if the interaction row exists
  UPDATE public.reel_interactions
  SET comment_count = comment_count + 1,
      updated_at = now()
  WHERE reel_id = increment_reel_interactions_comment_count.reel_id
    AND clerk_user_id = increment_reel_interactions_comment_count.clerk_user_id;
END;
$$;

