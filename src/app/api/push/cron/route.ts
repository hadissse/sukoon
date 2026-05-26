import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Configured lazily inside the handler so env vars are read at runtime, not build time.
function getWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  return webpush;
}

const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const currentHourUtc = now.getUTCHours();
  const todayUtc = now.toISOString().slice(0, 10);

  const sb = supabaseAdmin();
  const wp = getWebPush();

  const { data: subs, error } = await sb
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('preferred_hour_utc', currentHourUtc)
    .eq('enabled', true)
    .or(`last_sent.is.null,last_sent.lt.${todayUtc}`);

  if (error) {
    console.error('push/cron query:', error);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  const payload = JSON.stringify({
    title: 'سُكون',
    body: 'حان وقت لحظتك اليومية — ما الذي تحمله الآن؟',
    url: '/today',
  });

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    (subs ?? []).map(async (sub) => {
      try {
        await wp.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        await sb
          .from('push_subscriptions')
          .update({ last_sent: todayUtc })
          .eq('id', sub.id);
        sent++;
      } catch (err: unknown) {
        // 410 Gone = subscription expired/revoked, clean it up
        if ((err as { statusCode?: number }).statusCode === 410) {
          await sb.from('push_subscriptions').delete().eq('id', sub.id);
        }
        failed++;
      }
    }),
  );

  return NextResponse.json({ sent, failed, hour: currentHourUtc });
}
