import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type SubscribeBody = {
  email?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as SubscribeBody;
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Insert into Supabase (idempotent via unique email)
    const { data, error } = await supabase
      .from('subscribers')
      .insert({ email })
      .select('id,email,created_at')
      .single();

    // If already exists, Supabase may throw a unique constraint error.
    // Handle by fetching existing record.
    if (error) {
      const { data: existing, error: fetchErr } = await supabase
        .from('subscribers')
        .select('id,email,created_at')
        .eq('email', email)
        .single();

      if (fetchErr) {
        console.error('Subscribe insert error:', error);
        console.error('Subscribe existing fetch error:', fetchErr);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: existing });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}



