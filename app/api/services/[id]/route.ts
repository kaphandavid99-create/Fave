import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data as Service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceData = await request.json();

    // Only include columns that exist in the database schema
    const allowedColumns = [
      'name', 'description', 'price', 'duration', 'category', 
      'image_url', 'is_featured', 'video_url', 'video_public_id',
      'gallery', 'gallery_public_ids', 'cloudinary_public_id'
    ];

    const filteredData = Object.entries(serviceData).reduce((acc: any, [key, value]) => {
      // Only include allowed columns that have values
      if (allowedColumns.includes(key) && value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('Updating service with data:', filteredData);

    const { data, error } = await supabase
      .from('services')
      .update(filteredData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data as Service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const forceDelete = searchParams.get('force') === 'true';
    
    console.log('=== DELETE SERVICE DEBUG ===');
    console.log('Service ID to delete:', id);
    console.log('Force delete:', forceDelete);

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not set');
      return NextResponse.json(
        { error: 'Supabase not configured', details: 'Missing environment variables' },
        { status: 500 }
      );
    }

    // First check if the service exists
    const { data: existingService, error: checkError } = await supabase
      .from('services')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error('Error checking if service exists:', checkError);
      console.error('Error message:', checkError.message);
      console.error('Error code:', checkError.code);
      console.error('Error details:', checkError.details);
      console.error('Error hint:', checkError.hint);
      throw new Error(`Supabase check error: ${checkError.message} (Code: ${checkError.code})`);
    }

    if (!existingService) {
      console.error('Service not found with ID:', id);
      return NextResponse.json(
        { error: 'Service not found', details: `No service found with ID: ${id}` },
        { status: 404 }
      );
    }

    console.log('Service found, proceeding with deletion:', existingService);

    // Check if service has bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('service_id', id);

    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError);
      throw new Error(`Failed to check bookings: ${bookingsError.message}`);
    }

    if (bookings && bookings.length > 0) {
      console.log('Service has bookings:', bookings.length);
      
      if (!forceDelete) {
        return NextResponse.json(
          { 
            error: 'Cannot delete service', 
            details: `This service has ${bookings.length} booking(s) associated with it. Please delete the bookings first or use force delete.` 
          },
          { status: 400 }
        );
      }
      
      // Force delete: Delete associated bookings first
      console.log('Force delete enabled - deleting associated bookings...');
      const { error: deleteBookingsError } = await supabase
        .from('bookings')
        .delete()
        .eq('service_id', id);
      
      if (deleteBookingsError) {
        console.error('Error deleting bookings:', deleteBookingsError);
        throw new Error(`Failed to delete associated bookings: ${deleteBookingsError.message}`);
      }
      
      console.log('Associated bookings deleted successfully');
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      // Handle specific error codes
      if (error.code === '23503') {
        throw new Error('This service cannot be deleted because it is referenced by other records (bookings). Please delete the associated bookings first.');
      }
      
      throw new Error(`Supabase delete error: ${error.message} (Code: ${error.code})`);
    }

    console.log('Service deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('=== DELETE SERVICE CATCH ERROR ===');
    console.error('Error deleting service:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    
    let errorMessage = 'Unknown error';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { message: error.message, stack: error.stack, name: error.name };
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
      errorDetails = error;
      console.error('Error object:', JSON.stringify(error, null, 2));
    } else {
      errorMessage = String(error);
      console.error('String error:', errorMessage);
    }
    
    console.error('Returning error response:', { error: 'Failed to delete service', details: errorMessage });
    
    return NextResponse.json(
      { 
        error: 'Failed to delete service', 
        details: errorMessage,
        errorDetails: errorDetails
      },
      { status: 500 }
    );
  }
}
