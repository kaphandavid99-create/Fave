-- Reels feature schema (Supabase/Postgres)
-- Run in Supabase SQL editor

-- Optional: helper for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reels master table
CREATE TABLE IF NOT EXISTS public.reels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Store the hosted video URL (Cloudinary, S3, etc.)
  video_url varchar(700) NOT NULL,
  -- If you use Cloudinary, keep the public_id to support delete/update
  video_public_id varchar(700),
  description text,
  view_count bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reels_created_at ON public.reels (created_at desc);

-- Tags (optional)
CREATE TABLE IF NOT EXISTS public.reel_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reel_id uuid NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  tag varchar(100) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reel_id, tag)
);

-- One row per user per reel interactions
-- clerk_user_id is expected to be your Clerk subject/user id
CREATE TABLE IF NOT EXISTS public.reel_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id text NOT NULL,
  reel_id uuid NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  liked boolean NOT NULL DEFAULT false,
  saved boolean NOT NULL DEFAULT false,
  comment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clerk_user_id, reel_id)
);

CREATE INDEX IF NOT EXISTS idx_reel_interactions_reel_id ON public.reel_interactions (reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_interactions_user ON public.reel_interactions (clerk_user_id);

-- Comments
CREATE TABLE IF NOT EXISTS public.reel_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id text NOT NULL,
  reel_id uuid NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reel_comments_reel_id ON public.reel_comments (reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_comments_created_at ON public.reel_comments (created_at desc);

-- Saves (optional convenience table; also handled by reel_interactions.saved)
CREATE TABLE IF NOT EXISTS public.reel_saves (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id text NOT NULL,
  reel_id uuid NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clerk_user_id, reel_id)
);

CREATE INDEX IF NOT EXISTS idx_reel_saves_reel_id ON public.reel_saves (reel_id);

-- Views (optional analytics)
CREATE TABLE IF NOT EXISTS public.reel_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id text,
  reel_id uuid NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  -- Basic de-dupe window (optional; your API can enforce this)
  session_key varchar(200)
);

CREATE INDEX IF NOT EXISTS idx_reel_views_reel_id ON public.reel_views (reel_id);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reels_updated_at ON public.reels;
CREATE TRIGGER update_reels_updated_at
BEFORE UPDATE ON public.reels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reel_interactions_updated_at ON public.reel_interactions;
CREATE TRIGGER update_reel_interactions_updated_at
BEFORE UPDATE ON public.reel_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for Reels
-- Enable RLS
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reels (public access)
CREATE POLICY "Allow public read access on reels" 
ON public.reels FOR SELECT 
USING (true);

-- Allow authenticated users to insert reels (for admin uploads)
CREATE POLICY "Allow authenticated insert on reels" 
ON public.reels FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow service role to update/delete reels
CREATE POLICY "Allow service role all access on reels" 
ON public.reels FOR ALL 
USING (auth.role() = 'service_role');

-- RLS Policies for other tables (similar approach)
ALTER TABLE public.reel_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on reel_tags" ON public.reel_tags FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on reel_tags" ON public.reel_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE public.reel_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated all on reel_interactions" ON public.reel_interactions FOR ALL USING (auth.uid()::text = clerk_user_id);

ALTER TABLE public.reel_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on reel_comments" ON public.reel_comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on reel_comments" ON public.reel_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE public.reel_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated all on reel_saves" ON public.reel_saves FOR ALL USING (auth.uid()::text = clerk_user_id);

ALTER TABLE public.reel_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on reel_views" ON public.reel_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on reel_views" ON public.reel_views FOR SELECT USING (true);

