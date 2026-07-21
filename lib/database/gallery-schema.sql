-- Create gallery table for storing portfolio images
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  style_name TEXT NOT NULL,
  length TEXT NOT NULL,
  color TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_style ON gallery(style_name);
CREATE INDEX IF NOT EXISTS idx_gallery_length ON gallery(length);
CREATE INDEX IF NOT EXISTS idx_gallery_color ON gallery(color);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (ignore errors if they don't)
DROP POLICY IF EXISTS "Anyone can view gallery" ON gallery;
DROP POLICY IF EXISTS "Anyone can insert gallery" ON gallery;
DROP POLICY IF EXISTS "Anyone can update gallery" ON gallery;
DROP POLICY IF EXISTS "Anyone can delete gallery" ON gallery;

-- Create policies
CREATE POLICY "Anyone can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete gallery" ON gallery FOR DELETE USING (true);