import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions — سُكون',
};

const TOC = [
  ['#acceptance',    '1. Acceptance of Terms'],
  ['#eligibility',   '2. Eligibility'],
  ['#service',       '3. Description of Service'],
  ['#account',       '4. Account Registration'],
  ['#content',       '5. User Content'],
  ['#ip',            '6. Intellectual Property'],
  ['#prohibited',    '7. Prohibited Uses'],
  ['#third-party',   '8. Third-Party Services'],
  ['#disclaimer',    '9. Disclaimer of Warranties'],
  ['#liability',     '10. Limitation of Liability'],
  ['#indemnification','11. Indemnification'],
  ['#termination',   '12. Termination'],
  ['#changes',       '13. Changes to These Terms'],
  ['#governing',     '14. Governing Law'],
  ['#dispute',       '15. Dispute Resolution'],
  ['#contact',       '16. Contact'],
];

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
          <h1 className="font-serif text-4xl text-ink mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-ink-muted mb-10">
            Effective: 1 January 2026 · Last updated: 30 May 2026
          </p>

          <div className="text-ink leading-[1.85] space-y-10">

            <section id="acceptance">
              <h2 className="font-serif text-2xl text-ink mb-3">1. Acceptance of Terms</h2>
              <p className="text-ink-muted">
                By accessing, downloading, or using <strong>سُكون</strong> (the "App") — available at{' '}
                <span className="font-mono text-sm">sukoon.arabic-astro.com</span> — you agree to be bound by
                these Terms &amp; Conditions ("Terms"). These Terms form a legally binding agreement between you
                and <strong>Arabic Astrology Academy Inc.</strong> ("Company", "we", "us", or "our").
              </p>
              <p className="text-ink-muted mt-3">
                If you do not agree to these Terms in their entirety, you must immediately stop using the App.
                Your continued use of the App following any modification to these Terms constitutes your
                acceptance of the modified Terms.
              </p>
            </section>

            <section id="eligibility">
              <h2 className="font-serif text-2xl text-ink mb-3">2. Eligibility</h2>
              <p className="text-ink-muted">
                You must be at least <strong>13 years of age</strong> to use the App. If you are under 18,
                you represent that a parent or legal guardian has reviewed and agreed to these Terms on your
                behalf. We do not knowingly collect personal information from children under the age of 13. If
                we become aware that a user is under 13, we will promptly delete their account and associated
                data.
              </p>
              <p className="text-ink-muted mt-3">
                By using the App, you represent and warrant that you have the legal capacity to enter into
                this agreement and that all information you provide is accurate and truthful.
              </p>
            </section>

            <section id="service">
              <h2 className="font-serif text-2xl text-ink mb-3">3. Description of Service</h2>
              <p className="text-ink-muted">
                سُكون is an Arabic-first mobile web application offering natal astrology charts, daily sky
                readings, planetary transit tracking, personal reflection tools, and educational content rooted
                in Western, Arabic, and spiritual astrological traditions.
              </p>
              <p className="text-ink-muted mt-3">
                <strong>Important Notice:</strong> All astrological content — including planetary readings,
                transit interpretations, biographical timelines, body-organ correspondences, and house
                analyses — is provided <strong>for entertainment, personal growth, and educational
                purposes only</strong>. Nothing in the App constitutes professional advice of any kind,
                including but not limited to medical, psychological, psychiatric, financial, nutritional,
                or legal advice. You should always consult a qualified professional before making decisions
                about your health, finances, or legal matters.
              </p>
              <p className="text-ink-muted mt-3">
                We reserve the right to modify, suspend, or discontinue any part of the App at any time
                without prior notice or liability.
              </p>
            </section>

            <section id="account">
              <h2 className="font-serif text-2xl text-ink mb-3">4. Account Registration</h2>
              <p className="text-ink-muted">
                You may use core App features locally without an account (data stored on your device). To
                enable cloud synchronisation and access your data across multiple devices, you must create
                an account using a valid email address and password, or authenticate via a supported
                third-party provider (Google).
              </p>
              <p className="text-ink-muted mt-3">
                You are solely responsible for:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-2 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activity that occurs under your account, whether or not authorised by you</li>
                <li>Notifying us immediately at <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a> if you suspect unauthorised access</li>
              </ul>
              <p className="text-ink-muted mt-3">
                You may not share your account with others or create accounts using automated means. We
                reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section id="content">
              <h2 className="font-serif text-2xl text-ink mb-3">5. User Content</h2>
              <p className="text-ink-muted">
                Any content you create within the App — including journal entries, logged moments, evening
                reflections, and notes — remains your intellectual property. By enabling cloud synchronisation,
                you grant Arabic Astrology Academy Inc. a limited, non-exclusive, worldwide, royalty-free
                licence to store, reproduce, and process your content solely to the extent necessary to
                provide the Service. This licence terminates when you delete the relevant content or close
                your account.
              </p>
              <p className="text-ink-muted mt-3">
                You warrant that any content you submit does not infringe the intellectual property,
                privacy, or other rights of any third party, and does not contain unlawful, harmful,
                or offensive material.
              </p>
            </section>

            <section id="ip">
              <h2 className="font-serif text-2xl text-ink mb-3">6. Intellectual Property</h2>
              <p className="text-ink-muted">
                All App content that is not User Content — including but not limited to astrological
                interpretations, educational text, software code, design, graphics, icons, animations,
                and the سُكون name and logo — is the exclusive property of Arabic Astrology Academy Inc.
                or its licensors, and is protected by copyright, trademark, and other applicable
                intellectual property laws.
              </p>
              <p className="text-ink-muted mt-3">
                You are granted a limited, non-exclusive, non-transferable, revocable licence to access
                and use the App for your personal, non-commercial purposes. You may not copy, reproduce,
                distribute, publish, modify, create derivative works from, or commercially exploit any
                part of the App without our prior written consent.
              </p>
            </section>

            <section id="prohibited">
              <h2 className="font-serif text-2xl text-ink mb-3">7. Prohibited Uses</h2>
              <p className="text-ink-muted">You agree not to:</p>
              <ul className="list-disc list-inside text-ink-muted mt-2 space-y-2">
                <li>Use the App for any unlawful purpose or in violation of any applicable local, national, or international law or regulation</li>
                <li>Attempt to gain unauthorised access to any server, database, or account associated with the App</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the App</li>
                <li>Use automated tools (bots, scrapers, crawlers) to access, extract, or harvest data from the App</li>
                <li>Transmit any viruses, malware, or other harmful code through the App</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
                <li>Use the App to harass, defame, or harm any individual</li>
                <li>Interfere with or disrupt the integrity or performance of the App or its infrastructure</li>
                <li>Circumvent any security or access-control mechanism of the App</li>
                <li>Resell, sublicence, or otherwise commercialise access to the App without our prior written consent</li>
              </ul>
            </section>

            <section id="third-party">
              <h2 className="font-serif text-2xl text-ink mb-3">8. Third-Party Services</h2>
              <p className="text-ink-muted">
                The App integrates with the following third-party services, each governed by their own
                terms and privacy policies:
              </p>
              <ul className="list-disc list-inside text-ink-muted mt-2 space-y-2">
                <li><strong>Supabase</strong> — cloud database and authentication infrastructure</li>
                <li><strong>Google OAuth</strong> — optional sign-in via Google account</li>
                <li><strong>hCaptcha</strong> — bot-detection and fraud prevention on account registration</li>
                <li><strong>Cloudflare</strong> — hosting, CDN, and DDoS protection</li>
                <li><strong>OpenCage</strong> — geocoding of birth location data for chart calculations</li>
              </ul>
              <p className="text-ink-muted mt-3">
                We are not responsible for the content, privacy practices, or availability of third-party
                services. Your use of those services is at your own risk and subject to their respective
                terms.
              </p>
            </section>

            <section id="disclaimer">
              <h2 className="font-serif text-2xl text-ink mb-3">9. Disclaimer of Warranties</h2>
              <p className="text-ink-muted">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE APP IS PROVIDED "AS IS" AND
                "AS AVAILABLE", WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                NON-INFRINGEMENT, ACCURACY, OR UNINTERRUPTED ACCESS.
              </p>
              <p className="text-ink-muted mt-3">
                We do not warrant that: (a) the App will be error-free or uninterrupted; (b) any defects
                will be corrected; (c) the App or the servers that make it available are free of viruses
                or other harmful components; or (d) astrological interpretations are accurate, complete,
                or applicable to your specific circumstances.
              </p>
            </section>

            <section id="liability">
              <h2 className="font-serif text-2xl text-ink mb-3">10. Limitation of Liability</h2>
              <p className="text-ink-muted">
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ARABIC ASTROLOGY ACADEMY INC. AND
                ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES —
                INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, HEALTH OUTCOMES,
                OR OTHER INTANGIBLE LOSSES — ARISING FROM OR RELATING TO YOUR USE OF, OR INABILITY
                TO USE, THE APP, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-ink-muted mt-3">
                OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATED TO
                THESE TERMS OR THE APP SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US
                IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) USD 50.
              </p>
              <p className="text-ink-muted mt-3">
                Some jurisdictions do not allow the exclusion or limitation of liability for certain
                types of damages, so the above limitations may not apply to you to the extent
                prohibited by law.
              </p>
            </section>

            <section id="indemnification">
              <h2 className="font-serif text-2xl text-ink mb-3">11. Indemnification</h2>
              <p className="text-ink-muted">
                You agree to indemnify, defend, and hold harmless Arabic Astrology Academy Inc. and its
                officers, directors, employees, agents, and licensors from and against any claims,
                liabilities, damages, losses, costs, and expenses (including reasonable legal fees)
                arising from: (a) your use of the App; (b) your violation of these Terms; (c) your
                violation of any third-party rights; or (d) any content you submit or transmit
                through the App.
              </p>
            </section>

            <section id="termination">
              <h2 className="font-serif text-2xl text-ink mb-3">12. Termination</h2>
              <p className="text-ink-muted">
                We may suspend or permanently terminate your access to the App at any time, with or
                without cause, and with or without notice, if we reasonably believe you have violated
                these Terms or if required by law.
              </p>
              <p className="text-ink-muted mt-3">
                You may delete your account at any time through <strong>Settings → Account → Delete
                Account</strong>. Upon deletion, your cloud-stored data will be permanently removed
                within 30 days, subject to any legal retention requirements. Locally stored data
                remains on your device until you clear it manually.
              </p>
              <p className="text-ink-muted mt-3">
                Sections 5, 6, 9, 10, 11, and 14 of these Terms shall survive termination.
              </p>
            </section>

            <section id="changes">
              <h2 className="font-serif text-2xl text-ink mb-3">13. Changes to These Terms</h2>
              <p className="text-ink-muted">
                We reserve the right to modify these Terms at any time. We will notify you of material
                changes by posting the updated Terms in the App and updating the "Last updated" date
                above. For registered users, we will also send an email notification to the address
                on file. Your continued use of the App after the effective date of any changes
                constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section id="governing">
              <h2 className="font-serif text-2xl text-ink mb-3">14. Governing Law</h2>
              <p className="text-ink-muted">
                These Terms are governed by and construed in accordance with the laws applicable to
                Arabic Astrology Academy Inc., without regard to conflict-of-law principles. The United
                Nations Convention on Contracts for the International Sale of Goods does not apply.
              </p>
              <p className="text-ink-muted mt-3">
                If any provision of these Terms is found by a court of competent jurisdiction to be
                invalid or unenforceable, that provision shall be modified to the minimum extent
                necessary to make it enforceable, and the remaining provisions shall continue in full
                force and effect.
              </p>
            </section>

            <section id="dispute">
              <h2 className="font-serif text-2xl text-ink mb-3">15. Dispute Resolution</h2>
              <p className="text-ink-muted">
                Before initiating any formal legal proceeding, you agree to contact us at{' '}
                <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a>{' '}
                and make a good-faith effort to resolve the dispute informally within 30 days.
              </p>
              <p className="text-ink-muted mt-3">
                If informal resolution fails, any dispute, claim, or controversy arising out of or
                relating to these Terms or the App shall be submitted to binding arbitration or
                resolved by the competent courts in the jurisdiction applicable to the Company,
                as determined by applicable law. You waive any right to a jury trial in connection
                with any action or litigation relating to these Terms.
              </p>
            </section>

            <section id="contact">
              <h2 className="font-serif text-2xl text-ink mb-3">16. Contact</h2>
              <p className="text-ink-muted">
                For questions, concerns, or notices regarding these Terms, please contact us:
              </p>
              <address className="not-italic mt-4 text-ink-muted space-y-1">
                <div><strong className="text-ink">Arabic Astrology Academy Inc.</strong></div>
                <div>App: <span className="font-mono text-sm">sukoon.arabic-astro.com</span></div>
                <div>Email: <a href="mailto:info@arabic-astro.com" className="text-coral hover:underline">info@arabic-astro.com</a></div>
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
