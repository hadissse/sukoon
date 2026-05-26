import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      userId: string;
      endpoint: string;
      p256dh: string;
      auth: string;
      preferredHourUtc: number;
      enabled: boolean;
    };

    const { userId, endpoint, p256dh, auth, preferredHourUtc, enabled } = body;

    if (!userId || !endpoint) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const sb = supabaseAdmin();

    if (!enabled) {
      // Disable: mark all subscriptions for this endpoint as disabled
      await sb
        .from('push_subscriptions')
        .update({ enabled: false })
        .eq('endpoint', endpoint);
      return NextResponse.json({ ok: true });
    }

    await sb.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint,
        p256dh,
        auth,
        preferred_hour_utc: preferredHourUtc,
        enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' },
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('push/subscribe:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
