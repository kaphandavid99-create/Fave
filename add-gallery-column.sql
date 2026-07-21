-- Add missing columns to services table if they don't exist
-- Run this in your Supabase SQL editor to update your database schema

DO $$
BEGIN
    -- Add video_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'video_url'
    ) THEN
        ALTER TABLE services ADD COLUMN video_url VARCHAR(500);
        RAISE NOTICE 'Added video_url column';
    END IF;
    
    -- Add video_public_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'video_public_id'
    ) THEN
        ALTER TABLE services ADD COLUMN video_public_id VARCHAR(500);
        RAISE NOTICE 'Added video_public_id column';
    END IF;
    
    -- Add gallery column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'gallery'
    ) THEN
        ALTER TABLE services ADD COLUMN gallery TEXT[] DEFAULT ARRAY[]::TEXT[];
        RAISE NOTICE 'Added gallery column';
    END IF;
    
    -- Add gallery_public_ids column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'gallery_public_ids'
    ) THEN
        ALTER TABLE services ADD COLUMN gallery_public_ids TEXT[] DEFAULT ARRAY[]::TEXT[];
        RAISE NOTICE 'Added gallery_public_ids column';
    END IF;
    
    -- Add cloudinary_public_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE services ADD COLUMN cloudinary_public_id VARCHAR(500);
        RAISE NOTICE 'Added cloudinary_public_id column';
    END IF;
    
    -- Add image_width column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'image_width'
    ) THEN
        ALTER TABLE services ADD COLUMN image_width INTEGER;
        RAISE NOTICE 'Added image_width column';
    END IF;
    
    -- Add image_height column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'image_height'
    ) THEN
        ALTER TABLE services ADD COLUMN image_height INTEGER;
        RAISE NOTICE 'Added image_height column';
    END IF;
    
    RAISE NOTICE 'Database schema update completed successfully';
END $$;