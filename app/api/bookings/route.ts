
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Booking, BookingWithDetails } from '@/types/database';
import { currentUser } from '@clerk/nextjs/server';

// Guard: ensure only signed-in users can create bookings.
// (unauthenticated callers will receive 401)


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const stylist_id = searchParams.get('stylist_id');
    const customer_id = searchParams.get('customer_id');
    
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:customers(*),
        stylist:stylists(*),
        service:services(*)
      `)
      .order('appointment_date', { ascending: true });
    
    if (status) {
      query = query.eq('status', status);
    }
    if (stylist_id) {
      query = query.eq('stylist_id', stylist_id);
    }
    if (customer_id) {
      query = query.eq('customer_id', customer_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: data as BookingWithDetails[] });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', details: 'Please sign in to create bookings.' },
      { status: 401 }
    );
  }

  try {
    const bookingData = await request.json();

    console.log('Received booking data:', bookingData);

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        customer:customers(*),
        stylist:stylists(*),
        service:services(*)
      `)
      .single();

    if (error) {
      console.error('Supabase booking error:', error);
      throw new Error(error.message || 'Failed to create booking');
    }

    console.log('Booking created successfully:', data);

    // Notify admin on WhatsApp (server-side). If WhatsApp fails (quota/rate-limit/etc),
    // create an in-app notification so the admin still sees the booking.
    try {
      const booking = data as any;

      const payload = {
        adminWhatsAppNumber: process.env.WHATSAPP_ADMIN_NUMBER,
        customerName: booking?.customer?.name,
        customerEmail: booking?.customer?.email,
        customerPhone: booking?.customer?.phone,
        serviceName: booking?.service?.name,
        price: booking?.total_price ?? booking?.service?.price,
        durationMinutes: booking?.service?.duration,
        appointmentDate: booking?.appointment_date,
        appointmentTime: booking?.appointment_time,
        notes: booking?.notes,
      };

      const whatsappUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/whatsapp/booking-notify`;

      const whatsappRes = await fetch(whatsappUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!whatsappRes.ok) {
        // Fallback: store an in-app notification for admin.
        // Since /api/notifications is currently in-memory, this is best-effort and works in dev.
        // If you later add DB-backed notifications, we can switch this to a Supabase insert.
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/notifications/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `New booking (WhatsApp failed): ${payload.serviceName || '-'} on ${payload.appointmentDate || '-'} at ${payload.appointmentTime || '-'} - ${payload.customerName || '-'}`,
            }),
          });
        } catch {
          // ignore fallback errors
        }
      }
    } catch {
      // never fail booking creation because notification failed
      // fallback should still be best-effort; ignore errors
    }


    return NextResponse.json({ data: data as BookingWithDetails }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
