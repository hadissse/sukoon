import { SettingsSubHeader } from '@/components/SettingsSubHeader';

export default function PrivacyPage() {
  return (
    <div className="py-4">
      <SettingsSubHeader title="سياسة الخصوصية" />
      <div className="px-5 flex flex-col gap-4 text-sm text-ink-muted leading-[1.8] mt-2">
        <p>
          خصوصيتك أساسٌ في سُكون. تُحفظ بيانات ميلادك وخريطتك وأحداثك على جهازك أولًا،
          ولا تُشارك دون إذنك.
        </p>
        <p>
          نحسب خريطتك الفلكية محليًّا في متصفّحك — لا تُرسل لحظة ميلادك إلى خادمٍ خارجي
          لإجراء الحساب.
        </p>
        <p>
          يمكنك تصدير بياناتك أو حذفها في أي وقت من شاشة «البيانات».
        </p>
        <p className="text-ink">
          باستخدامك سُكون فأنت توافق على هذه السياسة. نحدّثها عند الحاجة وننبّهك بأي تغيير جوهري.
        </p>
      </div>
    </div>
  );
}
