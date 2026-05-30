import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — سُكون',
};

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
            <p className="text-[11px] font-semibold text-ink-muted tracking-wider uppercase mb-4">Table of Contents</p>
            <nav className="flex flex-col gap-2">
              {[
                ['#information', '1. Information We Collect'],
                ['#use', '2. How We Use It'],
                ['#sharing', '3. Sharing'],
                ['#retention', '4. Data Retention'],
                ['#rights', '5. Your Rights'],
                ['#security', '6. Security'],
                ['#cookies', '7. Cookies'],
                ['#changes', '8. Changes'],
                ['#contact', '9. Contact Us'],
              ].map(([href, label]) => (
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
          <p className="text-sm text-ink-muted mb-8">Effective: January 1, 2026 · Last updated: May 30, 2026</p>

          <div className="prose prose-sm max-w-none text-ink leading-[1.8] space-y-8">

            <section id="information">
              <h2 className="font-serif text-2xl text-ink mb-3">1. Information We Collect</h2>
              <p className="text-ink-muted">
                Arabic Astrology Academy Inc. ("we", "our", or "us") operates سُكون. We collect information you provide directly — including your name, email address, birth date, birth time, birth location, and any journal entries or logged moments you create within the app.
              </p>
              <p className="text-ink-muted mt-3">
                We also collect certain information automatically, such as device type, operating system, approximate location (country/region), and usage patterns within the app. This helps us understand how the app is used and improve the experience.
              </p>
            </section>

            <section id="use">
              <h2 className="font-serif text-2xl text-ink mb-3">2. How We Use It</h2>
              <p className="text-ink-muted">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-ink-muted mt-2 space-y-1">
                <li>Generate and display your natal chart and astrological readings</li>
                <li>Provide personalized daily guidance, transit notifications, and reflections</li>
                <li>Sync your data across devices when cloud sync is enabled</li>
                <li>Improve and develop new features</li>
                <li>Communicate service updates and security notices</li>
                <li>Comply with our legal obligations</li>
              </ul>
            </section>

            <section id="sharing">
              <h2 className="font-serif text-2xl text-ink mb-3">3. Sharing of Information</h2>
              <p className="text-ink-muted">
                We do not sell your personal data. We may share information with trusted third-party service providers who assist us in operating the app (e.g., cloud storage, analytics), subject to strict data processing agreements. We may also disclose information when required by law or to protect our legal rights.
              </p>
            </section>

            <section id="retention">
              <h2 className="font-serif text-2xl text-ink mb-3">4. Data Security and Retention</h2>
              <p className="text-ink-muted">
                Your data is stored locally on your device by default. When cloud sync is enabled, data is encrypted in transit and at rest on our servers (Supabase). We retain your account data for as long as your account is active, or as needed to provide services. You may request deletion at any time through the app settings.
              </p>
            </section>

            <section id="rights">
              <h2 className="font-serif text-2xl text-ink mb-3">5. Your Privacy Rights</h2>
              <p className="text-ink-muted">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside text-ink-muted mt-2 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal data ("right to be forgotten")</li>
                <li>Object to or restrict how we process your data</li>
                <li>Data portability — receive your data in a machine-readable format</li>
              </ul>
              <p className="text-ink-muted mt-3">
                To exercise any of these rights, contact us at <a href="mailto:privacy@arabic-astrology.com" className="text-coral hover:underline">privacy@arabic-astrology.com</a>.
              </p>
            </section>

            <section id="security">
              <h2 className="font-serif text-2xl text-ink mb-3">6. Security</h2>
              <p className="text-ink-muted">
                We implement industry-standard security measures including TLS encryption, hashed passwords, and access controls. No method of transmission over the internet is 100% secure, however, and we cannot guarantee absolute security.
              </p>
            </section>

            <section id="cookies">
              <h2 className="font-serif text-2xl text-ink mb-3">7. Cookies &amp; Local Storage</h2>
              <p className="text-ink-muted">
                سُكون uses browser local storage to save your preferences, chart data, and session state. We do not use third-party advertising cookies. Analytics cookies, if used, are strictly functional and anonymised.
              </p>
            </section>

            <section id="changes">
              <h2 className="font-serif text-2xl text-ink mb-3">8. Changes to This Policy</h2>
              <p className="text-ink-muted">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy in the app and updating the "Last updated" date above. Continued use of the app after changes constitutes your acceptance.
              </p>
            </section>

            <section id="contact">
              <h2 className="font-serif text-2xl text-ink mb-3">9. Contact Us</h2>
              <p className="text-ink-muted">
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <address className="not-italic mt-3 text-ink-muted">
                Arabic Astrology Academy Inc.<br />
                <a href="mailto:privacy@arabic-astrology.com" className="text-coral hover:underline">privacy@arabic-astrology.com</a>
              </address>
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
