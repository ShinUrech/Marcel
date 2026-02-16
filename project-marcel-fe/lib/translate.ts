import translations from '../locales/en.json';

type TranslationKeys = keyof typeof translations;
export function t(key: TranslationKeys): string {
  return translations[key] || key;
}
