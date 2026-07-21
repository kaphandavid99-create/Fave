-- Create media table for storing uploaded images and videos
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  public_id TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'image' or 'video'
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  folder TEXT DEFAULT 'hair-braiding',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- Enable Row Level Security
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (ignore errors if they don't)
DROP POLICY IF EXISTS "Anyone can view media" ON media;
DROP POLICY IF EXISTS "Anyone can insert media" ON media;
DROP POLICY IF EXISTS "Anyone can update media" ON media;
DROP POLICY IF EXISTS "Anyone can delete media" ON media;

-- Create policies
CREATE POLICY "Anyone can view media" ON media FOR SELECT USING (true);
CREATE POLICY "Anyone can insert media" ON media FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update media" ON media FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete media" ON media FOR DELETE USING (true);