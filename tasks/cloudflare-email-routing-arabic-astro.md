# Task: Configure Email Routing on arabic-astro.com

**Status:** Blocked — waiting on new API token with correct permissions

---

## What needs to be done

Configure Cloudflare Email Routing so that `info@arabic-astro.com` forwards to `hadievet123@gmail.com`.

### Steps (via Cloudflare REST API)
1. Enable Email Routing on the zone
2. Create routing rule: `info@arabic-astro.com` → `hadievet123@gmail.com`
3. Add MX records:
   - `route1.mx.cloudflare.net` (priority 86)
   - `route2.mx.cloudflare.net` (priority 31)
   - `route3.mx.cloudflare.net` (priority 10)
4. Add SPF TXT record: `v=spf1 include:_spf.mx.cloudflare.net ~all`

---

## Known credentials

| Field | Value |
|-------|-------|
| Account ID | `f16d998f3ee17a61f3168646c708bed8` |
| Zone ID | `fc8923f75c40f2a4dd9fdad4e9ef9914` |
| Domain | `arabic-astro.com` |
| Forward to | `hadievet123@gmail.com` |
| Old token (insufficient permissions) | `[REDACTED — rotate this token in Cloudflare dashboard]` |

---

## Blocker: New API token required

The existing token lacks Email Routing permissions. To unblock:

1. Go to **Cloudflare Dashboard → My Profile → API Tokens**
2. Click **Create Token**
3. Under Permissions, add:
   - `Zone` → `Email Routing Rules` → **Edit**
   - `Zone` → `Email Routing Addresses` → **Edit**
   - `Zone` → `DNS` → **Edit**
4. Under Zone Resources: `arabic-astro.com`
5. Save and paste the new token to Claude

---

## Additional note

The domain is currently in `initializing` state — nameservers at GoDaddy still point to Vercel (`ns1.vercel-dns.com`). Email Routing won't flow until the domain is pointed to Cloudflare:
- `izabella.ns.cloudflare.com`
- `quentin.ns.cloudflare.com`

API setup can be done before the nameserver switch, but emails won't route until DNS propagates.
