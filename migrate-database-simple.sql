-- Simple database migration for video showcase
-- Run this in your Supabase SQL editor

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_url VARCHAR(500) NOT NULL,
  video_public_id VARCHAR(500),
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_videos_display_order ON videos(display_order);

-- Add video_url column to services if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'video_url'
    ) THEN
        ALTER TABLE services ADD COLUMN video_url VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'video_public_id'
    ) THEN
        ALTER TABLE services ADD COLUMN video_public_id VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'gallery'
    ) THEN
        ALTER TABLE services ADD COLUMN gallery TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'gallery_public_ids'
    ) THEN
        ALTER TABLE services ADD COLUMN gallery_public_ids TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE services ADD COLUMN cloudinary_public_id VARCHAR(500);
    END IF;
END $$;

-- Migration completed successfully