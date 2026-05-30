'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

// ── External link icon ───────────────────────────────────────────────────────
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-40 shrink-0">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-40 shrink-0 rotate-180">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold text-ink-muted tracking-wider uppercase px-5 mt-6 mb-2">{children}</p>;
}

// ── Inline-edit row ──────────────────────────────────────────────────────────
function EditRow({
  label, value, type = 'text', masked, actionLabel = 'تعديل', actionStyle = 'button', hint, onSave,
}: {
  label: string; value: string; type?: string; masked?: boolean;
  actionLabel?: string; actionStyle?: 'button' | 'link'; hint?: string;
  onSave?: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  useEffect(() => { setDraft(value); }, [value]);

  const save = () => { onSave?.(draft); setEditing(false); };

  return (
    <div className="py-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink">{label}</div>
        {editing ? (
          <input
            ref={inputRef} type={type} value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
            className="mt-1.5 w-full text-sm text-ink bg-cream-soft border border-coral/40 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-coral/20"
            dir={type === 'email' || type === 'password' ? 'ltr' : 'rtl'}
          />
        ) : (
          <div className="text-sm text-ink-muted mt-0.5 truncate" dir={type === 'email' ? 'ltr' : 'rtl'}>
            {masked ? '••••••••••' : (value || '—')}
          </div>
        )}
        {hint && !editing && <div className="text-[11px] text-ink-muted mt-0.5 opacity-70">{hint}</div>}
      </div>
      {editing ? (
        <div className="flex gap-2 shrink-0 pt-1">
          <button onClick={save} className="px-4 py-1.5 rounded-full bg-ink text-cream text-xs font-medium">حفظ</button>
          <button onClick={() => { setDraft(value); setEditing(false); }} className="px-3 py-1.5 rounded-full bg-cream-soft text-ink-muted text-xs">إلغاء</button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className={`shrink-0 pt-0.5 ${
            actionStyle === 'link'
              ? 'text-sm text-coral font-medium'
              : 'px-4 py-1.5 rounded-full bg-cream-soft border border-rule-soft text-[13px] font-medium text-ink hover:bg-white transition-colors'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-6" dir="rtl">
      <div className="bg-white rounded-[24px] p-6 max-w-[340px] w-full shadow-xl">
        <h2 className="font-serif text-xl text-ink mb-2">حذف الحساب؟</h2>
        <p className="text-sm text-ink-muted leading-[1.7] mb-6">
          سيُحذف حسابك وجميع بياناتك بشكل نهائي خلال ٣٠ يومًا. لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="flex-1 py-3 rounded-[14px] bg-red-500 text-white font-medium text-sm">حذف الحساب</button>
          <button onClick={onCancel} className="flex-1 py-3 rounded-[14px] bg-cream-soft text-ink font-medium text-sm">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    setFirstName(localStorage.getItem('sukoon.first-name') || '');
    setLastName(localStorage.getItem('sukoon.last-name') || '');
    setEmail(localStorage.getItem('sukoon.email') || '');
  }, []);

  const persist = (key: string, val: string) => localStorage.setItem(key, val);

  const handleSignOut = async () => {
    await signOut();
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (k?.startsWith('sukoon.')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    router.push('/welcome');
  };

  const handleDeleteAccount = async () => {
    try { const sb = getSupabase(); if (sb) await sb.functions.invoke('delete-account'); } catch {}
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i); if (k?.startsWith('sukoon.')) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    router.push('/welcome');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@arabic-astro.com').then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  };

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || 'رفيق سُكون';

  return (
    <div className="pb-16 md:max-w-xl md:mx-auto" dir="rtl">
      {showDeleteModal && (
        <DeleteModal onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} />
      )}

      {/* ── Profile hero ── */}
      <div className="mx-5 mt-6 rounded-[20px] bg-cream-soft border border-rule-soft p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm border border-rule-soft">
          <img src="/sukoon-avatar.png" width={64} height={64} alt="صورة الملف" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-serif text-2xl text-ink">{displayName}</div>
          <div className="text-[13px] text-ink-muted mt-0.5">الحساب والإعدادات</div>
        </div>
      </div>

      {/* ── Personal info ── */}
      <SectionLabel>المعلومات الشخصية</SectionLabel>
      <div className="mx-5 bg-white rounded-[20px] border border-rule-soft divide-y divide-rule-soft overflow-hidden">
        <div className="px-5">
          <EditRow
            label="الاسم الأول"
            value={firstName}
            onSave={v => { setFirstName(v); persist('sukoon.first-name', v); }}
          />
        </div>
        <div className="px-5">
          <EditRow
            label="اسم العائلة"
            value={lastName}
            onSave={v => { setLastName(v); persist('sukoon.last-name', v); }}
          />
        </div>
        <div className="px-5">
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold text-ink">بيانات الميلاد</div>
              <div className="text-sm text-ink-muted mt-0.5">التاريخ · الوقت · المكان</div>
            </div>
            <Link
              href="/settings/edit-birth"
              className="shrink-0 px-4 py-1.5 rounded-full bg-cream-soft border border-rule-soft text-[13px] font-medium text-ink hover:bg-white transition-colors"
            >
              تعديل
            </Link>
          </div>
        </div>
      </div>

      {/* ── Account & security ── */}
      <SectionLabel>الحساب والأمان</SectionLabel>
      <div className="mx-5 bg-white rounded-[20px] border border-rule-soft divide-y divide-rule-soft overflow-hidden">
        <div className="px-5">
          <EditRow
            label="البريد الإلكتروني"
            value={email}
            type="email"
            hint={email ? undefined : 'لم يُضَف بعد'}
            onSave={v => { setEmail(v); persist('sukoon.email', v); }}
          />
        </div>
        <div className="px-5">
          <EditRow
            label="كلمة المرور"
            value="password"
            masked
            actionLabel="تغيير"
            actionStyle="link"
            onSave={() => router.push('/welcome')}
          />
        </div>
      </div>

      {/* ── Subscription ── */}
      <SectionLabel>الاشتراك</SectionLabel>
      <div className="mx-5 bg-white rounded-[20px] border border-rule-soft divide-y divide-rule-soft overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold text-ink">تفاصيل الاشتراك</div>
            <div className="text-sm text-ink-muted mt-0.5">غير نشط</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[13px] text-coral font-medium">إدارة الاشتراك</div>
            <div className="text-[11px] text-ink-muted mt-0.5">السجل · إلغاء العضوية</div>
          </div>
        </div>
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold text-ink">ربط الحسابات الاجتماعية</div>
            <div className="text-sm text-ink-muted mt-0.5">Google · Apple</div>
          </div>
          <button className="text-[13px] text-coral font-medium shrink-0">إدارة</button>
        </div>
      </div>

      {/* ── Legal & support ── */}
      <SectionLabel>الدعم والقانونية</SectionLabel>
      <div className="mx-5 bg-white rounded-[20px] border border-rule-soft divide-y divide-rule-soft overflow-hidden">
        <Link href="/privacy-policy" target="_blank" className="flex items-center justify-between px-5 py-4 hover:bg-cream-soft/50 transition-colors">
          <span className="text-sm text-ink">سياسة الخصوصية</span>
          <ExternalIcon />
        </Link>
        <Link href="/terms-and-conditions" target="_blank" className="flex items-center justify-between px-5 py-4 hover:bg-cream-soft/50 transition-colors">
          <span className="text-sm text-ink">الشروط والأحكام</span>
          <ExternalIcon />
        </Link>
        {/* Email us row */}
        <button
          onClick={handleCopyEmail}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream-soft/50 transition-colors text-right"
        >
          <div>
            <div className="text-sm text-ink">تواصل معنا</div>
            <div className="text-[12px] text-ink-muted mt-0.5" dir="ltr">info@arabic-astro.com</div>
          </div>
          <div className="shrink-0 text-[11px] text-coral font-medium">
            {copyDone ? 'تم النسخ ✓' : 'نسخ'}
          </div>
        </button>
      </div>

      {/* ── Danger zone ── */}
      <SectionLabel>الحساب</SectionLabel>
      <div className="mx-5 flex gap-3">
        <button
          onClick={handleSignOut}
          className="flex-1 py-3 rounded-[14px] bg-white border border-rule-soft text-sm font-medium text-ink hover:bg-cream-soft transition-colors"
        >
          تسجيل الخروج
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-3 rounded-[14px] bg-white border border-rule-soft text-sm font-medium text-red-400 hover:bg-red-50 transition-colors"
        >
          حذف الحساب
        </button>
      </div>

      <p className="text-center text-[11px] text-ink-muted mt-8 pb-4">
        © ٢٠٢٦ Arabic Astrology Academy Inc.
      </p>
    </div>
  );
}
