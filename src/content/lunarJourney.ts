// 8-phase lunar journey — one short prompt + practice per moon phase.
// Phase names match what cosmicStamp.ts returns from moonPhaseName().
// The cycle repeats every ~29 days, giving returning users fresh ground
// after they've completed the 7-step weekly journey.

export interface LunarPhase {
  key: string;
  name: string;             // phase name as returned by cosmicStamp
  arcTitle: string;         // descriptive title
  essence: string;          // 1-2 sentences on what this phase asks
  prompt: string;           // journaling question
  practice: string;         // small daily practice
  duration: string;         // approximate length in days, in Arabic
  accent: string;           // hex color
}

export const LUNAR_PHASES: LunarPhase[] = [
  {
    key: 'new',
    name: 'هلال جديد',
    arcTitle: 'البداية الصامتة',
    essence:
      'بدايةٌ صامتة. شيءٌ يُزرَع الآن قبل أن يُرى — لا تحتاج أن تعرف شكله بعد، فقط أن تختاره.',
    prompt: 'ما البذرة الصغيرة التي تختار أن تزرعها في هذه الدورة؟',
    practice: 'اكتب جملةً واحدة تبدأ بـ «أَنوي…» — جملة بسيطة وصادقة.',
    duration: '~٤ أيّام',
    accent: '#171B3A',
  },
  {
    key: 'waxing-crescent',
    name: 'هلال متزايد',
    arcTitle: 'العناية اليوميّة',
    essence:
      'البذرة تحتاج عنايةً يوميّة. لا قفزة هنا — مجرّد لمسةٍ متكرّرة بإيقاعٍ هادئ.',
    prompt: 'ما الخطوة الصغيرة التي تُعطيها هذه الأيّام لما زرعتَه في الجديد؟',
    practice: 'أعطِ نيّتك خمس دقائق اليوم — لا أكثر. الاستمراريّة مهمّة الآن، لا الكثافة.',
    duration: '~٤ أيّام',
    accent: '#5A3E7A',
  },
  {
    key: 'first-quarter',
    name: 'تربيع أول',
    arcTitle: 'القرار الأوّل',
    essence:
      'أوّل احتكاكٍ يطلب قرارًا. ما يحاول أن يطفو الآن يحتاج إلى وضوحٍ منك، لا إلى تردّد.',
    prompt: 'أين تجد المقاومة في ما تسعى إليه — وهل المقاومة فيك أم في الطريق؟',
    practice: 'قُل لا لشيءٍ واحد اليوم لتقول نعم لما يهمّك حقًّا.',
    duration: '~٣ أيّام',
    accent: '#7E97B8',
  },
  {
    key: 'waxing-gibbous',
    name: 'أحدب متزايد',
    arcTitle: 'التهذيب قبل الذروة',
    essence:
      'ما زرعتَه ينضج لكنّه لم يكتمل بعد. هذا وقت التهذيب لا الإنجاز.',
    prompt: 'ماذا يحتاج صقلًا قبل أن يصل إلى البدر — في عملك أو علاقتك أو نفسك؟',
    practice: 'راجع ما بدأتَه في الجديد — وأَعِد ضبطه بصدقٍ، لا بكمال.',
    duration: '~٤ أيّام',
    accent: '#8FA084',
  },
  {
    key: 'full',
    name: 'بدر',
    arcTitle: 'الذروة المضاءة',
    essence:
      'كلّ شيءٍ مكشوفٌ الآن. ما كان مخفيًّا يُضاء، وما كان متّسعًا يصل إلى ذروته.',
    prompt: 'ما الذي يُضاء فيك هذه الأيّام — وهل ترحّب بما يَظهر، أم تخاف منه؟',
    practice: 'اخرج إلى نور القمر إن استطعت. اكتب ما تراه — لا ما تريد أن تراه.',
    duration: '~٣ أيّام',
    accent: '#E9785E',
  },
  {
    key: 'waning-gibbous',
    name: 'أحدب متناقص',
    arcTitle: 'العطاء والامتنان',
    essence:
      'ما اكتمل في البدر يُعطى الآن. هذا وقت العطاء والامتنان لا الاحتفاظ.',
    prompt: 'ما الذي تستطيع أن تشاركه أو تَرويه ممّا تعلّمتَه في هذه الدورة؟',
    practice: 'اشكر أحدًا اليوم — بكلامٍ صادق، لا بمجاملةٍ تلقائيّة.',
    duration: '~٤ أيّام',
    accent: '#D4A04C',
  },
  {
    key: 'last-quarter',
    name: 'تربيع أخير',
    arcTitle: 'الإفلات والمغفرة',
    essence:
      'وقت إفراغ ما لم يعد يلزم. الإفلات ليس فقدًا — هو مكانٌ يُخلَى لما هو آتٍ.',
    prompt: 'ما الذي ينتهي صلاحيّته فيك الآن — عادة، علاقة، اعتقاد عن نفسك؟',
    practice: 'اكتب ثمّ احرق (أو احذف) — جملةً واحدة تَوَدّع فيها شيئًا.',
    duration: '~٣ أيّام',
    accent: '#BDAA82',
  },
  {
    key: 'waning-crescent',
    name: 'هلال متناقص',
    arcTitle: 'الراحة والإصغاء',
    essence:
      'أرضٌ راحت بعد المحصول. لا شيء يُطلَب منك الآن سوى الإصغاء، وانتظار جديدٍ آخر.',
    prompt: 'أين تحتاج إلى الصمت أكثر ممّا تحتاج إلى الفعل؟',
    practice: 'خذ ساعةً اليوم بلا شاشات. مجرّد جلوس مع نَفَسك ومع نَفَسٍ هادئ.',
    duration: '~٤ أيّام',
    accent: '#5C5C7A',
  },
];

// Map cosmicStamp's phase-name string to a LunarPhase entry.
export function findPhase(stampPhaseName: string): LunarPhase {
  return (
    LUNAR_PHASES.find((p) => stampPhaseName.startsWith(p.name)) ?? LUNAR_PHASES[0]
  );
}
