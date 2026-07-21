import { NextRequest, NextResponse } from 'next/server';

function formatWhatsAppTo(number: string) {
  const trimmed = (number || '').trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('whatsapp:')) return trimmed;

  return `whatsapp:${trimmed.startsWith('+') ? trimmed : `+${trimmed}`}`;
}

export async function POST(req: NextRequest) {
  try {
    console.log('[whatsapp/booking-notify] request received');
    const body = await req.json().catch(() => ({}));

    const {
      adminWhatsAppNumber,
      customerName,
      customerEmail,
      customerPhone,
      serviceName,
      price,
      durationMinutes,
      appointmentDate,
      appointmentTime,
      notes,
    } = body as {
      adminWhatsAppNumber?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      serviceName?: string;
      price?: number;
      durationMinutes?: number;
      appointmentDate?: string;
      appointmentTime?: string;
      notes?: string;
    };

    const adminNumber =
      (adminWhatsAppNumber && adminWhatsAppNumber.trim()) ||
      process.env.WHATSAPP_ADMIN_NUMBER ||
      process.env.ADMIN_WHATSAPP_NUMBER ||
      process.env.ADMIN_WHATSAPP ||
      '';

    if (!adminNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing WHATSAPP_ADMIN_NUMBER' },
        { status: 500 }
      );
    }

    const message = `🎉 New Booking Alert!\n\n👤 Customer: ${customerName || '-'}\n📧 Email: ${customerEmail || '-'}\n📱 Phone: ${customerPhone || '-'}\n\n💇 Service: ${serviceName || '-'}\n💰 Price: ${typeof price === 'number' ? `${price}` : '-'}\n⏱️ Duration: ${typeof durationMinutes === 'number' ? `${durationMinutes} minutes` : '-'}\n\n📅 Date: ${appointmentDate || '-'}\n🕐 Time: ${appointmentTime || '-'}\n\n📝 Notes: ${notes || 'None'}\n\nPlease confirm this booking.`;

    const toWhatsApp = formatWhatsAppTo(adminNumber);

    return NextResponse.json({
      success: false,
      error: 'WhatsApp notifications are currently disabled in this deployment.',
      debug: {
        toWhatsApp,
        message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to notify admin',
      },
      { status: 500 }
    );
  }
}

