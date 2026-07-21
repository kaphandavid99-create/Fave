-- Complete database migration for the video showcase feature
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create videos table for the video showcase section
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_url varchar(500) NOT NULL,
  video_public_id varchar(500),
  description text,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON public.videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_videos_display_order ON public.videos(display_order);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at on videos table
DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure services table has all necessary columns
DO $$
BEGIN
  -- Add video_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'video_url'
  ) THEN
    ALTER TABLE public.services ADD COLUMN video_url varchar(500);
  END IF;

  -- Add video_public_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'video_public_id'
  ) THEN
    ALTER TABLE public.services ADD COLUMN video_public_id varchar(500);
  END IF;

  -- Add gallery column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'gallery'
  ) THEN
    ALTER TABLE public.services ADD COLUMN gallery text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add gallery_public_ids column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'gallery_public_ids'
  ) THEN
    ALTER TABLE public.services ADD COLUMN gallery_public_ids text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add cloudinary_public_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'cloudinary_public_id'
  ) THEN
    ALTER TABLE public.services ADD COLUMN cloudinary_public_id varchar(500);
  END IF;

  -- Add image_width column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'image_width'
  ) THEN
    ALTER TABLE public.services ADD COLUMN image_width integer;
  END IF;

  -- Add image_height column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'image_height'
  ) THEN
    ALTER TABLE public.services ADD COLUMN image_height integer;
  END IF;
END $$;

