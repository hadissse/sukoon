# Sukoon — Production Setup Checklist

Steps that require external dashboard access (cannot be done in code).

---

## 1. Generate VAPID Keys (once)

```bash
node scripts/generate-vapid-keys.mjs
```

Copy the 3 lines into `.env.local` and into Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

---

## 2. Supabase — Run the Migration

Open the Supabase dashboard → SQL Editor, paste and run:

```
supabase/migrations/20260526_missing_tables_and_push.sql
```

This creates: `quiz_answers`, `transit_feedback`, `user_preferences`, `sukoon_votes`, `push_subscriptions`. Also fixes the `calibrations` table schema.

---

## 3. Supabase — Service Role Key

Needed by the push notification API route (server-side only).

Supabase dashboard → Settings → API → `service_role` secret key.

Add to Vercel env vars as `SUPABASE_SERVICE_ROLE_KEY`.  
**Never expose this key to the client.**

---

## 4. Supabase — Enable Google OAuth

1. Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
2. Copy Client ID and Client Secret
3. Supabase dashboard → Authentication → Providers → Google → Enable → paste credentials
4. Add your Vercel production URL to the "Allowed redirect URLs" in Supabase Auth settings

---

## 5. Supabase — Enable Apple OAuth

1. Apple Developer Portal → Certificates, Identifiers & Profiles → Identifiers → add a Services ID
   - Enable "Sign in with Apple"
   - Return URL: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
2. Create a key with "Sign in with Apple" enabled, download the `.p8` file
3. Supabase dashboard → Authentication → Providers → Apple → Enable → fill in:
   - Service ID (from step 1)
   - Apple Team ID (from your Apple Developer account)
   - Key ID
   - Private Key (contents of the `.p8` file)

---

## 6. Supabase — Arabic Email Templates

Go to Supabase dashboard → Authentication → Email Templates.

### Confirm signup
**Subject:** تأكيد بريدك الإلكتروني — سُكون
**Body:**
```html
<div dir="rtl" style="font-family: serif; max-width: 480px; margin: auto; padding: 32px; color: #171B3A;">
  <h1 style="font-size: 24px; margin-bottom: 16px;">مرحبًا بك في سُكون</h1>
  <p style="line-height: 1.8; margin-bottom: 24px;">اضغط على الرابط أدناه لتأكيد بريدك الإلكتروني والدخول إلى التطبيق.</p>
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #E9785E; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;">تأكيد البريد الإلكتروني</a>
  <p style="margin-top: 24px; color: #5C5C7A; font-size: 13px;">إذا لم تطلب هذا، يمكنك تجاهل هذه الرسالة.</p>
</div>
```

### Reset password
**Subject:** إعادة تعيين كلمة المرور — سُكون
**Body:**
```html
<div dir="rtl" style="font-family: serif; max-width: 480px; margin: auto; padding: 32px; color: #171B3A;">
  <h1 style="font-size: 24px; margin-bottom: 16px;">إعادة تعيين كلمة المرور</h1>
  <p style="line-height: 1.8; margin-bottom: 24px;">اضغط على الرابط أدناه لإعادة تعيين كلمة مرورك. صالح لمدة ساعة واحدة.</p>
  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #E9785E; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;">إعادة تعيين كلمة المرور</a>
  <p style="margin-top: 24px; color: #5C5C7A; font-size: 13px;">إذا لم تطلب هذا، يمكنك تجاهل هذه الرسالة.</p>
</div>
```

---

## 7. Vercel — Environment Variables

In Vercel dashboard → your project → Settings → Environment Variables, add all variables from `.env.local.example`:

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (service_role) |
| `NEXT_PUBLIC_OPENCAGE_KEY` | opencagedata.com → your account |
| `NEXT_PUBLIC_CONSULTATION_URL` | Your booking link |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | From step 1 |
| `VAPID_PRIVATE_KEY` | From step 1 |
| `VAPID_SUBJECT` | `mailto:hadievet123@gmail.com` |
| `CRON_SECRET` | Any random string (e.g. `openssl rand -hex 32`) |

---

## 8. Vercel Cron

The `vercel.json` at the project root configures a cron job that runs `/api/push/cron` every hour. This is automatic on Vercel Pro. On Hobby, upgrade to Pro or use an external cron service (cron-job.org, etc.) to hit the endpoint hourly with:

```
Authorization: Bearer <your CRON_SECRET>
```

---

## Verification Checklist

- [ ] `node scripts/generate-vapid-keys.mjs` run, keys in Vercel env vars
- [ ] Migration SQL run in Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` in Vercel env vars
- [ ] Google OAuth enabled in Supabase, tested on mobile Chrome
- [ ] Apple OAuth enabled in Supabase, tested on iOS Safari
- [ ] Arabic email templates saved in Supabase
- [ ] All env vars confirmed in Vercel production deployment
- [ ] Push notification: enable in app settings, receive notification 1 hour later
- [ ] "Add to Home Screen" works on iOS Safari and Android Chrome
