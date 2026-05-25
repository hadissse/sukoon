const ar = {
  app_name: 'سُكون',

  // Tabs
  tab_today: 'اليوم',
  tab_explore: 'استكشاف',
  tab_self: 'ذاتك',

  // Header
  header_settings: 'الإعدادات',
  header_search: 'بحث',
  header_log_event: 'تسجيل لحظة',
  header_saved: 'المحفوظات',

  // Onboarding
  onboarding_welcome_title: 'أهلاً بك في سُكون',
  onboarding_welcome_subtitle: 'خريطتك. سماؤك. سُكونك.',
  onboarding_welcome_cta: 'ابدأ',
  onboarding_name_label: 'اسمك',
  onboarding_name_placeholder: 'أدخل اسمك',
  onboarding_birth_date_label: 'تاريخ ميلادك',
  onboarding_birth_time_label: 'وقت ميلادك',
  onboarding_birth_time_unknown: 'لا أعرف وقت ميلادي',
  onboarding_birth_place_label: 'مكان ميلادك',
  onboarding_birth_place_placeholder: 'ابحث عن مدينتك',
  onboarding_next: 'التالي',
  onboarding_back: 'رجوع',
  onboarding_calculating: 'جارٍ حساب خريطتك...',

  // Today
  today_reflection_placeholder: 'ما الذي تحمله اليوم؟',
  today_card_transit: 'العبور',
  today_card_body: 'الجسد',
  today_card_two_winds: 'الريحان',
  today_card_question: 'سؤال اليوم',
  today_card_learning: 'تعلّم',

  // Resonance voting
  vote_warm: 'دافئ',
  vote_quiet: 'هادئ',
  vote_stirring: 'محرّك',
  vote_flat: 'ساكن',

  // Self
  self_chart: 'الخريطة',
  self_subtab_planets: 'الكواكب',
  self_subtab_signs: 'الأبراج',
  self_subtab_houses: 'البيوت',
  self_subtab_aspects: 'الجوانب',
  self_subtab_fixed_stars: 'النجوم الثابتة',
  self_subtab_active: 'التأثيرات النشطة',
  self_body: 'الجسد',
  self_saved: 'ما حفظت',

  // Explore
  explore_tonight_sky: 'السماء الليلة',
  explore_life_arc: 'القوس الحياتي',
  explore_landmark_transits: 'العبورات الكونية الكبرى',

  // Event logger
  event_what_happened: 'ماذا حدث؟',
  event_which_stream: 'أي تيار؟',
  event_stream_feeling: 'شعور',
  event_stream_thinking: 'تفكير',
  event_stream_willing: 'إرادة',
  event_rhythm: 'إيقاع',
  event_placements: 'المواضع',
  event_save: 'حفظ',

  // Voice arc
  voice_observation: 'ملاحظة',
  voice_meaning: 'معنى',
  voice_shadow: 'ظلّ',
  voice_soul_question: 'سؤال الروح',
  voice_practice: 'ممارسة',

  // Settings
  settings_title: 'الإعدادات',
  settings_profile: 'الملف الشخصي',
  settings_calibration: 'المعايرة',
  settings_practice: 'الاستشارات والممارسة',
  settings_language: 'اللغة',
  settings_data: 'البيانات',
  settings_about: 'عن سُكون',
  settings_privacy: 'سياسة الخصوصية',
  settings_delete_account: 'حذف الحساب',

  // General
  general_loading: 'جارٍ التحميل...',
  general_error: 'حدث خطأ',
  general_retry: 'إعادة المحاولة',
  general_cancel: 'إلغاء',
  general_done: 'تمّ',
  general_applies: 'ينطبق',
} as const;

export type TranslationKey = keyof typeof ar;
export default ar;
