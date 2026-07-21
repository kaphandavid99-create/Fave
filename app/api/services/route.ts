import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types/database';

// Mock data for when Supabase is not configured
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Box Braids',
    description: 'Classic protective style with neat, box-shaped sections',
    price: 120,
    duration: 180,
    category: 'Braids',
    image_url: null,
    cloudinary_public_id: null,
    video_url: null,
    video_public_id: null,
    gallery: [],
    gallery_public_ids: [],
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cornrows',
    description: 'Traditional braided style close to the scalp',
    price: 80,
    duration: 120,
    category: 'Braids',
    image_url: null,
    cloudinary_public_id: null,
    video_url: null,
    video_public_id: null,
    gallery: [],
    gallery_public_ids: [],
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Senegalese Twists',
    description: 'Elegant twists with a smooth, rope-like texture',
    price: 150,
    duration: 240,
    category: 'Twists',
    image_url: null,
    cloudinary_public_id: null,
    video_url: null,
    video_public_id: null,
    gallery: [],
    gallery_public_ids: [],
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Faux Locs',
    description: 'Protective style that mimics traditional locs',
    price: 180,
    duration: 300,
    category: 'Locs',
    image_url: null,
    cloudinary_public_id: null,
    video_url: null,
    video_public_id: null,
    gallery: [],
    gallery_public_ids: [],
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Knotless Braids',
    description: 'Tension-free braids for a natural look',
    price: 140,
    duration: 200,
    category: 'Braids',
    image_url: null,
    cloudinary_public_id: null,
    video_url: null,
    video_public_id: null,
    gallery: [],
    gallery_public_ids: [],
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Micro Braids',
    description: 'Delicate, tiny braids for intricate styling',
    price: 200,
    duration: 360,
    category: 'Braids',
    image_url: null,
    cloudinary_public_id: null,
    video_url: null,
    video_public_id: null,
    gallery: [],
    gallery_public_ids: [],
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase not configured, returning mock services data');
      let filteredServices = mockServices;
      if (featured === 'true') {
        filteredServices = mockServices.filter(s => s.is_featured);
      }
      return NextResponse.json({ data: filteredServices });
    }
    
    let query = supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: data as Service[] });
  } catch (error) {
    console.error('Error fetching services:', error);
    // Return mock data as fallback
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    let filteredServices = mockServices;
    if (featured === 'true') {
      filteredServices = mockServices.filter(s => s.is_featured);
    }
    return NextResponse.json({ data: filteredServices });
  }
}

export async function POST(request: Request) {
  try {
    const serviceData = await request.json();

    console.log('=== SERVICE CREATION DEBUG ===');
    console.log('Received service data:', JSON.stringify(serviceData, null, 2));

    // Check required fields
    if (!serviceData.name || !serviceData.price || !serviceData.duration) {
      console.error('Missing required fields:', { 
        name: !!serviceData.name, 
        price: !!serviceData.price, 
        duration: !!serviceData.duration 
      });
      return NextResponse.json(
        { error: 'Missing required fields: name, price, and duration are required' },
        { status: 400 }
      );
    }

    // Build complete service data with ALL fields in a single insert
    const completeData: any = {
      name: serviceData.name,
      price: parseFloat(serviceData.price),
      duration: parseInt(serviceData.duration),
      is_featured: serviceData.is_featured || false,
    };

    // Add all optional fields including media fields in the SAME insert
    if (serviceData.description) completeData.description = serviceData.description;
    if (serviceData.category) completeData.category = serviceData.category;
    if (serviceData.image_url) completeData.image_url = serviceData.image_url;
    if (serviceData.cloudinary_public_id) completeData.cloudinary_public_id = serviceData.cloudinary_public_id;
    if (serviceData.video_url) completeData.video_url = serviceData.video_url;
    if (serviceData.video_public_id) completeData.video_public_id = serviceData.video_public_id;
    if (serviceData.gallery && Array.isArray(serviceData.gallery) && serviceData.gallery.length > 0) {
      completeData.gallery = serviceData.gallery;
    }
    if (serviceData.gallery_public_ids && Array.isArray(serviceData.gallery_public_ids) && serviceData.gallery_public_ids.length > 0) {
      completeData.gallery_public_ids = serviceData.gallery_public_ids;
    }

    console.log('Creating service with complete data:', JSON.stringify(completeData, null, 2));

    const { data, error } = await supabase
      .from('services')
      .insert([completeData])
      .select()
      .single();

    if (error) {
      console.error('=== INSERT FAILED ===');
      console.error('Supabase error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to create service', details: (error as any).message || 'Database error' },
        { status: 500 }
      );
    }

    console.log('Service created successfully with all fields:', data?.id);
    console.log('=== SERVICE CREATION COMPLETE ===');
    return NextResponse.json({ data: data as Service }, { status: 201 });
  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===');
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
