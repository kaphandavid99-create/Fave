-- Add missing style fields expected by app/API code
-- Run this in your Supabase SQL editor

DO $$
BEGIN
  -- style_name
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bookings'
      AND column_name = 'style_name'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN style_name VARCHAR(255);
  END IF;

  -- style_image
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bookings'
      AND column_name = 'style_image'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN style_image VARCHAR(500);
  END IF;
END $$;

