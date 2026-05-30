'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

// ── Inline-edit row ──────────────────────────────────────────────────────────
function EditRow({
  label,
  value,
  type = 'text',
  masked,
  actionLabel = 'Edit',
  actionStyle = 'button',
  onSave,
}: {
  label: string;
  value: string;
  type?: string;
  masked?: boolean;
  actionLabel?: string;
  actionStyle?: 'button' | 'link';
  onSave?: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    onSave?.(draft);
    setEditing(false);
  };

  return (
    <div className="py-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink">{label}</div>
        {editing ? (
          <input
            ref={inputRef}
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
            className="mt-1 w-full text-sm text-ink bg-cream-soft border border-coral/40 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-coral/30"
            dir="ltr"
          />
        ) : (
          <div className="text-sm text-ink-muted mt-0.5 truncate" dir={type === 'email' ? 'ltr' : 'rtl'}>
            {masked ? '••••••••••' : (value || '—')}
          </div>
        )}
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
              : 'px-5 py-1.5 rounded-full bg-cream-soft border border-rule-soft text-sm font-medium text-ink hover:bg-white transition-colors'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-rule-soft" />;
}

// ── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-6">
      <div className="bg-white rounded-[24px] p-6 max-w-[340px] w-full shadow-xl">
        <h2 className="font-serif text-xl text-ink mb-2">حذف الحساب؟</h2>
        <p className="text-sm text-ink-muted leading-[1.7] mb-6">
          سيُحذف حسابك وجميع بياناتك بشكل نهائي خلال ٣٠ يومًا. لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-[14px] bg-red-500 text-white font-medium text-sm"
          >
            حذف الحساب
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-[14px] bg-cream-soft text-ink font-medium text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main settings page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Local state for editable fields (loaded from localStorage)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setFirstName(localStorage.getItem('sukoon.first-name') || '');
    setLastName(localStorage.getItem('sukoon.last-name') || '');
    setEmail(localStorage.getItem('sukoon.email') || '');
  }, []);

  const save = (key: string, val: string) => localStorage.setItem(key, val);

  const handleSignOut = async () => {
    await signOut();
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('sukoon.')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    router.push('/welcome');
  };

  const handleDeleteAccount = async () => {
    try {
      const sb = getSupabase();
      if (sb) await sb.functions.invoke('delete-account');
    } catch { /* ignore */ }
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('sukoon.')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    router.push('/welcome');
  };

  return (
    <div className="pb-16 md:max-w-xl md:mx-auto">
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* ── Profile hero card ── */}
      <div className="mx-5 mt-6 rounded-[20px] bg-cream-soft border border-rule-soft p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-rule-soft">
          <div
            className="w-8 h-8"
            style={{
              WebkitMaskImage: `url('/svg/moon.svg')`,
              maskImage: `url('/svg/moon.svg')`,
              WebkitMaskSize: 'contain', maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center', maskPosition: 'center',
              background: '#E9785E',
            }}
          />
        </div>
        <div>
          <div className="font-serif text-2xl text-ink">
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'رفيق سُكون'}
          </div>
          <div className="text-[13px] text-ink-muted mt-0.5">Account &amp; Settings</div>
        </div>
      </div>

      {/* ── Account fields ── */}
      <div className="mx-5 mt-5 bg-white rounded-[20px] border border-rule-soft divide-y divide-rule-soft overflow-hidden">
        <div className="px-5">
          <EditRow
            label="First name"
            value={firstName}
            onSave={(v) => { setFirstName(v); save('sukoon.first-name', v); }}
          />
        </div>
        <div className="px-5">
          <EditRow
            label="Last name"
            value={lastName}
            onSave={(v) => { setLastName(v); save('sukoon.last-name', v); }}
          />
        </div>
        <div className="px-5">
          <EditRow
            label="بيانات الميلاد"
            value="تعديل"
            actionLabel="Edit"
            onSave={() => router.push('/settings/edit-birth')}
          />
        </div>
        <div className="px-5">
          <EditRow
            label="Email address"
            value={email}
            type="email"
            onSave={(v) => { setEmail(v); save('sukoon.email', v); }}
          />
        </div>
        <div className="px-5">
          <EditRow
            label="Password"
            value="password"
            masked
            actionLabel="Change"
            actionStyle="link"
            onSave={() => router.push('/welcome')}
          />
        </div>
      </div>

      {/* ── Subscription ── */}
      <div className="mx-5 mt-4 bg-white rounded-[20px] border border-rule-soft overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold text-ink">Subscription details</div>
              <div className="text-sm text-ink-muted mt-0.5">Inactive</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm text-coral font-medium">Manage subscription</div>
              <div className="text-xs text-ink-muted mt-0.5">Payment history, cancel membership</div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold text-ink">Link social and email accounts</div>
            <div className="text-sm text-ink-muted mt-0.5">google</div>
          </div>
          <button className="text-sm text-coral font-medium shrink-0">Manage</button>
        </div>
      </div>

      {/* ── Legal & help links ── */}
      <div className="mx-5 mt-4 bg-white rounded-[20px] border border-rule-soft divide-y divide-rule-soft overflow-hidden">
        <Link href="/privacy-policy" target="_blank" className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-ink">Privacy policy</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-40">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </Link>
        <Link href="/terms-and-conditions" target="_blank" className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-ink">Terms &amp; Conditions</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-40">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </Link>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-ink">Help center</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted opacity-40">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="mx-5 mt-4 flex gap-3">
        <button
          onClick={handleSignOut}
          className="flex-1 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-sm font-medium text-ink hover:bg-white transition-colors"
        >
          Log out
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-3 rounded-[14px] bg-cream-soft border border-rule-soft text-sm font-medium text-ink-muted hover:bg-white transition-colors"
        >
          Delete account
        </button>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-[11px] text-ink-muted mt-8 pb-4">
        © 2026 Arabic Astrology Academy Inc.
      </p>
    </div>
  );
}
