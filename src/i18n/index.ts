import ar, { type TranslationKey } from './ar';

const dictionaries = { ar } as const;
type Locale = keyof typeof dictionaries;

let currentLocale: Locale = 'ar';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function t(key: TranslationKey): string {
  return dictionaries[currentLocale][key];
}

export type { TranslationKey };
