-- Updated Hair Braiding Project Database Schema for Supabase with Cloudinary support

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services Table (braiding services offered) - Updated with Cloudinary fields
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  category VARCHAR(100), -- e.g., 'knotless', 'box braids', 'cornrows'
  image_url VARCHAR(500), -- Can be Cloudinary URL or local path
  cloudinary_public_id VARCHAR(500), -- Cloudinary public ID for deletions/transformations
  image_width INTEGER, -- Store dimensions for responsive design
  image_height INTEGER,
  video_url VARCHAR(500), -- Video URL for service showcase
  video_public_id VARCHAR(500), -- Cloudinary public ID for video
  gallery TEXT[], -- Array of additional image URLs
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stylists Table (hair braiding professionals) - Updated with Cloudinary fields
CREATE TABLE IF NOT EXISTS stylists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  specialties TEXT[], -- array of specialties
  image_url VARCHAR(500), -- Cloudinary URL or local path
  cloudinary_public_id VARCHAR(500), -- Cloudinary public ID
  image_width INTEGER,
  image_height INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table - Updated with Cloudinary support for customer photos
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  preferences JSONB, -- store hair preferences, allergies, photo_url, etc.
  photo_url VARCHAR(500), -- Customer's photo URL from Cloudinary
  photo_public_id VARCHAR(500), -- Customer photo Cloudinary public ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table (appointments) - Enhanced with before/after photo support
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  total_price DECIMAL(10,2),
  before_photo_url VARCHAR(500), -- Before photo URL (Cloudinary)
  before_photo_public_id VARCHAR(500), -- Before photo Cloudinary public ID
  after_photo_url VARCHAR(500), -- After photo URL (Cloudinary)
  after_photo_public_id VARCHAR(500), -- After photo Cloudinary public ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability Table (stylist availability)
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stylist_id UUID REFERENCES stylists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stylist_id ON bookings(stylist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_availability_stylist_id ON availability(stylist_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Update existing services if table exists and add Cloudinary fields if they don't exist
DO $$
BEGIN
    -- Add Cloudinary columns to services table if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE services ADD COLUMN cloudinary_public_id VARCHAR(500);
        ALTER TABLE services ADD COLUMN image_width INTEGER;
        ALTER TABLE services ADD COLUMN image_height INTEGER;
    END IF;
    
    -- Add video and gallery columns to services table if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'video_url'
    ) THEN
        ALTER TABLE services ADD COLUMN video_url VARCHAR(500);
        ALTER TABLE services ADD COLUMN video_public_id VARCHAR(500);
        ALTER TABLE services ADD COLUMN gallery TEXT[] DEFAULT ARRAY[]::TEXT;
    END IF;
    
    -- Add Cloudinary columns to stylists table if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'stylists' AND column_name = 'cloudinary_public_id'
    ) THEN
        ALTER TABLE stylists ADD COLUMN cloudinary_public_id VARCHAR(500);
        ALTER TABLE stylists ADD COLUMN image_width INTEGER;
        ALTER TABLE stylists ADD COLUMN image_height INTEGER;
    END IF;
    
    -- Add customer photo fields to customers table if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'photo_url'
    ) THEN
        ALTER TABLE customers ADD COLUMN photo_url VARCHAR(500);
        ALTER TABLE customers ADD COLUMN photo_public_id VARCHAR(500);
    END IF;
    
    -- Add before/after photo fields to bookings table if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'before_photo_url'
    ) THEN
        ALTER TABLE bookings ADD COLUMN before_photo_url VARCHAR(500);
        ALTER TABLE bookings ADD COLUMN before_photo_public_id VARCHAR(500);
        ALTER TABLE bookings ADD COLUMN after_photo_url VARCHAR(500);
        ALTER TABLE bookings ADD COLUMN after_photo_public_id VARCHAR(500);
    END IF;
END $$;

-- Insert sample services (with Cloudinary-ready fields)
INSERT INTO services (name, description, price, duration, category, is_featured) VALUES
('Goddess Knotless Braids', 'Intricate knotless braids with a goddess style pattern', 250.00, 240, 'knotless', TRUE),
('Box Braids', 'Classic box braids with clean parts and neat finish', 180.00, 180, 'box braids', FALSE),
('Cornrows', 'Traditional cornrows with modern styling options', 120.00, 90, 'cornrows', FALSE),
('Feed-in Braids', 'Natural-looking feed-in braids with seamless hair integration', 200.00, 180, 'feed-in', FALSE),
('Bohemian Braids', 'Relaxed bohemian style with loose strands', 220.00, 200, 'bohemian', FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample stylist
INSERT INTO stylists (name, bio, specialties, rating) VALUES
('Master Braider', '10+ years of experience in all braiding techniques', ARRAY['knotless', 'box braids', 'cornrows', 'feed-in'], 4.8)
ON CONFLICT DO NOTHING;

-- Insert sample availability
INSERT INTO availability (stylist_id, day_of_week, start_time, end_time) VALUES
(
  (SELECT id FROM stylists LIMIT 1),
  1, -- Monday
  '09:00:00',
  '18:00:00'
),
(
  (SELECT id FROM stylists LIMIT 1),
  2, -- Tuesday  
  '09:00:00',
  '18:00:00'
),
(
  (SELECT id FROM stylists LIMIT 1),
  3, -- Wednesday
  '09:00:00',
  '18:00:00'
),
(
  (SELECT id FROM stylists LIMIT 1),
  4, -- Thursday
  '09:00:00',
  '18:00:00'
),
(
  (SELECT id FROM stylists LIMIT 1),
  5, -- Friday
  '09:00:00',
  '18:00:00'
),
(
  (SELECT id FROM stylists LIMIT 1),
  6, -- Saturday
  '10:00:00',
  '17:00:00'
)
ON CONFLICT DO NOTHING;
