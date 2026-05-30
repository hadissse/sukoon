import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions — سُكون',
};

export default function TermsPage() {
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
                ['#acceptance', '1. Acceptance of Terms'],
                ['#service', '2. Description of Service'],
                ['#account', '3. Your Account'],
                ['#content', '4. User Content'],
                ['#prohibited', '5. Prohibited Uses'],
                ['#disclaimer', '6. Disclaimer'],
                ['#liability', '7. Limitation of Liability'],
                ['#termination', '8. Termination'],
                ['#governing', '9. Governing Law'],
                ['#contact', '10. Contact'],
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
          <h1 className="font-serif text-4xl text-ink mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-ink-muted mb-8">Effective: January 1, 2026 · Last updated: May 30, 2026</p>

          <div className="text-ink leading-[1.8] space-y-8">

            <section id="acceptance">
              <h2 className="font-serif text-2xl text-ink mb-3">1. Acceptance of Terms</h2>
              <p className="text-ink-muted">
                By downloading, accessing, or using سُكون (the "App"), you agree to be bound by these Terms &amp; Conditions ("Terms"). If you do not agree to these Terms, do not use the App. These Terms constitute a legal agreement between you and Arabic Astrology Academy Inc. ("Company", "we", "us", or "our").
              </p>
            </section>

            <section id="service">
              <h2 className="font-serif text-2xl text-ink mb-3">2. Description of Service</h2>
              <p className="text-ink-muted">
                سُكون is an Arabic-first mobile web application that provides astrological charts, daily sky readings, personal guidance, and self-reflection tools. All astrological interpretations are for entertainment and personal growth purposes only. Nothing in the App constitutes professional advice of any kind, including medical, psychological, financial, or legal advice.
              </p>
            </section>

            <section id="account">
              <h2 className="font-serif text-2xl text-ink mb-3">3. Your Account</h2>
              <p className="text-ink-muted">
                You may use the App with a local account (data stored on-device) or by creating a cloud account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 13 years of age to use the App. We reserve the right to terminate accounts that violate these Terms.
              </p>
            </section>

            <section id="content">
              <h2 className="font-serif text-2xl text-ink mb-3">4. User Content</h2>
              <p className="text-ink-muted">
                Any content you create within the App — including journal entries, logged moments, and reflection notes — remains yours. By enabling cloud sync, you grant us a limited, non-exclusive licence to store and process your content solely to provide the Service. We do not claim ownership of your content.
              </p>
            </section>

            <section id="prohibited">
              <h2 className="font-serif text-2xl text-ink mb-3">5. Prohibited Uses</h2>
              <p className="text-ink-muted">You agree not to:</p>
              <ul className="list-disc list-inside text-ink-muted mt-2 space-y-1">
                <li>Use the App for any unlawful purpose or in violation of any regulations</li>
                <li>Attempt to gain unauthorised access to any part of the App or its servers</li>
                <li>Reverse engineer, decompile, or disassemble any part of the App</li>
                <li>Use automated means to scrape, crawl, or harvest data from the App</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
              </ul>
            </section>

            <section id="disclaimer">
              <h2 className="font-serif text-2xl text-ink mb-3">6. Disclaimer of Warranties</h2>
              <p className="text-ink-muted">
                The App is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the App will be error-free, uninterrupted, or free of viruses or other harmful components. Astrological content is for informational and entertainment purposes only.
              </p>
            </section>

            <section id="liability">
              <h2 className="font-serif text-2xl text-ink mb-3">7. Limitation of Liability</h2>
              <p className="text-ink-muted">
                To the fullest extent permitted by applicable law, Arabic Astrology Academy Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, resulting from your use of or inability to use the App.
              </p>
            </section>

            <section id="termination">
              <h2 className="font-serif text-2xl text-ink mb-3">8. Termination</h2>
              <p className="text-ink-muted">
                We may suspend or terminate your access to the App at any time, with or without cause, with or without notice. Upon termination, your right to use the App ceases immediately. You may delete your account at any time through the App settings.
              </p>
            </section>

            <section id="governing">
              <h2 className="font-serif text-2xl text-ink mb-3">9. Governing Law</h2>
              <p className="text-ink-muted">
                These Terms are governed by and construed in accordance with applicable law. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the competent courts. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force.
              </p>
            </section>

            <section id="contact">
              <h2 className="font-serif text-2xl text-ink mb-3">10. Contact</h2>
              <p className="text-ink-muted">
                For questions about these Terms, please contact us at:
              </p>
              <address className="not-italic mt-3 text-ink-muted">
                Arabic Astrology Academy Inc.<br />
                <a href="mailto:legal@arabic-astrology.com" className="text-coral hover:underline">legal@arabic-astrology.com</a>
              </address>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-rule-soft text-[12px] text-ink-muted flex flex-wrap gap-4 items-center justify-between">
            <span>© 2026 Arabic Astrology Academy Inc. All rights reserved.</span>
            <Link href="/privacy-policy" className="text-coral hover:underline">Privacy Policy →</Link>
          </div>
        </article>
      </div>
    </div>
  );
}
