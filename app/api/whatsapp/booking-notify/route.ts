import { NextRequest, NextResponse } from 'next/server';

function formatWhatsAppTo(number: string) {
  const trimmed = (number || '').trim();
  if (!trimmed) return '';

  // Accept either raw phone number or already-formatted 'whatsapp:+...' style.
  if (trimmed.startsWith('whatsapp:')) return trimmed;

  // Twilio expects: whatsapp:+<E164>
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

    // Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsApp =
      process.env.TWILIO_WHATSAPP_FROM ||
      process.env.TWILIO_PHONE_NUMBER ||
      ''; // e.g. whatsapp:+14155238886
    const toWhatsApp = formatWhatsAppTo(adminNumber);

    const missing: string[] = [];
    if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!fromWhatsApp) missing.push('TWILIO_WHATSAPP_FROM');
    if (!toWhatsApp) missing.push('WHATSAPP_ADMIN_NUMBER (invalid format)');

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Twilio credentials not configured',
          missing,
          debug: {
            toWhatsApp,
            message,
          },
        },
        { status: 500 }
      );
    }

    // Dynamically import Twilio client.
    // Avoids build-time dependency issues and works with different module formats.
    const twilioModule = await import('twilio');
    const TwilioCtor = (twilioModule as any).default || (twilioModule as any);
    const client = TwilioCtor(accountSid, authToken);

    const result = await client.messages.create({
      from: fromWhatsApp,
      to: toWhatsApp,
      body: message,
    });

    return NextResponse.json({
      success: true,
      sid: result.sid,
      to: toWhatsApp,
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

