import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type RespondPayload = {
  status: 'confirmed' | 'cancelled';
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as RespondPayload;

    if (!payload?.status || !['confirmed', 'cancelled'].includes(payload.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update booking status
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: payload.status })
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        service:services(*),
        style_name,
        style_image
      `)
      .single();

    if (updateError) {
      console.error('Respond booking update error:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Failed to update booking' },
        { status: 500 }
      );
    }

    if (!updatedBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Create notification for the booking customer.
    // Current notifications are in-memory and keyed by `x-user-id`.
    const customerId = (updatedBooking.customer as any)?.id;
    const customerEmail = (updatedBooking.customer as any)?.email;

    const styleName = (updatedBooking as any)?.style_name;
    const fallbackServiceName = (updatedBooking.service as any)?.name;

    const message =
      payload.status === 'confirmed'
        ? `✅ Your booking${(styleName || fallbackServiceName) ? ` for ${styleName || fallbackServiceName}` : ''} has been confirmed.`
        : `❌ Your booking${(styleName || fallbackServiceName) ? ` for ${styleName || fallbackServiceName}` : ''} has been rejected.`;

    const userKey = customerId || customerEmail;
    if (userKey) {
      // Write notification using dedicated insertion endpoint.
      const origin = process.env.NEXT_PUBLIC_APP_URL || '';
      await fetch(`${origin}/api/notifications/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userKey,
        },
        body: JSON.stringify({ message }),
      }).catch(() => {
        // no-op
      });
    }


    return NextResponse.json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Respond booking error:', error);
    return NextResponse.json(
      { error: 'Failed to respond to booking' },
      { status: 500 }
    );
  }
}

