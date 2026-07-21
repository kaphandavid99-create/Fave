// Database type definitions for the hair braiding project

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number; // in minutes
  category: string | null;
  image_url: string | null;
  cloudinary_public_id: string | null;
  video_url: string | null;
  video_public_id: string | null;
  gallery: string[];
  gallery_public_ids: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stylist {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[];
  image_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  preferences: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  stylist_id: string | null;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  total_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  stylist_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Join types for API responses
export interface BookingWithDetails extends Booking {
  customer?: Customer;
  stylist?: Stylist;
  service?: Service;
}

export interface ServiceWithBooking extends Service {
  bookings?: Booking[];
}

export interface StylistWithAvailability extends Stylist {
  availability?: Availability[];
}
