'use client';

import { IconBack, Orb, PALETTE, PrimaryBtn, ProgressBar } from '@/components/onboarding/PreAppUI';

export interface IntroSlide {
  orb: 'dawn' | 'sage' | 'lake' | 'ember' | 'night' | 'dusk';
  media?: string;
  title: string;
  subtitle: string;
  cta?: string;
  dark?: boolean;
}

export const INTRO_SLIDES: IntroSlide[] = [
  { orb: 'dawn', title: 'سكون لكل لحظة', subtitle: 'دقائق من اليقظة — بين الاجتماعات، قبل النوم، أو حين تعلو ضوضاء الحياة.' },
  { orb: 'sage', title: 'مبنيّة على البحث', subtitle: 'تستند ممارساتنا إلى ثلاثة عقود من العمل السريري على اليقظة، وأكثر من 150 دراسة محكّمة.' },
  { orb: 'lake', title: 'مفصّلة على يومك', subtitle: 'ممارسة تتكيّف مع مزاجك، وطاقتك، والوقت المتاح لديك.' },
  { orb: 'ember', title: 'شاهد رحلتك تتفتّح', subtitle: 'سلاسل من الأيام، وتأمّلات، وسجلّ هادئ لحضورك.' },
  { orb: 'night', title: 'انجرف إلى النوم', subtitle: 'حكايات للنوم، ومشاهد صوتية، وقصص بطيئة تعينك على الراحة.', dark: true },
  { orb: 'dusk', title: 'وتحدّث إلى أحدهم كذلك', subtitle: 'حين تحتاج إلى أكثر من التأمّل، معالجونا المعتمدون على بُعد لمسة.' },
  { orb: 'sage', media: '/media/crowd.jpg', title: 'لستَ وحدك', subtitle: 'أكثر من 80 مليون شخص يمارسون مع سُكون — في كل منطقة زمنية.' },
  { orb: 'dawn', media: '/media/color-wheel.webp', title: 'لنبدأ', subtitle: 'بضعة أسئلة سريعة لنرسم ممارستك.', cta: 'ابدأ الآن' },
];

const SLIDE_BG: Record<string, string> = {
  dawn: '#F0E4D5', sage: '#D8E3D4', lake: '#CCDBE8',
  ember: '#F0D8B8', night: '#0F1228', dusk: '#DDD0E8',
};
const MEDIA_BG: Record<string, string> = {
  '/media/crowd.jpg': '#5C4530',
  '/media/color-wheel.webp': '#1C1030',
};

export function IntroCarousel({ slide, progress, onBack, onSkip, onNext }: {
  slide: IntroSlide; progress: number;
  onBack: () => void; onSkip: () => void; onNext: () => void;
}) {
  const hasMedia = !!slide.media;
  const dark = slide.dark ?? hasMedia;
  const txt = dark ? PALETTE.cream : PALETTE.ink;
  const mute = dark ? 'rgba(241,236,222,0.65)' : PALETTE.inkMuted;
  const slideBg = hasMedia
    ? (MEDIA_BG[slide.media!] ?? '#1a1025')
    : (slide.dark ? PALETTE.midnight : (SLIDE_BG[slide.orb] ?? '#F5F2EA'));

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden" style={{ background: slideBg }}>
      {hasMedia && (
        <>
          <img src={slide.media!} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.68) 100%)' }} />
        </>
      )}
      <div className="relative flex-1 px-6 pt-[60px] flex flex-col">
        <div className="flex items-center justify-between h-11">
          <button type="button" onClick={onBack} aria-label="رجوع"><IconBack color={txt} /></button>
          <ProgressBar value={progress} dark={dark} />
          <button type="button" onClick={onSkip} className="text-sm" style={{ color: mute }}>تخطّي</button>
        </div>
        {!hasMedia && (
          <div className="h-[280px] mt-[30px] flex items-center justify-center">
            <Orb variant={slide.orb} size={220} />
          </div>
        )}
        <div className={hasMedia ? 'mt-auto pb-4' : 'mt-6'}>
          <h1 className="font-serif text-[30px] leading-[1.3]" style={{ color: txt }}>{slide.title}</h1>
          <p className="text-[15px] mt-3 leading-[1.7]" style={{ color: mute }}>{slide.subtitle}</p>
        </div>
      </div>
      <div className="relative px-5 pb-14">
        <PrimaryBtn dark={dark} onClick={onNext}>{slide.cta ?? 'متابعة'}</PrimaryBtn>
      </div>
    </div>
  );
}
