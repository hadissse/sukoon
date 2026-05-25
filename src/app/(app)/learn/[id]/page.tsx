'use client';

// Course detail — Scr42 (overview), Scr43 (what you'll learn), Scr44 (lesson list).
// Tab-level (Header + TabBar). Dynamic param unwrapped with React.use (Next 16: params is a Promise).

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GradientOrb } from '@/components/GradientOrb';
import {
  gradientCss,
  PlayIcon,
  CheckIcon,
  DownloadIcon,
  MoreIcon,
  BackIcon,
} from '@/components/learn/primitives';
import { getCourse, COURSE_OUTCOMES } from '@/content/courses';

function CoursePoster({ title, course, variant }: { title: string; course: string; variant: string }) {
  const onLight = ['sage', 'dawn', 'lake', 'ember', 'dust'].includes(variant);
  const fg = onLight ? '#171B3A' : '#FFFFFF';
  return (
    <div
      className="rounded-[24px] relative overflow-hidden p-[22px] flex flex-col justify-end"
      style={{ height: 280, background: gradientCss(variant, 160), color: fg }}
    >
      <GradientOrb variant={variant} size={180} className="absolute -top-10 start-[-40px] opacity-60" />
      <div className="text-[11px] font-semibold relative" style={{ opacity: 0.85 }}>{course}</div>
      <div className="font-serif text-[30px] leading-tight mt-1.5 relative">{title}</div>
    </div>
  );
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const course = getCourse(id);
  const [tab, setTab] = useState<'about' | 'learn' | 'lessons'>('about');

  if (!course) notFound();

  return (
    <div className="px-5 pt-4 pb-28">
      {/* top bar */}
      <div className="flex items-center justify-between h-11">
        <Link href="/learn" className="text-ink-muted hover:text-ink">
          <BackIcon />
        </Link>
        <div className="flex items-center gap-4 text-ink-muted">
          <DownloadIcon />
          <MoreIcon />
        </div>
      </div>

      <div className="mt-3">
        <CoursePoster title={course.title} course={course.course} variant={course.variant} />
      </div>

      {/* tab switch */}
      <div className="mt-5 flex gap-2">
        {([
          ['about', 'نظرة عامة'],
          ['learn', 'ماذا ستتعلّم'],
          ['lessons', 'الجلسات'],
        ] as [typeof tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3.5 py-2 rounded-[14px] text-[13px] font-medium transition-colors ${
              tab === key ? 'bg-ink text-cream' : 'bg-white text-ink border border-rule-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scr42 — overview */}
      {tab === 'about' && (
        <div className="mt-5">
          <div className="font-serif text-[22px]">تعلّم أسس اليقظة، عشر دقائق كل مرة.</div>
          <p className="text-sm text-ink-muted mt-3 leading-[1.8]">{course.blurb}</p>
          <div className="mt-5 flex gap-3 flex-wrap">
            {course.tags.map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 bg-white rounded-full border border-sand text-ink">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scr43 — what you'll learn */}
      {tab === 'learn' && (
        <div className="mt-5">
          <div className="font-serif text-xl">ماذا ستتعلّم</div>
          <div className="mt-3 flex flex-col gap-3.5">
            {COURSE_OUTCOMES.map(([t, s], i) => (
              <div key={t} className="flex gap-3.5 items-start">
                <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center shrink-0 text-[13px] font-semibold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-[15px]">{t}</div>
                  <div className="text-[13px] text-ink-muted mt-0.5">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scr44 — lesson list */}
      {tab === 'lessons' && (
        <div className="mt-5">
          <div className="font-serif text-[15px] text-ink-muted">{course.lessons.length} جلسات · {course.teacher}</div>
          <div className="mt-3.5 flex flex-col gap-2">
            {course.lessons.map((t, i) => {
              const done = i < 2;
              const cur = i === 2;
              return (
                <div
                  key={t}
                  className="bg-white rounded-[14px] px-4 py-3.5 flex items-center gap-3.5"
                  style={{ border: `1px solid ${cur ? '#171B3A' : '#F0F0F0'}` }}
                >
                  <div
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: done ? '#171B3A' : cur ? '#E9785E' : 'transparent',
                      border: cur || done ? 'none' : '1.5px solid #F0F0F0',
                    }}
                  >
                    {done ? (
                      <CheckIcon size={14} className="text-cream" />
                    ) : cur ? (
                      <PlayIcon size={13} className="text-cream" />
                    ) : (
                      <span className="text-xs text-ink-muted font-semibold">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-medium text-sm text-ink"
                      style={{ textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}
                    >
                      {t}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">10 دقائق</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-7">
        <Link
          href={`/play/${course.id}`}
          className="block w-full text-center py-3.5 rounded-[14px] bg-ink text-cream text-sm font-medium hover:bg-ink-soft transition-colors"
        >
          {tab === 'lessons' ? 'تشغيل · 10 دقائق' : 'ابدأ اليوم الأول'}
        </Link>
      </div>
    </div>
  );
}
