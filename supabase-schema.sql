-- Hair Braiding Project Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services Table (braiding services offered)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  category VARCHAR(100), -- e.g., 'knotless', 'box braids', 'cornrows'
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stylists Table (hair braiding professionals)
CREATE TABLE stylists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  specialties TEXT[], -- array of specialties
  image_url VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  preferences JSONB, -- store hair preferences, allergies, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table (appointments)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability Table (stylist availability)
CREATE TABLE availability (
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
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_stylist_id ON bookings(stylist_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX idx_availability_stylist_id ON availability(stylist_id);
CREATE INDEX idx_services_category ON services(category);

-- Insert sample services
INSERT INTO services (name, description, price, duration, category, is_featured) VALUES
('Goddess Knotless Braids', 'Intricate knotless braids with a goddess style pattern', 250.00, 240, 'knotless', TRUE),
('Box Braids', 'Classic box braids with clean parts and neat finish', 180.00, 180, 'box braids', FALSE),
('Cornrows', 'Traditional cornrows with modern styling options', 120.00, 90, 'cornrows', FALSE),
('Feed-in Braids', 'Natural-looking feed-in braids with seamless hair integration', 200.00, 180, 'feed-in', FALSE),
('Bohemian Braids', 'Relaxed bohemian style with loose strands', 220.00, 200, 'bohemian', FALSE);

-- Insert sample stylist
INSERT INTO stylists (name, bio, specialties, rating) VALUES
('Master Braider', '10+ years of experience in all braiding techniques', ARRAY['knotless', 'box braids', 'cornrows', 'feed-in'], 4.8);

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
);
