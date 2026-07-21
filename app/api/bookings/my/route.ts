import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';


// Supabase uses these aliases inside the select() string.
// They are only referenced in the SQL string, so no JS imports are needed.

export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables not set');
      return NextResponse.json(
        {
          error: 'Database not configured',
          details: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables to view real bookings',
        },
        { status: 500 }
      );
    }

    // Clerk current user (recommended for server routes). Avoids session-shape issues.
    const user = await currentUser();

    const email =
      user?.primaryEmailAddress?.emailAddress ??
      // fallback for some Clerk shapes
      (user as any)?.emailAddresses?.[0]?.emailAddress ??
      (user as any)?.email;

    const userId = user?.id ?? (user as any)?.sub;

    console.log('Clerk currentUser present:', !!user);
    console.log('Clerk currentUser id/email:', userId, email);

    if (!user || (!userId && !email)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details:
            'Please sign in to view your bookings (no Clerk user found on this request).',
        },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error: 'Email not found',
          details:
            'Signed in, but could not retrieve an email from the Clerk user. Ensure your Clerk user has an email address.',
        },
        { status: 400 }
      );
    }




    const { data: customerRows, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email);

    console.log('Customer rows:', customerRows);
    console.log('Customer error:', customerError);

    if (customerError) throw customerError;

    const customerId = customerRows?.[0]?.id;
    if (!customerId) {
      console.log('No customer found for email:', email);
      return NextResponse.json(
        {
          error: 'Customer not found',
          details: `No customer record found for email: ${email}. Please contact support or create a customer record.`,
        },
        { status: 404 }
      );
    }

    console.log('Customer ID:', customerId);

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        customer_id,
        stylist_id,
        service_id,
        appointment_date,
        appointment_time,
        status,
        notes,
        total_price,
        created_at,
        style_name,
        service:services(name, price),
        stylist:stylists(name),
        customer:customers(id, email, name, phone)
      `)
      .eq('customer_id', customerId)
      .order('appointment_date', { ascending: false });

    console.log('Bookings data:', data);
    console.log('Bookings error:', error);

    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (e) {
    console.error('Error fetching my bookings:', e);

    const details = e instanceof Error ? e.message : String(e);

    // Return error details so we can see the root cause while debugging.
    return NextResponse.json(
      {
        error: 'Failed to fetch your bookings',
        details,
      },
      { status: 500 }
    );

  }
}
