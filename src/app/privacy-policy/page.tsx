import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — سُكون',
};

const TOC = [
  ['#controller',    '1. Who We Are'],
  ['#collect',       '2. Data We Collect'],
  ['#legal-basis',   '3. Legal Basis (GDPR)'],
  ['#use',           '4. How We Use Your Data'],
  ['#providers',     '5. Third-Party Processors'],
  ['#sharing',       '6. Data Sharing'],
  ['#transfers',     '7. International Transfers'],
  ['#retention',     '8. Retention & Deletion'],
  ['#security',      '9. Security'],
  ['#rights',        '10. Your Rights'],
  ['#children',      '11. Children\'s Privacy'],
  ['#cookies',       '12. Cookies & Local Storage'],
  ['#sensitive',     '13. Sensitive Data'],
  ['#changes',       '14. Policy Changes'],
  ['#contact',       '15. Contact & DPO'],
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-cream text-ink" dir="ltr">
      {/* Top bar */}
      <div className="border-b border-rule-soft bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/settings" className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
          <span className="font-serif text-base text-ink">سُكون</span>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 flex gap-10">
        {/* TOC sidebar */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-4">Contents</p>
            <nav className="flex flex-col gap-2">
              {TOC.map(([href, label]) => (
                <a key={href} href={href} className="text-[13px] text-ink-muted hover:text-coral transition-colors leading-snug">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 min-w-0">
          <h1 className="font-serif text-4xl text-ink mb-2">Privacy Policy</h1>
          <p className="text-sm text-ink-muted mb-10">
            Effective: 1 January 2026 · Last updated: 30 May 2026
          </p>

          <p className="text-ink-muted leading-[1.85] mb-10">
            Arabic Astrology Academy Inc. ("we", "us", "our") operates <strong>سُكون</strong>, accessible
            at <span className="font-mono text-sm">sukoon.arabic-astro.com</span>. This Privacy Policy
            explains what personal data we collect, why we collect it, how we use and protect it, and
            the rights you have over your data. Please read this policy carefully before using the App.
          </p>

          <div className="text-ink leading-[1.85] space-y-10">

            <section id="controller">
              <h2 className="font-serif text-2xl text-ink mb-3">1. Who We Are</h2>
              <p className="text-ink-muted">
                The data controller responsible for your personal data is:
              </p>
              <address className="not-italic mt-4 text-ink-muted space-y-1 bg-white rounded-[14px] p-5 border border-rule-soft">
                <div><strong className="text-ink">Arabic Astrology Academy Inc.</strong></div>
                <div>Website: <span className="font-mono text-sm">arabic-astro.com</span></div>
                <div>App: <span className="font-mono text-sm">sukoon.arabic-astro.com</span></div>
                <div>Email: <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a></div>
              </address>
            </section>

            <section id="collect">
              <h2 className="font-serif text-2xl text-ink mb-3">2. Data We Collect</h2>

              <h3 className="font-semibold text-ink mt-4 mb-2">2a. Data You Provide Directly</h3>
              <ul className="list-disc list-inside text-ink-muted space-y-2">
                <li><strong>Identity data:</strong> Full name (optional), display name</li>
                <li><strong>Contact data:</strong> Email address (required for cloud accounts)</li>
                <li><strong>Birth data:</strong> Date of birth, time of birth, place of birth — used to calculate your natal astrological chart</li>
                <li><strong>User-generated content:</strong> Journal entries, logged moments, evening reflections, and notes you write inside the App</li>
                <li><strong>Authentication data:</strong> Hashed password (email sign-up) or OAuth tokens (Google sign-in); we never store plaintext passwords</li>
              </ul>

              <h3 className="font-semibold text-ink mt-5 mb-2">2b. Data Collected Automatically</h3>
              <ul className="list-disc list-inside text-ink-muted space-y-2">
                <li><strong>Usage data:</strong> Pages visited, features used, tap/click interactions, session duration</li>
                <li><strong>Device data:</strong> Browser type and version, operating system, device type, screen resolution, language setting</li>
                <li><strong>Connection data:</strong> IP address, approximate geographic region (country/city level), referring URL</li>
                <li><strong>Log data:</strong> Error logs, performance metrics, timestamps of actions</li>
              </ul>

              <h3 className="font-semibold text-ink mt-5 mb-2">2c. Data from Third Parties</h3>
              <ul className="list-disc list-inside text-ink-muted space-y-2">
                <li><strong>Google OAuth:</strong> If you sign in with Google, we receive your Google account email address, display name, and profile picture URL</li>
                <li><strong>OpenCage Geocoder:</strong> Your birth location text is sent to OpenCage to obtain geographic coordinates (latitude/longitude) for chart calculations; no additional data is retained by us from this service</li>
                <li><strong>hCaptcha:</strong> Browser fingerprint signals used for bot-detection during account registration; governed by hCaptcha's own Privacy Policy</li>
              </ul>
            </section>

            <section id="legal-basis">
              <h2 className="font-serif text-2xl text-ink mb-3">3. Legal Basis for Processing (GDPR)</h2>
              <p className="text-ink-muted">
                If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland,
                we process your personal data on the following legal bases under the General Data
                Protection Regulation (GDPR):
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-2">
                <li><strong>Contract performance (Art. 6(1)(b)):</strong> Processing necessary to provide the astrological chart, cloud sync, and account services you requested</li>
                <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> Analytics to improve the App, security monitoring, and fraud prevention — where these interests are not overridden by your rights</li>
                <li><strong>Legal obligation (Art. 6(1)(c)):</strong> Compliance with applicable laws</li>
                <li><strong>Consent (Art. 6(1)(a)):</strong> Where we ask for your explicit consent, such as optional analytics or marketing communications; you may withdraw consent at any time</li>
              </ul>
              <p className="text-ink-muted mt-3">
                For birth data (which may constitute sensitive data in certain jurisdictions), our
                processing is based on your explicit consent and the necessity of processing it to
                deliver the core astrological service you requested.
              </p>
            </section>

            <section id="use">
              <h2 className="font-serif text-2xl text-ink mb-3">4. How We Use Your Data</h2>
              <p className="text-ink-muted">We use the data we collect to:</p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-2">
                <li>Calculate and display your natal astrological chart, planetary transits, and daily sky readings</li>
                <li>Generate personalised astrological interpretations, biographical timelines, and body-organ correspondences based on your chart</li>
                <li>Synchronise your data across devices when you enable cloud sync</li>
                <li>Authenticate your identity and maintain the security of your account</li>
                <li>Provide customer support and respond to your enquiries</li>
                <li>Send transactional emails (account verification, password reset, security alerts)</li>
                <li>Monitor and improve App performance, fix bugs, and develop new features</li>
                <li>Detect and prevent fraud, abuse, and violations of our Terms &amp; Conditions</li>
                <li>Comply with applicable legal and regulatory obligations</li>
              </ul>
              <p className="text-ink-muted mt-3">
                We do <strong>not</strong> use your personal data for behavioural advertising,
                profiling for credit decisions, or automated decision-making that produces legal
                or similarly significant effects on you.
              </p>
            </section>

            <section id="providers">
              <h2 className="font-serif text-2xl text-ink mb-3">5. Third-Party Data Processors</h2>
              <p className="text-ink-muted">
                We engage the following third-party processors under data processing agreements
                ("DPAs"). They may only process your data on our documented instructions.
              </p>
              <div className="mt-4 space-y-4">
                {[
                  {
                    name: 'Supabase, Inc.',
                    role: 'Cloud database, authentication, and storage',
                    data: 'Email, hashed password, birth data, journal entries, chart data',
                    region: 'Asia-Pacific (Tokyo, Japan — ap-northeast-1)',
                    link: 'https://supabase.com/privacy',
                  },
                  {
                    name: 'Google LLC',
                    role: 'OAuth sign-in',
                    data: 'Email address, display name, profile picture URL (only if Google sign-in is used)',
                    region: 'United States',
                    link: 'https://policies.google.com/privacy',
                  },
                  {
                    name: 'Cloudflare, Inc.',
                    role: 'Web hosting, CDN, DDoS protection, and edge computing',
                    data: 'IP address, request headers, connection data',
                    region: 'Global edge network',
                    link: 'https://www.cloudflare.com/privacypolicy/',
                  },
                  {
                    name: 'Intuition Machines, Inc. (hCaptcha)',
                    role: 'Bot-detection on account registration',
                    data: 'Browser fingerprint signals during signup',
                    region: 'United States',
                    link: 'https://www.hcaptcha.com/privacy',
                  },
                  {
                    name: 'OpenCage GmbH',
                    role: 'Geocoding of birth location for chart calculation',
                    data: 'Birth city/country text',
                    region: 'Germany (EU)',
                    link: 'https://opencagedata.com/privacy',
                  },
                ].map((p) => (
                  <div key={p.name} className="bg-white rounded-[14px] p-4 border border-rule-soft">
                    <div className="font-semibold text-ink text-sm">{p.name}</div>
                    <div className="text-[13px] text-ink-muted mt-1"><strong>Role:</strong> {p.role}</div>
                    <div className="text-[13px] text-ink-muted mt-0.5"><strong>Data shared:</strong> {p.data}</div>
                    <div className="text-[13px] text-ink-muted mt-0.5"><strong>Region:</strong> {p.region}</div>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[12px] text-coral hover:underline mt-1 inline-block">Privacy policy ↗</a>
                  </div>
                ))}
              </div>
            </section>

            <section id="sharing">
              <h2 className="font-serif text-2xl text-ink mb-3">6. Data Sharing</h2>
              <p className="text-ink-muted">
                <strong>We do not sell your personal data.</strong> We do not share your personal data
                with third parties for their own marketing purposes. We may share your data only in
                the following limited circumstances:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-2">
                <li><strong>Service providers:</strong> As described in Section 5 above, under strict DPAs</li>
                <li><strong>Legal requirements:</strong> Where required by law, regulation, court order, or governmental authority</li>
                <li><strong>Safety:</strong> To protect the rights, property, or safety of our users, the public, or the Company</li>
                <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of all or a portion of our assets, in which case user data may be transferred as part of the transaction; you will be notified via email or prominent notice in the App before your data is transferred and becomes subject to a different privacy policy</li>
              </ul>
            </section>

            <section id="transfers">
              <h2 className="font-serif text-2xl text-ink mb-3">7. International Data Transfers</h2>
              <p className="text-ink-muted">
                Your data is primarily stored on Supabase servers located in Tokyo, Japan
                (ap-northeast-1). Cloudflare's global edge network may process request metadata
                in various countries. Google may process OAuth data in the United States.
              </p>
              <p className="text-ink-muted mt-3">
                Where we transfer personal data outside the EEA or UK, we ensure appropriate
                safeguards are in place, such as Standard Contractual Clauses (SCCs) approved
                by the European Commission, adequacy decisions, or other lawful transfer mechanisms.
                You may request a copy of the applicable safeguards by contacting us at{' '}
                <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a>.
              </p>
            </section>

            <section id="retention">
              <h2 className="font-serif text-2xl text-ink mb-3">8. Data Retention &amp; Deletion</h2>
              <p className="text-ink-muted">
                We retain your personal data for as long as your account is active or as necessary
                to provide the Service. Specific retention periods:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-2">
                <li><strong>Account data</strong> (email, name): Retained while your account is active; deleted within <strong>30 days</strong> of account deletion request</li>
                <li><strong>Birth data and chart data:</strong> Retained for the life of your account; deleted within 30 days of account deletion</li>
                <li><strong>Journal entries and logged moments:</strong> Retained until you delete them manually or delete your account</li>
                <li><strong>Usage logs and analytics:</strong> Aggregated and anonymised after <strong>90 days</strong>; raw logs deleted after <strong>12 months</strong></li>
                <li><strong>Local data:</strong> Stored on your device; persists until you clear your browser storage or uninstall the App</li>
              </ul>
              <p className="text-ink-muted mt-3">
                To delete your account and all associated cloud data, go to{' '}
                <strong>Settings → Data → Delete Account</strong>, or email us at{' '}
                <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a>.
                We will confirm deletion within 30 days.
              </p>
            </section>

            <section id="security">
              <h2 className="font-serif text-2xl text-ink mb-3">9. Security</h2>
              <p className="text-ink-muted">
                We implement industry-standard technical and organisational measures to protect
                your personal data, including:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-2">
                <li><strong>Encryption in transit:</strong> All data is transmitted over HTTPS/TLS 1.3</li>
                <li><strong>Encryption at rest:</strong> Data stored in Supabase is encrypted at rest using AES-256</li>
                <li><strong>Authentication security:</strong> Passwords are hashed using bcrypt; we support OAuth to reduce password exposure</li>
                <li><strong>CAPTCHA protection:</strong> hCaptcha on account registration to prevent automated abuse</li>
                <li><strong>Access control:</strong> Row-level security (RLS) policies ensure users can only access their own data</li>
                <li><strong>DDoS protection:</strong> Cloudflare provides network-level protection against denial-of-service attacks</li>
              </ul>
              <p className="text-ink-muted mt-3">
                Despite these measures, no method of internet transmission or electronic storage
                is 100% secure. In the event of a data breach that is likely to result in a risk
                to your rights and freedoms, we will notify affected users and relevant authorities
                as required by applicable law within 72 hours of becoming aware of the breach.
              </p>
            </section>

            <section id="rights">
              <h2 className="font-serif text-2xl text-ink mb-3">10. Your Privacy Rights</h2>
              <p className="text-ink-muted">
                Depending on your location, you may have the following rights regarding your
                personal data. To exercise any of these rights, contact us at{' '}
                <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a>.
                We will respond within <strong>30 days</strong> (or sooner as required by law).
              </p>

              <h3 className="font-semibold text-ink mt-4 mb-2">Rights under GDPR (EEA / UK / Switzerland)</h3>
              <ul className="list-disc list-inside text-ink-muted space-y-2">
                <li><strong>Right of access (Art. 15):</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Right to rectification (Art. 16):</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to erasure (Art. 17):</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Right to restriction (Art. 18):</strong> Request that we restrict processing of your data in certain circumstances</li>
                <li><strong>Right to data portability (Art. 20):</strong> Receive your data in a structured, machine-readable format (JSON)</li>
                <li><strong>Right to object (Art. 21):</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to withdraw consent:</strong> Where processing is based on consent, withdraw it at any time without affecting the lawfulness of prior processing</li>
                <li><strong>Right to lodge a complaint:</strong> File a complaint with your local supervisory authority (e.g., your national Data Protection Authority)</li>
              </ul>

              <h3 className="font-semibold text-ink mt-5 mb-2">Rights under CCPA (California Residents)</h3>
              <ul className="list-disc list-inside text-ink-muted space-y-2">
                <li>Right to know what personal information is collected, used, shared, or sold</li>
                <li>Right to delete personal information (subject to certain exceptions)</li>
                <li>Right to opt out of the sale of personal information — <strong>we do not sell personal information</strong></li>
                <li>Right to non-discrimination for exercising your CCPA rights</li>
              </ul>
            </section>

            <section id="children">
              <h2 className="font-serif text-2xl text-ink mb-3">11. Children's Privacy</h2>
              <p className="text-ink-muted">
                The App is not directed to children under the age of 13. We do not knowingly
                collect personal data from children under 13. If you believe we have inadvertently
                collected information from a child under 13, please contact us immediately at{' '}
                <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a>{' '}
                and we will promptly delete the data.
              </p>
              <p className="text-ink-muted mt-3">
                Users aged 13–17 should obtain parental or guardian consent before creating an
                account or providing personal data.
              </p>
            </section>

            <section id="cookies">
              <h2 className="font-serif text-2xl text-ink mb-3">12. Cookies &amp; Local Storage</h2>
              <p className="text-ink-muted">
                سُكون uses <strong>browser local storage</strong> (not cookies) as its primary
                client-side persistence mechanism. Local storage is used to save:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-1">
                <li>Your natal chart data and birth details (locally computed)</li>
                <li>App preferences and UI state (e.g., tab positions, onboarding status)</li>
                <li>Journal entries and logged moments (until cloud sync is enabled)</li>
                <li>Session authentication tokens (when signed in)</li>
              </ul>
              <p className="text-ink-muted mt-3">
                We may set <strong>session cookies</strong> for authentication purposes via Supabase.
                We do not use <strong>third-party advertising cookies</strong> or cross-site tracking
                cookies. Cloudflare may set a security cookie (<span className="font-mono text-sm">__cf_bm</span>) for
                bot-detection purposes; this is strictly functional.
              </p>
              <p className="text-ink-muted mt-3">
                You can clear local storage at any time through your browser settings. Note that
                doing so will delete locally stored chart data unless you have cloud sync enabled.
              </p>
            </section>

            <section id="sensitive">
              <h2 className="font-serif text-2xl text-ink mb-3">13. Sensitive Data</h2>
              <p className="text-ink-muted">
                <strong>Birth data</strong> (date, time, and place of birth) is treated as sensitive
                personal data. It is used exclusively to calculate and display astrological charts
                and is not shared with third parties for any marketing or profiling purpose.
              </p>
              <p className="text-ink-muted mt-3">
                The App's medical astrology and body-organ features provide <strong>interpretive
                content for personal reflection only</strong> and do not constitute health data
                within the meaning of Art. 9 GDPR or equivalent legislation. We do not store or
                infer actual medical diagnoses or health conditions.
              </p>
            </section>

            <section id="changes">
              <h2 className="font-serif text-2xl text-ink mb-3">14. Changes to This Policy</h2>
              <p className="text-ink-muted">
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, legal requirements, or other factors. We will notify you
                of material changes by:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-3 space-y-1">
                <li>Posting the updated policy in the App with a revised "Last updated" date</li>
                <li>Sending an email notification to registered users at least 7 days before material changes take effect</li>
              </ul>
              <p className="text-ink-muted mt-3">
                Your continued use of the App after the effective date of any changes constitutes
                your acceptance of the updated policy.
              </p>
            </section>

            <section id="contact">
              <h2 className="font-serif text-2xl text-ink mb-3">15. Contact &amp; Data Protection</h2>
              <p className="text-ink-muted">
                For any questions, requests, or concerns about this Privacy Policy or your personal
                data, please contact us:
              </p>
              <address className="not-italic mt-4 text-ink-muted space-y-1 bg-white rounded-[14px] p-5 border border-rule-soft">
                <div><strong className="text-ink">Arabic Astrology Academy Inc.</strong></div>
                <div>Data Controller</div>
                <div className="mt-2">Email: <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a></div>
                <div>Subject line: <span className="font-mono text-sm">Privacy Request — سُكون</span></div>
              </address>
              <p className="text-ink-muted mt-4">
                We aim to respond to all privacy requests within <strong>30 days</strong>. If you
                are not satisfied with our response, you have the right to lodge a complaint with
                your local data protection authority.
              </p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-rule-soft text-[12px] text-ink-muted flex flex-wrap gap-4 items-center justify-between">
            <span>© 2026 Arabic Astrology Academy Inc. All rights reserved.</span>
            <Link href="/terms-and-conditions" className="text-coral hover:underline">Terms &amp; Conditions →</Link>
          </div>
        </article>
      </div>
    </div>
  );
}
