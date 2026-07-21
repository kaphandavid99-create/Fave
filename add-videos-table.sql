-- Create videos table for the video showcase section
-- Run this in your Supabase SQL editor

DO $$
BEGIN
    -- Create videos table if it doesn't exist
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

    -- Add indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON videos(is_featured);
    CREATE INDEX IF NOT EXISTS idx_videos_display_order ON videos(display_order);
    
    -- Add trigger for updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
    CREATE TRIGGER update_videos_updated_at
        BEFORE UPDATE ON videos
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    RAISE NOTICE 'Videos table created successfully';
END $$;