import { SettingsSubHeader } from '@/components/SettingsSubHeader';
import { Card } from '@/components/Card';
import { Rule } from '@/components/Rule';

const links = ['شروط الخدمة', 'سياسة الخصوصية', 'شكر وتقدير'];

export default function AboutPage() {
  return (
    <div className="py-4">
      <SettingsSubHeader title="عن سُكون" />
      <div className="px-5 flex flex-col items-center text-center mt-6">
        <div className="font-serif text-3xl text-ink">سُكون</div>
        <div className="text-[13px] text-ink-muted mt-4">الإصدار ٠.١ · بناء ٢٠٢٦.٥</div>
        <p className="text-sm text-ink-muted mt-7 leading-[1.7] max-w-xs">
          صُنعت سُكون من فريق صغير من المتأمّلين والمصمّمين والباحثين، رفقةً هادئة في يومك.
        </p>
      </div>
      <div className="px-5 mt-8">
        <Card>
          <div className="flex flex-col">
            {links.map((t, i) => (
              <div key={t}>
                <div className="flex items-center justify-between py-3.5 text-ink">
                  <span className="text-base">{t}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 rotate-180">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
                {i < links.length - 1 && <Rule />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
