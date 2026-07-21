import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Customer } from '@/types/database';
import { currentUser } from '@clerk/nextjs/server';


export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const search = searchParams.get('search');
    
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (email) {
      query = query.eq('email', email);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: data as Customer[] });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', details: 'Please sign in to create bookings.' }, { status: 401 });
  }


  try {
    const customerData = await request.json();

    console.log('Received customer data:', customerData);

    // Check if customer already exists by email
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerData.email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the error code for "not found", which is expected
      console.error('Error checking existing customer:', fetchError);
      throw new Error('Failed to check existing customer');
    }

    if (existingCustomer) {
      console.log('Customer already exists:', existingCustomer);
      return NextResponse.json({ data: existingCustomer as Customer });
    }

    // Create new customer
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      throw new Error(error.message || 'Failed to create customer');
    }

    console.log('Customer created successfully:', data);

    return NextResponse.json({ data: data as Customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create customer';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
